import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from 'typeorm';
import { ReviewEntity } from '../review';
import { CartEntity } from '../cart';


@Entity({ name: 'UserDetail' })
export class UserDetailEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;
    
    @Column({nullable: true})
    firstName: string;

    @Column({nullable: true})
    lastName: string;

    @Column({nullable: true})
    phoneNumber: string;

    @Column({nullable: true})
    birthday?: Date;

    @Column({nullable: true})
    address?: string;

    @Column({nullable: true})
    gender?: string;

    @Column({nullable: true, default: "/media/uploads/user.png"})
    imgDisplay?: string 

}

@Entity({ name: 'User' })
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    secretKey: string;

    @Column({ type: 'boolean', default: true })
    isDisplay: boolean;

    @Column()
    username: string;

    @Column({ type: 'simple-array', nullable: false})
    role: string[];

    @OneToOne(() => UserDetailEntity, { cascade: true })
    @JoinColumn()
    details: UserDetailEntity;

    @OneToOne(() => CartEntity, { cascade: true })
    @JoinColumn()
    cart: CartEntity;

    @Column()
    hash: string;

    @OneToMany(() => ReviewEntity, (review) => review.user)
    reviews: Relation<ReviewEntity[]>;

    @Column({nullable: true})
    refreshToken: string;

    @CreateDateColumn()
    created_at: Date;
        
    @UpdateDateColumn()
    updated_at: Date;
}