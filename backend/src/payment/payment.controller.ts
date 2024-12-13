import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService : PaymentService
    ){}
    
    @Redirect('http://localhost:3000', 302)
    @Get('validate/:userId/:orderUid')
    async getFileById(
      @Param('userId') userId: string,
      @Param('orderUid') billId: string
    ) {
        const value = await this.paymentService.validateOrder(userId, billId)
        if (value.status === false) {
            return { url: 'http://localhost:3000' };
        }
        else {
            return { url: `http://localhost:3000/user/order/${billId}` };
        }
    }
}
