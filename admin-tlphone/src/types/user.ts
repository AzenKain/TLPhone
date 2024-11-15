import { ReviewType } from './review';
import { CartType } from './cart';
import { OrderStatusHistoryType } from './order';

export type UserDetailType = {
    id: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    birthday?: Date;
    address?: string;
    gender?: string;
    imgDisplay?: string;
};

export type UserType = {
    id: string;
    email: string;
    secretKey: string;
    isDisplay: boolean;
    username: string;
    role: string[];
    heart: string[];
    details?: UserDetailType;
    statusHistory?: OrderStatusHistoryType[];
    cart: CartType;
    hash?: string;
    refreshToken?: string;
    reviews?: ReviewType[];
    created_at: Date;
    updated_at: Date;
};
