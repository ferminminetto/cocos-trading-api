import { ApiProperty } from "@nestjs/swagger";

export class InstrumentSearchItemDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    ticker: string;

    @ApiProperty()
    name: string;
}