import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class PaymentDto {
    @IsNotEmpty()
    @IsString()
    @Field()
    method: string;

    @IsNotEmpty()
    @IsString()
    @Field()
    orderUid: string;
}



export class PaymentQueryDto {
    @IsString()
    @Length(8, 8)
    @IsNotEmpty()
    vnp_TmnCode: string;

    @IsNotEmpty()
    @IsString()
    vnp_Amount: string;

    @IsNotEmpty()
    @IsString()
    vnp_BankCode: string;

    @IsString()
    @IsOptional()
    vnp_BankTranNo?: string;

    @IsString()
    @IsOptional()
    vnp_CardType?: string;

    @IsNotEmpty()
    @IsString()
    vnp_PayDate?: string;

    @IsNotEmpty()
    @IsString()
    vnp_OrderInfo: string;

    @IsNotEmpty()
    @IsString()
    vnp_TransactionNo: string;

    @IsNotEmpty()
    @IsString()
    vnp_ResponseCode: string;

    @IsNotEmpty()
    @IsString()
    vnp_TransactionStatus: string;

    @IsNotEmpty()
    @IsString()
    vnp_TxnRef: string;

    @IsNotEmpty()
    @IsString()
    vnp_SecureHash: string;
}
