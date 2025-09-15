import { ApiProperty } from "@nestjs/swagger";
import { InstrumentSearchItemDto } from "./instrument-search-item.dto";

export class InstrumentSearchResponseDto {
    @ApiProperty({ type: [InstrumentSearchItemDto] })
    items: InstrumentSearchItemDto[];

    @ApiProperty()
    pagination: { total: number; page: number; pageSize: number; };
}