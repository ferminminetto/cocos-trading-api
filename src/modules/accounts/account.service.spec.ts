import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { PortfolioDto } from './dto/portfolio.dto';

describe('AccountService (unit)', () => {
  let service: AccountService;
  let repo: jest.Mocked<AccountRepository>;

  beforeEach(() => {
    repo = { getUserPortfolio: jest.fn() } as any;
    service = new AccountService(repo);
  });

  it('maps RawPortfolioRow to PortfolioDto', async () => {

    // Mocks a PortfolioRow response from the repository
    repo.getUserPortfolio.mockResolvedValue({
      cash_available: '1000',
      positions_value: '2500.5',
      total_value: '3500.5',
      positions: [
        {
          instrumentId: 54,
          ticker: 'METR',
          name: 'MetroGAS S.A.',
          shares: '500',
          close: '229.5',
          previousClose: '232.0',
          monetaryValue: '114750',
          dailyReturnPct: '-1.0775862069',
        },
      ],
    });

    const dto = await service.getUserPortfolio(123);

    // Expects the converted DTO.
    expect(dto).toBeInstanceOf(PortfolioDto);
    expect(dto.positions).toHaveLength(1);

    expect(dto.cashAvailable).toBe('1000');
    expect(dto.positionsValue).toBe('2500.5');
    expect(dto.totalValue).toBe('3500.5');
    expect(dto.positions[0]).toEqual(
      expect.objectContaining({ ticker: 'METR', shares: '500' }),
    );
  });

  it('handles empty positions and nullables', async () => {
    repo.getUserPortfolio.mockResolvedValue({
      cash_available: null,
      positions_value: null,
      total_value: null,
      positions: [],
    } as any);

    const dto = await service.getUserPortfolio(999);
    expect(dto.cashAvailable).toBe('0'); // mapRawToDto with ?? '0'
    expect(dto.positions).toEqual([]);
  });
});