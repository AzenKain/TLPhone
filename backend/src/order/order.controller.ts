import { Body, Controller, Post, Res, StreamableFile, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { SearchOrderDto } from './dtos';
import { JwtGuardRestApi } from 'src/auth/guard';
import { CurrentUserAccess } from '../decorators';
import { UserEntity } from '../types/user';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
    ) { }

    @UseGuards(JwtGuardRestApi)
    @Post('export-file')
    async ExportFileController(
        @Body() dto : SearchOrderDto,
        @Request() req : Request,
        @Res({ passthrough: true }) res: Response,
        @CurrentUserAccess() user: UserEntity,
    )  {
        const data : Uint8Array = await this.orderService.GetReportOrder(dto, user)
        return new StreamableFile(data, {
            type: 'text/csv',
            disposition: 'attachment; filename="report-product.csv"',
          });
    }
}
