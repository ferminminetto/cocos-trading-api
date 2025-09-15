import { InstrumentRepository } from './instrument.repository';
import { DataSource } from 'typeorm';

describe('InstrumentRepository', () => {
  let repo: InstrumentRepository;

  beforeEach(() => {
    const ds = { createEntityManager: () => ({}) } as DataSource;
    repo = new InstrumentRepository(ds);
    repo.createQueryBuilder = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    });
  });

  it('should return empty if search string is too short', async () => {
    const result = await repo.search({ search: 'A', limit: 10, offset: 0 });
    expect(result).toEqual({ items: [], total: 0 });
  });

  it('should build query with correct params', async () => {
    await repo.search({ search: 'CA', limit: 10, offset: 0 });
    expect(repo.createQueryBuilder).toHaveBeenCalledWith('i');
  });
});