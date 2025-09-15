import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { InstrumentService } from './instrument.service';
import { InstrumentSearchResponseDto } from './dto/instrument-search-response.dto';

/**
 * Controller for instrument-related endpoints.
 */
@ApiTags('instruments')
@Controller('instruments')
export class InstrumentController {
  constructor(private readonly service: InstrumentService) {}

  /**
   * Searches instruments by ticker or name.
   * Supports pagination via 'page' and 'pageSize' query parameters.
   * Returns a paginated list of matching instruments.
   *
   * @param search - Search string for ticker or name (required).
   * @param page - Page number for pagination (optional, default: 1).
   * @param pageSize - Number of items per page (optional, default: 20).
   * @returns Paginated search results including items and pagination info.
   */
  @ApiOkResponse({ type: InstrumentSearchResponseDto })
  @Get('search')
  @ApiQuery({ name: 'search', required: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  async search(
    @Query('search') search: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
  ): Promise<InstrumentSearchResponseDto> {
    return this.service.search(search, Number(page) || 1, Number(pageSize) || 20);
  }
}