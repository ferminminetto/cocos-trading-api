import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Instrument } from './models/instrument.entity';

export interface InstrumentSearchParams {
    search: string;
    limit: number;
    offset: number;
}

@Injectable()
export class InstrumentRepository extends Repository<Instrument> {
    constructor(ds: DataSource) {
        super(Instrument, ds.createEntityManager());
    }

    /**
     * Searches instruments by ticker or name.
     * Uses ILIKE for case-insensitive search and supports pagination.
     * Applies a minimum length to the search string to avoid massive scans.
     *
     * @param params - Search parameters including search string, limit, and offset.
     * @returns An object containing the matched instrument items and the total count.
     */
    async search(params: InstrumentSearchParams): Promise<{ items: Instrument[]; total: number }> {
        const { search, limit, offset } = params;

        const min = 2;
        if (!search || search.trim().length < min) {
            return { items: [], total: 0 };
        }

        const needle = search.trim();
        const like = `%${needle}%`;

        const qb = this.createQueryBuilder('i')
            .where('i.ticker ILIKE :like', { like })
            .orWhere('i.name ILIKE :like', { like })
            .orderBy('i.ticker', 'ASC')
            .limit(limit)
            .offset(offset);

        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }
}