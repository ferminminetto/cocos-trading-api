import { ApiProperty } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";

export class PortfolioDto {

    @ApiProperty()
    cashAvailable: string;

    @ApiProperty()
    positionsValue: string;

    @ApiProperty()
    totalValue: string;

    @ApiProperty({ type: [PositionDto] })
    positions: Array<PositionDto>;
}