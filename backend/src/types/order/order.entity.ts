import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Relation, OneToOne,
} from 'typeorm';
import { ProductEntity } from "../product";

@Entity({ name: 'CustomerInfo' })
export class CustomerInfoEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ nullable: true })
    userId: number;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    firstName: string;

    @Column({ nullable: false })
    lastName: string;

    @Column({ nullable: false })
    phoneNumber: string;
}

@Entity({ name: 'DeliveryInfo' })
export class DeliveryInfoEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ nullable: false })
    deliveryType: string;

    @Column({ nullable: false })
    deliveryFee: number;

    @Column({ nullable: false })
    discount?: number;

    @Column({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    district?: string;

    @Column({ nullable: false })
    address: string;
}

@Entity({ name: 'PaymentInfo' })
export class PaymentInfoEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ nullable: false })
    isPaid: boolean;

    @Column({ nullable: false })
    paymentType: string;

    @Column({ nullable: true })
    bank?: string;

    @Column({ nullable: true })
    trackId?: string;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updateAt?: Date;
}

@Entity({ name: 'Order' })
export class OrderEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'boolean' })
    isDisplay: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.order)
    orderProducts: Relation<OrderProductEntity[]>;

    @ManyToOne(() => DeliveryInfoEntity)
    @JoinColumn({ name: 'deliveryInfoId' })
    deliveryInfo: DeliveryInfoEntity;

    @ManyToOne(() => CustomerInfoEntity)
    @JoinColumn({ name: 'customerInfoId' })
    customerInfo: CustomerInfoEntity;

    @OneToOne(() => PaymentInfoEntity, { cascade: true })
    @JoinColumn()
    paymentInfo: PaymentInfoEntity;

    @Column()
    status: string;

    @Column({ nullable: true })
    notes?: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}


@Entity({ name: 'OrderProduct' })
export class OrderProductEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    orderId: number;

    @Column({ type: 'bigint' })
    productId: number;

    @Column({ nullable: false })
    unitPrice: number;

    @Column({ nullable: false })
    originPrice: number;

    @Column({ nullable: false })
    quantity: number;

    @Column({ nullable: false })
    discount?: number;

    @ManyToOne(() => OrderEntity, (order) => order.orderProducts)
    @JoinColumn({ name: 'orderId' })
    order: Relation<OrderEntity>;

    @ManyToOne(() => ProductEntity, (product) => product.orderProducts)
    @JoinColumn({ name: 'productId' })
    product: Relation<ProductEntity>;
}