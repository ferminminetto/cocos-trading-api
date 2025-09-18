import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ORDER_SIDES, ORDER_TYPES } from "../constants/order.constants";
import type { OrderSide, OrderType } from "../constants/order.constants";

export class CreateOrderDto {
  @ApiProperty() @IsInt() userId!: number;

  @ApiPropertyOptional() @IsInt() instrumentId?: number;

  @ApiProperty({ enum: Object.values(ORDER_SIDES) })
  @IsEnum(ORDER_SIDES) side!: OrderSide;

  @ApiProperty({ enum: Object.values(ORDER_TYPES) })
  @IsOptional() @IsEnum(ORDER_TYPES) type?: OrderType;

  @ApiProperty({ description: 'Quantity of shares (or amount in CASH_*).' })
  @IsOptional() @IsNumber() @IsPositive() size?: number;

  @ApiPropertyOptional({ description: 'Purchase amount (e.g., "1000.00")' })
  @IsOptional() @IsString() moneyAmount?: string;

  @ApiPropertyOptional({ description: 'Price for LIMIT orders' })
  @IsOptional() @IsString() price?: string;

  @ApiPropertyOptional({ description: 'Idempotence key to avoid duplicate orders' })
  @IsOptional() @IsString() idempotenceKey?: string;
}