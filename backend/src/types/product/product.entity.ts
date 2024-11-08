import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
    ManyToOne,
    Relation,
    ManyToMany,
    JoinTable
} from "typeorm";
import { OrderProductEntity } from "../order";
import { ReviewEntity } from '../review';
import { SchemaProductEntity } from '../schemaProduct';
import { CarItemEntity } from '../cart';

@Entity({ name: 'TagsDetail' })
export class TagsEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    type: string;

    @Column({ nullable: true })
    value?: string;

    @ManyToMany(() => ProductDetailEntity, (productDetail) => productDetail.attributes,  { nullable: true })
    productDetail?: Relation<ProductDetailEntity[]>;

    @ManyToMany(() => ProductVariantEntity, (productDetail) => productDetail.attributes,  { nullable: true })
    productVariant?: Relation<ProductVariantEntity[]>;
}

@Entity({ name: 'ImageDetail' })
export class ImageDetailEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    url: string;

    @Column({ type: 'simple-array', nullable: true })
    link?: string[];

    @ManyToOne(() => ProductDetailEntity, (pd) => pd.imgDisplay, { nullable: true })
    productDetail: Relation<ProductDetailEntity>;
}

@Entity({ name: 'ProductVariant' })
export class ProductVariantEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    originPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    displayPrice: number;

    @Column({ type: 'bigint', nullable: true, default: 0 })
    stockQuantity?: number;

    @ManyToOne(() => ProductDetailEntity, (productDetail) => productDetail.variants)
    productDetail: Relation<ProductDetailEntity>;

    @OneToMany(() => CarItemEntity, (it) => it.productVariant)
    cartItem: Relation<CarItemEntity[]>;

    @ManyToMany(() => TagsEntity, (tag) => tag.productVariant, { nullable: true })
    @JoinTable()
    attributes: Relation<TagsEntity[]>;
}

@Entity({ name: 'ProductDetail' })
export class ProductDetailEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @OneToMany(() => ImageDetailEntity, (img) => img.productDetail)
    imgDisplay: Relation<ImageDetailEntity[]>;

    @ManyToMany(() => TagsEntity, (tag) => tag.productDetail)
    @JoinTable()
    attributes: Relation<TagsEntity[]>;

    @ManyToOne(() => TagsEntity, { nullable: true })
    @JoinColumn()
    brand: Relation<TagsEntity>;

    @Column({ type: 'longtext', nullable: true })
    description?: string;

    @Column({ type: 'longtext', nullable: true })
    tutorial?: string;

    @OneToMany(() => ProductVariantEntity, (variant) => variant.productDetail)
    variants: Relation<ProductVariantEntity[]>;
}

@Entity({ name: 'Product' })
export class ProductEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    name: string;

    @Column({ type: 'boolean' })
    isDisplay: boolean;

    @Column({ nullable: true })
    category?: string;

    @Column({ type: 'bigint', nullable: true, default: 0 })
    buyCount?: number;

    @Column({ type: 'float', nullable: true, default: 0 })
    rating?: number;

    @OneToOne(() => ProductDetailEntity, { cascade: true })
    @JoinColumn()
    details: Relation<ProductDetailEntity>;

    @OneToMany(() => OrderProductEntity, (orderProduct) => orderProduct.product)
    orderProducts: Relation<OrderProductEntity[]>;

    @OneToMany(() => ReviewEntity, (review) => review.product)
    reviews:  Relation<ReviewEntity[]>;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
