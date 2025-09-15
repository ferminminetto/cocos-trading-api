import { InstrumentService } from './instrument.service';
import { InstrumentRepository } from './instrument.repository';

describe('InstrumentService', () => {
  let service: InstrumentService;
  let repo: InstrumentRepository;

  beforeEach(() => {
    repo = {
      search: jest.fn().mockResolvedValue({
        items: [
          { id: 1, ticker: 'DYCA', name: 'Dycasa S.A.' },
          { id: 2, ticker: 'CAPX', name: 'Capex S.A.' },
        ],
        total: 2,
      }),
    } as any;
    service = new InstrumentService(repo);
  });

  it('should return paginated search results', async () => {
    const result = await service.search('CA', 1, 10);
    expect(result.items.length).toBe(2);
    expect(result.pagination.total).toBe(2);
    expect(repo.search).toHaveBeenCalledWith({ search: 'CA', limit: 10, offset: 0 });
  });

  it('should apply pageSize limits', async () => {
    await service.search('CA', 1, 100);
    expect(repo.search).toHaveBeenCalledWith({ search: 'CA', limit: 50, offset: 0 });
  });
});