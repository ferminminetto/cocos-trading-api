import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
    constructor(private readonly service: OrderService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create order (BUY/SELL/CASH_IN/CASH_OUT)' })
    @ApiResponse({ status: 201, description: 'Order registered (FILLED or REJECTED).' })
    async create(@Body() dto: CreateOrderDto) {
        const res = await this.service.create(dto);
        return res;
    }
}