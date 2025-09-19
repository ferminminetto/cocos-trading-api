import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

/** Internal row shape returned by the repository. */
export interface PortfolioRow {
  cash_available: string;
  positions_value: string;
  total_value: string;
  positions: Array<{
    instrumentId: number;
    ticker: string;
    name: string;
    shares: string;
    close: string | null;
    previousClose: string | null;
    monetaryValue: string | null;
    dailyReturnPct: string | null;
  }>;
}

@Injectable()
export class AccountRepository {
  constructor(private readonly dataSource: DataSource) { }

  /**
   * Single round-trip portfolio query using CTEs. Used raw SQL for efficiency and clarity over ORM.
   * - Positions: net shares from FILLED orders only (no fractions).
   * - Prices: latest close & previousClose per instrument.
   * - Cash: CASH_IN/OUT and FILLED BUY/SELL flows.
   * - Aggregation: returns totals and positions as JSON.
   */
  async getUserPortfolio(userId: number): Promise<PortfolioRow> {
    const sql = `
      WITH positions AS (
        SELECT
          o.instrumentId,
          SUM(CASE WHEN o.side = 'BUY'  THEN o.size ELSE 0 END)
        - SUM(CASE WHEN o.side = 'SELL' THEN o.size ELSE 0 END) AS shares
        FROM orders o
        JOIN instruments i ON i.id = o.instrumentId
        WHERE o.userId = $1
          AND o.status = 'FILLED'
          AND i.type <> 'MONEDA'
        GROUP BY o.instrumentId
        HAVING
          SUM(CASE WHEN o.side = 'BUY'  THEN o.size ELSE 0 END)
        - SUM(CASE WHEN o.side = 'SELL' THEN o.size ELSE 0 END) > 0
      ),
      last_prices AS (
        SELECT DISTINCT ON (md.instrumentId)
          md.instrumentId, md.close, md.previousClose, md.date
        FROM marketdata md
        ORDER BY md.instrumentId, md.date DESC
      ),
      positions_valued AS (
        SELECT
          p.instrumentId,
          p.shares::numeric AS shares,
          COALESCE(lp.close::numeric, lp.previousClose::numeric) AS close,
          lp.previousClose::numeric AS previousClose,
          (p.shares::numeric * COALESCE(lp.close::numeric, lp.previousClose::numeric)) AS monetary_value,
          CASE
            WHEN lp.previousClose IS NULL OR lp.previousClose = 0 THEN NULL
            ELSE ((COALESCE(lp.close::numeric, lp.previousClose::numeric) / lp.previousClose::numeric) - 1) * 100
          END AS daily_return_pct
        FROM positions p
        JOIN last_prices lp ON lp.instrumentId = p.instrumentId
      ),
      cash AS (
        SELECT
          COALESCE(SUM(CASE WHEN side = 'CASH_IN'  AND status = 'FILLED' THEN size        ELSE 0 END), 0)::numeric
        - COALESCE(SUM(CASE WHEN side = 'CASH_OUT' AND status = 'FILLED' THEN size        ELSE 0 END), 0)::numeric
        - COALESCE(SUM(CASE WHEN side = 'BUY'      AND status = 'FILLED' THEN size*price  ELSE 0 END), 0)::numeric
        + COALESCE(SUM(CASE WHEN side = 'SELL'     AND status = 'FILLED' THEN size*price  ELSE 0 END), 0)::numeric
            AS cash_available
        FROM orders
        WHERE userId = $1
      )
      SELECT
        c.cash_available::text AS cash_available,
        COALESCE(SUM(pv.monetary_value), 0)::text AS positions_value,
        (c.cash_available + COALESCE(SUM(pv.monetary_value), 0))::text AS total_value,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'instrumentId', pv.instrumentId,
              'ticker', i.ticker,
              'name', i.name,
              'shares', (pv.shares)::text,
              'close', (pv.close)::text,
              'previousClose', (pv.previousClose)::text,
              'monetaryValue', (pv.monetary_value)::text,
              'dailyReturnPct', (pv.daily_return_pct)::text
            )
            ORDER BY i.ticker
          ) FILTER (WHERE pv.instrumentId IS NOT NULL),
          '[]'::jsonb
        ) AS positions
      FROM cash c
      LEFT JOIN positions_valued pv ON TRUE
      LEFT JOIN instruments i ON i.id = pv.instrumentId
      GROUP BY c.cash_available;
    `;
    const [row] = await this.dataSource.query(sql, [userId]);
    return {
      cash_available: row?.cash_available ?? '0',
      positions_value: row?.positions_value ?? '0',
      total_value: row?.total_value ?? '0',
      positions: row?.positions ?? [],
    };
  }

  async getCashAvailable(userId: number, mgr?: EntityManager): Promise<string> {
    const [row] = await (mgr ?? this.dataSource).query(`
      SELECT
        COALESCE(SUM(CASE WHEN side='CASH_IN'  AND status='FILLED' THEN size ELSE 0 END),0)::numeric
      - COALESCE(SUM(CASE WHEN side='CASH_OUT' AND status='FILLED' THEN size ELSE 0 END),0)::numeric
      - COALESCE(SUM(CASE WHEN side='BUY'     AND status='FILLED' THEN size*price ELSE 0 END),0)::numeric
      + COALESCE(SUM(CASE WHEN side='SELL'    AND status='FILLED' THEN size*price ELSE 0 END),0)::numeric
        AS cash_available
      FROM orders
      WHERE userid = $1
    `, [userId]);
    return row?.cash_available ?? '0';
  }

  async getNetShares(userId: number, instrumentId: number, mgr?: EntityManager): Promise<string> {
    const [row] = await (mgr ?? this.dataSource).query(`
      SELECT (
        COALESCE(SUM(CASE WHEN side='BUY'  AND status='FILLED' AND instrumentid=$2 THEN size ELSE 0 END),0)
      - COALESCE(SUM(CASE WHEN side='SELL' AND status='FILLED' AND instrumentid=$2 THEN size ELSE 0 END),0)
      )::numeric AS shares
      FROM orders
      WHERE userid = $1
    `, [userId, instrumentId]);
    return row?.shares ?? '0';
  }
}
