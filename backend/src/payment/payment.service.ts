import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentDto, PaymentQueryDto } from './dto';
import { Request } from 'express';
import { addHours } from 'date-fns';
import * as moment from "moment";
import { stringify } from 'qs';
import { UserEntity } from '../types/user';

import {
  OrderEntity,
  OrderStatusHistoryEntity,
  PaymentInfoEntity,
} from '../types/order';
import { ProductVariantEntity } from '../types/product';
import { canTransitionTo, getOrderStatusFromText } from '../order/order-status';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    private readonly httpService: HttpService,
    private config: ConfigService,
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(PaymentInfoEntity)
    private paymentRepository: Repository<PaymentInfoEntity>,
    @InjectRepository(OrderStatusHistoryEntity)
    private orderHistoryRepository: Repository<OrderStatusHistoryEntity>,
    @InjectRepository(ProductVariantEntity)
    private productVariantRepository: Repository<ProductVariantEntity>,
  ) {}

  async generateVnpay(payment: PaymentDto, req: Request, user: UserEntity) {
      process.env.TZ = 'Asia/Ho_Chi_Minh';

      const order = await this.orderRepository.findOne({
      where: {
        orderUid: payment.orderUid,
        customerInfo: {
          userId: user.secretKey,
        },
      },
      relations: [
        'deliveryInfo',
        'customerInfo',
        'orderProducts',
        'paymentInfo',
        'statusHistory',
        'statusHistory.user',
        'orderProducts.product',
        'orderProducts.productVariant',
      ],
    });

    if (!order)
      throw new ForbiddenException(
        `Order with ID ${payment.orderUid} not found`,
      );

    if (order.paymentInfo.isPaid) {
      throw new ForbiddenException(`The order is paid`);
    }
    for (const od of order.orderProducts) {
      if (od.quantity > od.productVariant.stockQuantity) {
        throw new ForbiddenException(
          `The quantity of goods in stock is not enough`,
        );
      }
    }
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      null;

    const tmnCode = this.config.get('vnp_TmnCode');
    const secretKey = this.config.get('vnp_HashSecret');
    const vnpUrl = this.config.get('vnp_Url');
    const returnUrl = `http://localhost:3434/payment/vnpay_return/${user.secretKey}/${order.orderUid}`;


    const date = new Date();
    const orderId = moment(date).format('DDHHmmss');
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const newDate = addHours(date, 4);
    const expireDate = moment(newDate).format('YYYYMMDDHHmmss');
    const currCode = 'VND';
    const vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho: ' + order.orderUid;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = order.totalAmount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = expireDate
    const sortedParams = this.sortObject(vnp_Params);
    const signData = stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    sortedParams['vnp_SecureHash'] = hmac
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    return { url: vnpUrl + '?' + stringify(sortedParams, { encode: false }) };
  }

  async validateOrder(
    userId: string,
    billId: string,
    vnp_Params: PaymentQueryDto,
  ) {

    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const vnp_Params_new = this.sortObject(vnp_Params);
    const tmnCode = this.config.get('vnp_TmnCode');
    const secretKey = this.config.get('vnp_HashSecret');

    const signData = stringify(vnp_Params_new, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash !== signed) {
      return { status: false };
    }

    if (vnp_Params_new['vnp_ResponseCode'] !== '00') {
      return { status: false };
    }

    const order = await this.orderRepository.findOne({
      where: {
        orderUid: billId,
        customerInfo: {
          userId: userId,
        },
      },
      relations: [
        'deliveryInfo',
        'customerInfo',
        'orderProducts',
        'paymentInfo',
        'statusHistory',
        'statusHistory.user',
        'orderProducts.product',
        'orderProducts.productVariant',
      ],
    });

    if (!order) {
      return { status: false };
    }

    order.paymentInfo.isPaid = true;
    order.paymentInfo.bankCode = vnp_Params.vnp_BankCode
    order.paymentInfo.invoiceId = vnp_Params.vnp_TxnRef
    order.paymentInfo.tranId = vnp_Params.vnp_TransactionNo
    order.paymentInfo.bankTranId = vnp_Params.vnp_BankTranNo
    order.paymentInfo.cardType = vnp_Params.vnp_CardType
    order.paymentInfo.payDate = vnp_Params.vnp_PayDate

    await this.paymentRepository.save(order.paymentInfo);

    const historyInfo = this.orderHistoryRepository.create({
      previousStatus: order.status,
      newStatus: 'Confirmed',
    });

    order.statusHistory.push(
      await this.orderHistoryRepository.save(historyInfo),
    );
    const current = getOrderStatusFromText(order.status);
    const nextStatus = getOrderStatusFromText('Confirmed');

    if (!canTransitionTo(current, nextStatus)) {
      order.status = 'Confirmed';
    }

    for (let i = 0; i < order.orderProducts.length; i++) {
      if (
        order.orderProducts[i].quantity < order.orderProducts[i].imei.length &&
        order.orderProducts[i].productVariant.stockQuantity >=
          order.orderProducts[i].quantity - order.orderProducts[i].imei.length
      ) {
        order.orderProducts[i].imei.push(
          ...order.orderProducts[i].productVariant.imeiList.slice(
            0,
            order.orderProducts[i].quantity -
              order.orderProducts[i].imei.length,
          ),
        );
        await this.productVariantRepository.save(order.orderProducts[i]);
      }
    }

    await this.orderRepository.save(order);

    return { status: true };
  }

  private sortObject(object: any) {
    const sorted = {};
    const keys = [];
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        keys.push(encodeURIComponent(key));
      }
    }
    keys.sort();
    for (let i = 0; i < keys.length; i++) {
      sorted[keys[i]] = encodeURIComponent(object[keys[i]]).replace(
        /%20/g,
        '+',
      );
    }
    return sorted;
  }
}