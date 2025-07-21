
export enum PatternType {
  BULLISH = 'Bullish',
  BEARISH = 'Bearish',
  NEUTRAL = 'Neutral'
}

export enum Trend {
  REVERSAL = 'Reversal',
  CONTINUATION = 'Continuation',
  INDECISION = 'Indecision'
}

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickPattern {
  name: string;
  type: PatternType;
  trend: Trend;
  description: string;
  candles: Candle[];
}
