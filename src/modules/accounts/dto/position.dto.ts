import { ApiProperty } from "@nestjs/swagger";

export class PositionDto {
    @ApiProperty()
    instrumentId: number;

    @ApiProperty()
    ticker: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    shares: string;

    @ApiProperty()
    close: string | null;
    
    @ApiProperty()
    previousClose: string | null;

    @ApiProperty()
    monetaryValue: string | null;

    @ApiProperty()
    dailyReturnPct: string | null;
}