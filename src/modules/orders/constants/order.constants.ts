import { CANCELLED } from "dns";

export const ORDER_SIDES = {
  BUY: 'BUY',
  SELL: 'SELL',
  CASH_IN: 'CASH_IN',
  CASH_OUT: 'CASH_OUT',
} as const;
export type OrderSide = typeof ORDER_SIDES[keyof typeof ORDER_SIDES];

export const ORDER_TYPES = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
} as const;
export type OrderType = typeof ORDER_TYPES[keyof typeof ORDER_TYPES];

export const ORDER_STATUS = {
  NEW: 'NEW',
  FILLED: 'FILLED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];