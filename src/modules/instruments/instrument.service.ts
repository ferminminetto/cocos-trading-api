import { Injectable } from '@nestjs/common';
import { InstrumentRepository } from './instrument.repository';

@Injectable()
export class InstrumentService {
    constructor(private readonly instrumentRepository: InstrumentRepository) { }

    /**
     * Search for instruments by ticker or name, with pagination.
     * @param search The search term to look for in ticker or name.
     * @param page The page number for pagination (default is 1).
     * @param pageSize The number of items per page (default is 20, max is 50).
     * @returns An object containing the list of instruments and pagination info.
     */
    async search(search: string, page = 1, pageSize = 20) {
        // Hard limits for abuse control, so a client can't request too much data and hinders performance.
        const limit = Math.min(Math.max(pageSize, 1), 50);
        const offset = (Math.max(page, 1) - 1) * limit;

        const { items, total } = await this.instrumentRepository.search({ search, limit, offset });
        return {
            items: items.map(i => ({ id: i.id, ticker: i.ticker, name: i.name })),
            pagination: { total, page, pageSize: limit },
        };
    }
}