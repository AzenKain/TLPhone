import { Args, Context, Mutation, Resolver } from "@nestjs/graphql";
import { PaymentService } from './payment.service';
import { UseGuards } from '@nestjs/common';
import { JwtGuardGraphql } from 'src/auth/guard';
import { PaymentDto } from "./dto";
import { Request } from 'express';
import { PaymentType } from '../types/payment.type';
import { CurrentUserGraphql } from '../decorators';
import { UserEntity } from '../types/user';

@UseGuards(JwtGuardGraphql)
@Resolver(() => PaymentType)
export class PaymentResolver {
    constructor(private paymentService: PaymentService) { }


    @Mutation(() => PaymentType)
    async generateVnpayPayment(
      @Args('payment') payment: PaymentDto,
      @Context('req') req: Request,
    @CurrentUserGraphql() user: UserEntity,
    ): Promise<PaymentType> {
        if (payment.method === "Vnpay") {
            return await this.paymentService.generateVnpay(payment, req, user);
        }
        return { status: "fail", url: "" }
    }
}
