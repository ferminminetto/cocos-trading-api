import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PortfolioDto } from './dto/portfolio.dto';
import { AccountService } from './account.service';

/**
 * Controller for account-related endpoints.
 */
@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  /**
   * Get the portfolio for a specific user.
   *
   * @param userId - User ID to fetch the portfolio for.
   * @returns The user's portfolio (PortfolioDto).
   */
  @ApiOkResponse({ type: PortfolioDto })
  @Get('portfolio')
  @ApiQuery({ name: 'userId', required: true })
  async getPortfolio(
    @Query('userId', new DefaultValuePipe(1), ParseIntPipe) userId: number,
  ): Promise<PortfolioDto> {
    return this.service.getUserPortfolio(userId);
  }
}