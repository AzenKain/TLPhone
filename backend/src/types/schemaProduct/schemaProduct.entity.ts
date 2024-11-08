import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
    ManyToOne,
    Relation,
    ManyToMany, JoinTable, OneToOne,
} from 'typeorm';
import { ProductEntity } from '../product';

@Entity({ name: 'ItemSchemaProductDetail' })
export class ItemSchemaProductDetailEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    isUseForSearch: boolean;

    @Column()
    value: string;

    @ManyToMany(() => SchemaProductDetailEntity, (productDetail) => productDetail.attributes)
    productSchema: Relation<SchemaProductDetailEntity[]>;
}

@Entity({ name: 'SchemaProductDetail' })
export class SchemaProductDetailEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    title: string;

    @ManyToMany(() => ItemSchemaProductDetailEntity, (it) => it.productSchema, { nullable: true })
    @JoinTable()
    attributes: Relation<ItemSchemaProductDetailEntity[]>;

    @ManyToOne(() => SchemaProductEntity, (order) => order, { nullable: true })
    schema?: Relation<SchemaProductEntity>;
}

@Entity({ name: 'SchemaProduct' })
export class SchemaProductEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column()
    name: string;

    @Column({ type: 'boolean' })
    isDisplay: boolean;

    @Column({ nullable: true })
    category?: string;

    @OneToMany(() => SchemaProductDetailEntity, (item) => item.schema)
    @JoinColumn()
    detail: Relation<SchemaProductDetailEntity[]>;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
