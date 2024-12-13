import { ForbiddenException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentDto } from './dto';
import { Request } from 'express';
import { format } from 'date-fns';
import { stringify } from 'qs';
import { UserEntity } from '../types/user';
import {
    OrderEntity,
    OrderStatusHistoryEntity,
    PaymentInfoEntity,
} from '../types/order';
import {
    ProductVariantEntity,
} from '../types/product';
import { canTransitionTo, getOrderStatusFromText } from '../order/order-status';

@Injectable()
export class PaymentService {

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(PaymentInfoEntity) private paymentRepository: Repository<PaymentInfoEntity>,
        @InjectRepository(OrderStatusHistoryEntity) private orderHistoryRepository: Repository<OrderStatusHistoryEntity>,
        @InjectRepository(ProductVariantEntity) private productVariantRepository: Repository<ProductVariantEntity>,
    ) { }



    async generateVnpay(payment: PaymentDto, req: Request, user: UserEntity) {
        const order = await this.orderRepository.findOne({
            where: {
                orderUid: payment.orderUid,
                customerInfo: {
                    userId: user.secretKey
                }
            },
            relations: [
                'deliveryInfo',
                'customerInfo',
                'orderProducts',
                'orderProducts.product',
                'orderProducts.product.details.imgDisplay',
                'orderProducts.product.details.brand',
            ]
        });

        if (!order) throw new ForbiddenException(`Order with ID ${payment.orderUid} not found`);

        const ipAddr = req.headers['x-forwarded-for'];

        const tmnCode = "CGXZLS0Z";
        const secretKey = "XNBCJFAKAZQSGTARRLGCHVZWCIOIGSHN"
        const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        const returnUrl = `http://localhost:3434/payment/validate/${user.secretKey}/${payment.orderUid}`

        const date = new Date();

        const currCode = 'VND';
        const vnp_Params: any = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = "vn";
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = format(date, 'HHmmss');
        vnp_Params['vnp_OrderInfo'] = payment.orderUid;
        vnp_Params['vnp_OrderType'] = "billpayment";
        vnp_Params['vnp_Amount'] = order.totalAmount;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] =  format(date, 'yyyyMMddHHmmss');
        vnp_Params['vnp_BankCode'] = 'VNBANK';

        const sortedParams = this.sortObject(vnp_Params);
        const signData = stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        sortedParams['vnp_SecureHash'] = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        const vnpRedirectUrl = vnpUrl + '?' + stringify(sortedParams, { encode: false });


        return { status: 'Ok', url: vnpRedirectUrl };
    }
    
    async validateOrder(userId: string, billId: string) {
        const order = await this.orderRepository.findOne({
            where: {
                orderUid: billId,
                customerInfo: {
                    userId: userId
                }
            },
            relations: [
                'deliveryInfo',
                'customerInfo',
                'orderProducts',
                'orderProducts.productVariant',
                'orderProducts.product',
                'orderProducts.product.details.imgDisplay',
                'orderProducts.product.details.brand',
            ]
        });

        if (!order) {
            return { status: false }
        }

        order.paymentInfo.isPaid = true
        await this.paymentRepository.save(order.paymentInfo)

        const historyInfo = this.orderHistoryRepository.create({
            previousStatus: order.status,
            newStatus: 'Confirmed',
        });

        order.statusHistory.push(await this.orderHistoryRepository.save(historyInfo))
        const current = getOrderStatusFromText(order.status)
        const nextStatus = getOrderStatusFromText("Confirmed")

        if (!canTransitionTo(current, nextStatus)) {
            order.status = "Confirmed"
        }


        for (let i = 0; i < order.orderProducts.length; i++) {
            if (order.orderProducts[i].quantity < order.orderProducts[i].imei.length
              && order.orderProducts[i].productVariant.stockQuantity >= (order.orderProducts[i].quantity - order.orderProducts[i].imei.length))
            {
                order.orderProducts[i].imei.push(
                  ...order.orderProducts[i].productVariant.imeiList.slice(
                    0,
                    order.orderProducts[i].quantity - order.orderProducts[i].imei.length
                  )
                );
                await this.productVariantRepository.save(order.orderProducts[i])
            }
        }


        await this.orderRepository.save(order);

        return { status: true }
    }

    private sortObject(obj: any) {
        const sorted = {};
        const str = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (let key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
        }
        return sorted;
    }
}