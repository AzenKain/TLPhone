import { Body, Controller, Query, Get, Param, Post, Redirect, Req, UseGuards, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Request, Response } from 'express';
import { JwtGuardRestApi } from '../auth/guard';
import { CurrentUserAccess } from '../decorators';
import { UserEntity } from '../types/user';
import { PaymentDto, PaymentQueryDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService : PaymentService,
        private config: ConfigService,
    ){}


    @Get('vnpay_return/:userId/:orderUid')
    async handleVnpayReturn(
      @Param('userId') userId: string,
      @Param('orderUid') billId: string,
      @Query() query: PaymentQueryDto,
      @Res() res : Response
    ) {
        const value = await this.paymentService.validateOrder(userId, billId, query)

        if (value.status === false) {
            return res.redirect('http://localhost:3000')
        }
        else {
            const params = new URLSearchParams();
            params.append('auth', userId);
            return res.redirect(`http://localhost:3000/order/${billId}?${params.toString()}`);
        }
    }

    @UseGuards(JwtGuardRestApi)
    @Post('create')
    async createPayment(
      @Body() dto: PaymentDto,
      @Req() req: Request,
      @CurrentUserAccess() user: UserEntity,
    ) {
        return await this.paymentService.generateVnpay(dto, req, user)
    }

}
