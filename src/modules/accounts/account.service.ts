import { Injectable } from '@nestjs/common';
import { AccountRepository, PortfolioRow } from './account.repository';
import { PortfolioDto } from './dto/portfolio.dto';
import { PositionDto } from './dto/position.dto';

@Injectable()
export class AccountService {
    constructor(private readonly accountRepository: AccountRepository) { }

    /**
     * Get User Portfolio from Repository
     * @param userId - The ID of the user whose portfolio is to be fetched.
     * @returns The user's portfolio (PortfolioDto).
     */
    async getUserPortfolio(userId: number): Promise<PortfolioDto> {
        const raw = await this.accountRepository.getUserPortfolio(userId);
        return this.mapRawToDto(raw);
    }

    /**
   * Maps the repository row (snake_case, DB-shaped) to the public DTO (camelCase).
   * Used to avoid leaking DB details into the API layer.
   */
  private mapRawToDto(raw: PortfolioRow): PortfolioDto {
    const dto = new PortfolioDto();
    dto.cashAvailable = raw.cash_available ?? '0';
    dto.positionsValue = raw.positions_value ?? '0';
    dto.totalValue = raw.total_value ?? '0';
    dto.positions = (raw.positions ?? []).map((p) => {
      const pos = new PositionDto();
      pos.instrumentId = p.instrumentId;
      pos.ticker = p.ticker;
      pos.name = p.name;
      pos.shares = p.shares;
      pos.close = p.close;
      pos.previousClose = p.previousClose;
      pos.monetaryValue = p.monetaryValue;
      pos.dailyReturnPct = p.dailyReturnPct;
      return pos;
    });
    return dto;
  }
}