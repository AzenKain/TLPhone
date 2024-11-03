import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteElementProductType, RevenueType } from 'src/types/analytics';
import { CustomerInfoEntity, DeliveryInfoEntity, OrderEntity, OrderProductEntity } from 'src/types/order';
import { ImageDetailEntity, ProductDetailEntity, ProductEntity, TagsEntity } from 'src/types/product';
import { UserEntity } from 'src/types/user';
import { Repository } from 'typeorm';



@Injectable()
export class AnalyticService {
    constructor(
        private config: ConfigService,

        @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
        @InjectRepository(ProductDetailEntity) private productDetailRepository: Repository<ProductDetailEntity>,
        @InjectRepository(ImageDetailEntity) private imageDetailRepository: Repository<ImageDetailEntity>,
        @InjectRepository(TagsEntity) private tagsRepository: Repository<TagsEntity>,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
        @InjectRepository(DeliveryInfoEntity) private deliveryRepository: Repository<DeliveryInfoEntity>,
        @InjectRepository(CustomerInfoEntity) private customerRepository: Repository<CustomerInfoEntity>,
        @InjectRepository(OrderProductEntity) private orderProductRepository: Repository<OrderProductEntity>,
    ) { }
    private CheckRoleUser(user: UserEntity) {
        if (!user.role.includes("ADMIN")) {
            throw new ForbiddenException('The user does not have permission');
        }
    }

    private slipData(orders: OrderEntity[]) {
        const monthly: Record<string, OrderEntity[]> = {};
        const startMonth = new Date(orders[0].created_at).getMonth() + 1;
        const startYear = new Date(orders[0].created_at).getFullYear()
        const endMonth = new Date().getMonth() + 1;
        const endYear = new Date().getFullYear();

        for (let year = startYear; year <= endYear; year++) {
            for (let month = (year === startYear ? startMonth : 1); month <= (year === endYear ? endMonth : 12); month++) {
                monthly[`${year}-${month}`] = [];
            }
        }
        orders.forEach((order) => {
            const tmpMonth = new Date(order.created_at).getMonth() + 1;
            const tmpYear = new Date(order.created_at).getFullYear();
            monthly[`${tmpYear}-${tmpMonth}`].push(order);
        });

        return monthly;
    }

    private CalculateDataRevenue(orders: OrderEntity[]) {
        const dataReturn = {
            totalRevenue: 0,
            totalProfit: 0,
            totalProduct: 0,
            totalOrder: orders.length
        }

        const totalOrder = orders.length

        for (const order of orders) {
            for (const product of order.orderProducts) {
                dataReturn.totalProduct += product.quantity
                dataReturn.totalRevenue += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0))
                dataReturn.totalProfit += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0)) - product.quantity * product.originPrice
            }

        }
        return dataReturn
    }
    private CalculateDataRevenuePerMonth(data: Record<string, OrderEntity[]>) {
        const dataMonth = []
        for (const e in data) {
            let tmpRevenue = 0
            let tmpProfit = 0
            let tmpProduct = 0

            for (const order of data[e]) {
                for (const product of order.orderProducts) {
                    tmpProduct += product.quantity
                    tmpRevenue += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0))
                    tmpProfit += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0)) - product.quantity * product.originPrice
                }
            }
            dataMonth.push({ Date: e, 'productSold': tmpProduct, 'profit': tmpProfit, 'revenue': tmpRevenue })

        }
        return dataMonth
    }

    private CalculateDataRevenueOfWeek(orders: OrderEntity[]) {
        const currentWeekOrders = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            const today = new Date();
            const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1);
            const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7 - today.getDay());
            return startOfWeek <= orderDate && orderDate <= endOfWeek;
        });


        const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const weekDayOrders: Record<string, OrderEntity[]> = {};

        for (const day of weekday) {
            weekDayOrders[day] = []
        }

        currentWeekOrders.forEach(order => {
            const dayOfWeek = weekday[new Date(order.created_at).getDay()];
            if (!weekDayOrders[dayOfWeek]) {
                weekDayOrders[dayOfWeek] = [];
            }
            weekDayOrders[dayOfWeek].push(order);
        });

        const dataOfWeak = []
        for (const e in weekDayOrders) {
            let tmpRevenue = 0
            let tmpProfit = 0
            let tmpProduct = 0

            for (const order of weekDayOrders[e]) {
                for (const product of order.orderProducts) {
                    tmpProduct += product.quantity
                    tmpRevenue += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0))
                    tmpProfit += product.quantity * (product.unitPrice - (product.unitPrice * product?.discount ? product.discount : 0)) - product.quantity * product.originPrice
                }
            }
            dataOfWeak.push({ name: 'revenue', xData: e, yData: tmpRevenue })
            dataOfWeak.push({ name: 'profit', xData: e, yData: tmpProfit })
            dataOfWeak.push({ name: 'productSold', xData: e, yData: tmpProduct })
        }
        return dataOfWeak
    }

    async analyticsRevenue(user: UserEntity) {
        this.CheckRoleUser(user)

    }

    async analyticsFavorite(user: UserEntity) {
        this.CheckRoleUser(user)

    }

    async analyticsProduct(user: UserEntity) {
        this.CheckRoleUser(user)

    }


    async GetTopBrand() {

    }
    
}