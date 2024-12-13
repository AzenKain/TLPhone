import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    CustomerInfoEntity,
    DeliveryInfoEntity,
    OrderEntity,
    OrderProductEntity,
    OrderStatusHistoryEntity, PaymentInfoEntity,
} from 'src/types/order';
import { UserEntity } from 'src/types/user';
import { Repository } from 'typeorm';
import { confirmOrderDto, createOrderDto, SearchOrderDto, updateOrderDto } from './dtos';
import {
    ImageDetailEntity,
    ProductDetailEntity,
    ProductEntity,
    ProductVariantEntity,
    TagsEntity,
} from 'src/types/product';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CartService } from '../cart/cart.service';
import { canTransitionTo, getOrderStatusFromText, OrderStatus } from './order-status';

@Injectable()
export class OrderService {
    constructor(
        private cart: CartService,
        private readonly httpService: HttpService,
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(DeliveryInfoEntity) private deliveryRepository: Repository<DeliveryInfoEntity>,
        @InjectRepository(CustomerInfoEntity) private customerRepository: Repository<CustomerInfoEntity>,
        @InjectRepository(PaymentInfoEntity) private paymentRepository: Repository<PaymentInfoEntity>,
        @InjectRepository(OrderProductEntity) private orderProductRepository: Repository<OrderProductEntity>,
        @InjectRepository(OrderStatusHistoryEntity) private orderHistoryRepository: Repository<OrderStatusHistoryEntity>,
        @InjectRepository(ProductVariantEntity) private productVariantRepository: Repository<ProductVariantEntity>,
        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    ) { }

    async CreateOrderByListService(dto: createOrderDto[], user: UserEntity) {
        const dataReturn : OrderEntity[] = []
        for (const order of dto) {
            dataReturn.push(await this.CreateOrderService(order, user))
        }
        return dataReturn
    }

    async GetReportOrder(dto: SearchOrderDto , user: UserEntity) {

        const dataRequest: OrderEntity[] = (await this.SearchOrderWithOptionsServices(dto, user)).data;

        const requestBody = {
            data: dataRequest,
            type: 'ReportOrder'
        };

        const response = await firstValueFrom(
        this.httpService.post('http://localhost:8000/export-file', requestBody, {
            responseType: 'arraybuffer',
        }),
        );

        return response.data;
    }

    async getOrderDetail(time: string = 'week') {

        let dateCondition: string;

        switch (time) {
            case 'week':
                dateCondition = "DATE_SUB(CURDATE(), INTERVAL 1 WEEK)";
                break;
            case 'month':
                dateCondition = "DATE_SUB(CURDATE(), INTERVAL 1 MONTH)";
                break;
            case 'year':
                dateCondition = "DATE_SUB(CURDATE(), INTERVAL 1 YEAR)";
                break;
            default:
                throw new ForbiddenException('Invalid time period');
        }

        return await this.orderProductRepository
            .createQueryBuilder('orderProduct')
            .select('orderProduct.productId', 'productId')
            .addSelect('SUM(orderProduct.quantity)', 'totalQuantity')
            .leftJoin('orderProduct.order', 'order')
            .where('order.created_at >= ' + dateCondition)
            .groupBy('orderProduct.productId')
            .orderBy('totalQuantity', 'DESC')
            .getRawMany();
    }



    private CheckRoleUser(user: UserEntity) {
        if (!user.role.includes("ADMIN") && !user.role.includes("SALES")) {
            throw new ForbiddenException('The user does not have permission');
        }
    }


    async SearchOrderWithOptionsServices(dto: SearchOrderDto, user: UserEntity) {
        this.CheckRoleUser(user);


        const query = this.orderRepository.createQueryBuilder('order')
          .leftJoinAndSelect('order.customerInfo', 'customerInfo')
          .leftJoinAndSelect('order.deliveryInfo', 'deliveryInfo')
          .leftJoinAndSelect('order.statusHistory', 'statusHistory')
          .leftJoinAndSelect('statusHistory.user', 'user')
          .leftJoinAndSelect('user.details', 'userDetails')
          .leftJoinAndSelect('order.paymentInfo', 'paymentInfo')
          .leftJoinAndSelect('order.orderProducts', 'orderProducts')
          .leftJoinAndSelect('orderProducts.product', 'product')
          .leftJoinAndSelect('orderProducts.productVariant', 'productVariant')
          .leftJoinAndSelect('product.details', 'productDetails')
          .leftJoinAndSelect('productDetails.imgDisplay', 'productImg')
          .leftJoinAndSelect('productDetails.brand', 'productBrand');

        if (dto.orderId) {
            query.andWhere('order.orderUid = :orderId', { orderId: dto.orderId });
        }

        if (dto.status) {
            query.andWhere('order.status = :status', { status: dto.status });
        }
        if (dto.email) {
            query.andWhere('LOWER(customerInfo.email) LIKE :email', { email: `%${dto.email.toLowerCase()}%` });
        }

        if (dto.firstName) {
            query.andWhere('LOWER(customerInfo.firstName) LIKE :firstName', { firstName: `%${dto.firstName.toLowerCase()}%` });
        }

        if (dto.lastName) {
            query.andWhere('LOWER(customerInfo.lastName) LIKE :lastName', { lastName: `%${dto.lastName.toLowerCase()}%` });
        }

        // Lọc theo số điện thoại của khách hàng
        if (dto.phoneNumber) {
            query.andWhere('customerInfo.phoneNumber LIKE :phoneNumber', { phoneNumber: `%${dto.phoneNumber}%` });
        }

        if (dto.rangeMoney && dto.rangeMoney.length === 2) {
            const [minPrice, maxPrice] = dto.rangeMoney;
            query.andWhere('order.totalAmount BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
        }

        if (dto.sort) {
            switch (dto.sort) {
                case 'price_asc':
                    query.orderBy('order.totalAmount', 'ASC');
                    break;
                case 'price_desc':
                    query.orderBy('order.totalAmount', 'DESC');
                    break;
                case 'created_at_asc':
                    query.orderBy('order.created_at', 'ASC');
                    break;
                case 'created_at_desc':
                    query.orderBy('order.created_at', 'DESC');
                    break;
                case 'updated_at_asc':
                    query.orderBy('order.updated_at', 'ASC');
                    break;
                case 'updated_at_desc':
                    query.orderBy('order.updated_at', 'DESC');
                    break;
                default:
                    break;
            }
        }

        const maxValue = await query.getCount();
        if (dto.index < 0) {
            dto.index = 0
            dto.count = 0
        }
        if (dto.index !== undefined && dto.count !== undefined) {
            query.skip(dto.index).take(dto.count);
        }

        const orders = await query.getMany();

        return { maxValue, data: orders };
    }


    async CreateOrderService(dto: createOrderDto, user: UserEntity) {
        this.CheckRoleUser(user);
        const shippingFee : Record<string, number> = {
            "standard" : 25000,
            "fast": 75000
        }
        const paymentType : string[] = ["COD", "VNPAY"];
        if (!paymentType.includes(dto.paymentType)) {
            throw new ForbiddenException('Payment type is not valid');
        }
        if (!shippingFee.hasOwnProperty(dto.deliveryInfo.deliveryType)) {
            throw new ForbiddenException('Delivery type is not valid');
        }
        const customerInfo = this.customerRepository.create({
            firstName: dto.customerInfo.firstName,
            lastName: dto.customerInfo.lastName,
            email: dto.customerInfo.email,
            phoneNumber: dto.customerInfo.phoneNumber,
            userId: user.secretKey,
        });


        const deliveryInfo = this.deliveryRepository.create({
            deliveryType: dto.deliveryInfo.deliveryType,
            discount: 0,
            city: dto.deliveryInfo.city && "",
            district: dto.deliveryInfo.district && "",
            address: dto.deliveryInfo.address,
            deliveryFee: shippingFee[dto.deliveryInfo.deliveryType]
        });


        const paymentInfo = this.paymentRepository.create({
            isPaid: false,
            paymentType: dto.paymentType
        });


        const order = this.orderRepository.create({
            status: OrderStatus.Pending,
            notes: dto.notes ? dto.notes : '',
            deliveryInfo: await this.deliveryRepository.save(deliveryInfo),
            customerInfo: await this.customerRepository.save(customerInfo),
            isDisplay: true,
            paymentInfo: await this.paymentRepository.save(paymentInfo),
            totalAmount: 0,
            orderProducts: [],
            statusHistory: [],
            orderUid: ""
        });


        const savedOrder = await this.orderRepository.save(order);
        savedOrder.orderUid = "HD-" + savedOrder.id.toString()
        const historyInfo = this.orderHistoryRepository.create({
            user: user,
            previousStatus: OrderStatus.Created,
            newStatus: OrderStatus.Pending,
        });

        savedOrder.statusHistory.push(await this.orderHistoryRepository.save(historyInfo))

        const cartUser = await this.cart.GetCartById(user.cart.id);

        let totalAmount = 0;
        for (const product of cartUser.cartProducts) {

            const orderProduct = this.orderProductRepository.create({
                quantity: product.quantity,
                discount: 0,
                unitPrice: product.productVariant.displayPrice,
                originPrice: product.productVariant.originPrice,
                product: product.product,
                hasImei: product.productVariant.hasImei,
                imei: [],
                variantAttributes: product.productVariant.attributes,
                productVariant: product.productVariant,

            });
    
            totalAmount += orderProduct.unitPrice * (1 - orderProduct.discount) * product.quantity;
            const tmpOrderProduct = await this.orderProductRepository.save(orderProduct);

            order.orderProducts.push(tmpOrderProduct)
        }

        savedOrder.totalAmount = totalAmount * 1.1 + savedOrder.deliveryInfo.deliveryFee * (1 - savedOrder.deliveryInfo.discount);
        await this.cart.RefreshCart(user)
        return await this.orderRepository.save(savedOrder);
    }
    

    async UpdateOrderService(dto: updateOrderDto, user: UserEntity) {
        this.CheckRoleUser(user);

        const order = await this.orderRepository.findOne({
            where: {
                id: dto.orderId
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
                'orderProducts.product.details.imgDisplay',
                'orderProducts.product.details.brand',
            ]
        });

        if (!order) {
            throw new NotFoundException(`Order with ID ${dto.orderId} not found`);
        }


        if (dto.status) {
            const current = getOrderStatusFromText(order.status)
            const nextStatus = getOrderStatusFromText(dto.status)

            if (!nextStatus) {
                throw new ForbiddenException("Order status is not valid")
            }

            if (!canTransitionTo(current, nextStatus)) {
                throw new ForbiddenException("Next status is not valid")
            }
            const historyInfo = this.orderHistoryRepository.create({
                user: user,
                previousStatus: order.status,
                newStatus: dto.status,
            });

            order.statusHistory.push(await this.orderHistoryRepository.save(historyInfo))

            order.status = dto.status;

        }
        if (dto.status === OrderStatus.Cancelled) {
            for (const it of order.orderProducts) {
                it.productVariant.stockQuantity += it.imei.length;
                it.productVariant.imeiList.push(...it.imei);
                await this.productVariantRepository.save(it.productVariant);
            }
        }
        if (dto.status === OrderStatus.Completed) {
            for (const it of order.orderProducts) {
                it.product.buyCount += it.quantity;
                await this.productRepository.save(it.product);
            }
        }
        if (dto.isPaid !== undefined) {
            order.paymentInfo.isPaid = dto.isPaid
            await this.paymentRepository.save(order.paymentInfo)
        }

        return await this.orderRepository.save(order);
    }

    async ConfirmOrderService(dto: confirmOrderDto, user: UserEntity) {
        this.CheckRoleUser(user);

        const order = await this.orderRepository.findOne({
            where: {
                id: dto.orderId,

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
                'orderProducts.product.details.imgDisplay',
                'orderProducts.product.details.brand',
            ]
        });
        if (!order) {
            throw new NotFoundException(`Order with ID ${dto.orderId} not found`);
        }
        if (order.status !== 'Pending') {
            throw new ForbiddenException(`Order status is not pending`);
        }


        for (const product of dto.orderList) {
            const it = order.orderProducts.findIndex(x => x.id === product.orderProductId);

            if (it !== -1) {
                const imeiCount = order.orderProducts[it].productVariant.imeiList.filter(x => product.imei.includes(x))

                if (imeiCount.length !== product.imei.length || imeiCount.length !== order.orderProducts[it].quantity) {
                    throw new ForbiddenException(`Imei is not valid`);
                }

                order.orderProducts[it].imei = product.imei
                order.orderProducts[it] = await this.orderProductRepository.save(order.orderProducts[it]);
                if (order.paymentInfo.paymentType === "COD") {
                    order.orderProducts[it].productVariant.stockQuantity -= product.imei.length
                    order.orderProducts[it].productVariant.imeiList = order.orderProducts[it].productVariant.imeiList.filter(x => !product.imei.includes(x))
                    await this.productVariantRepository.save(order.orderProducts[it].productVariant)
                }
            }
        }
        const historyInfo = this.orderHistoryRepository.create({
            user: user,
            previousStatus: order.status,
            newStatus: OrderStatus.Confirmed,
        });

        order.statusHistory.push(await this.orderHistoryRepository.save(historyInfo))

        order.status = OrderStatus.Confirmed;
        return await this.orderRepository.save(order);
    }
    async GetOrderById(orderId: number, user: UserEntity) {

        const order = await this.orderRepository.findOne({
            where: {
                id: orderId,
                customerInfo: {
                    userId: user.secretKey
                    }
                },
            relations: [
                'deliveryInfo',
                'customerInfo',
                'orderProducts',
                'paymentInfo',
                'orderProducts.product',
                'orderProducts.productVariant',
                'orderProducts.product.details.imgDisplay',
                'orderProducts.product.details.brand',
            ]
        });

        if (!order) throw new ForbiddenException(`Order with ID ${orderId} not found`);

        return order;
    }

    async GetListOrderByUser(user: UserEntity) {

        return await this.orderRepository.find({
            where: {
                customerInfo: {
                    userId: user.secretKey
                }
            },
            relations: [
                'deliveryInfo',
                'customerInfo',
                'orderProducts',
                'paymentInfo',
                'orderProducts.product',
                'orderProducts.productVariant',
                'orderProducts.product.details.imgDisplay',
                'orderProducts.product.details.brand',
            ]
        });

    }

}
