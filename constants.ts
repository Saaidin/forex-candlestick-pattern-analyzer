
import { CandlestickPattern, PatternType, Trend } from './types';

export const CANDLESTICK_PATTERNS: CandlestickPattern[] = [
  {
    name: 'Hammer',
    type: PatternType.BULLISH,
    trend: Trend.REVERSAL,
    description: 'A bullish reversal pattern that forms during a downtrend. It is named because the market is hammering out a bottom.',
    candles: [{ open: 70, high: 72, low: 20, close: 68 }],
  },
  {
    name: 'Inverted Hammer',
    type: PatternType.BULLISH,
    trend: Trend.REVERSAL,
    description: 'A bullish reversal pattern. It looks like an upside-down hammer, suggesting potential buying pressure.',
    candles: [{ open: 30, high: 80, low: 28, close: 32 }],
  },
  {
    name: 'Bullish Engulfing',
    type: PatternType.BULLISH,
    trend: Trend.REVERSAL,
    description: 'A two-candle reversal pattern where a large green candle engulfs a smaller red candle, signaling a potential uptrend.',
    candles: [
      { open: 60, high: 62, low: 50, close: 52 },
      { open: 48, high: 80, low: 46, close: 78 },
    ],
  },
  {
    name: 'Morning Star',
    type: PatternType.BULLISH,
    trend: Trend.REVERSAL,
    description: 'A three-candle bullish reversal pattern consisting of a large red candle, a small-bodied candle, and a large green candle.',
    candles: [
      { open: 80, high: 82, low: 30, close: 32 },
      { open: 22, high: 28, low: 18, close: 24 },
      { open: 35, high: 90, low: 33, close: 88 },
    ],
  },
  {
    name: 'Three White Soldiers',
    type: PatternType.BULLISH,
    trend: Trend.REVERSAL,
    description: 'A bullish reversal pattern consisting of three consecutive long-bodied green candles that open within the previous body and close higher.',
    candles: [
        { open: 30, high: 55, low: 28, close: 53 },
        { open: 53, high: 78, low: 51, close: 76 },
        { open: 76, high: 100, low: 74, close: 98 },
    ],
  },
  {
    name: 'Hanging Man',
    type: PatternType.BEARISH,
    trend: Trend.REVERSAL,
    description: 'A bearish reversal pattern that can mark a top or resistance level. It looks like a hammer but forms during an uptrend.',
    candles: [{ open: 70, high: 72, low: 20, close: 68 }],
  },
    {
    name: 'Shooting Star',
    type: PatternType.BEARISH,
    trend: Trend.REVERSAL,
    description: 'A bearish reversal pattern with a small lower body, long upper wick, and little or no lower wick. It appears after an uptrend.',
    candles: [{ open: 72, high: 98, low: 70, close: 71 }],
  },
  {
    name: 'Bearish Engulfing',
    type: PatternType.BEARISH,
    trend: Trend.REVERSAL,
    description: 'A two-candle reversal pattern where a large red candle engulfs a smaller green candle, signaling a potential downtrend.',
    candles: [
      { open: 52, high: 62, low: 50, close: 60 },
      { open: 78, high: 80, low: 46, close: 48 },
    ],
  },
  {
    name: 'Evening Star',
    type: PatternType.BEARISH,
    trend: Trend.REVERSAL,
    description: 'A three-candle bearish reversal pattern, the opposite of a Morning Star. It signals a potential top.',
    candles: [
      { open: 35, high: 90, low: 33, close: 88 },
      { open: 95, high: 99, low: 92, close: 94 },
      { open: 80, high: 82, low: 30, close: 32 },
    ],
  },
  {
    name: 'Three Black Crows',
    type: PatternType.BEARISH,
    trend: Trend.REVERSAL,
    description: 'A bearish reversal pattern of three consecutive long red candles that have closed lower than the previous day.',
    candles: [
      { open: 98, high: 100, low: 74, close: 76 },
      { open: 76, high: 78, low: 51, close: 53 },
      { open: 53, high: 55, low: 28, close: 30 },
    ],
  },
  {
    name: 'Doji',
    type: PatternType.NEUTRAL,
    trend: Trend.INDECISION,
    description: 'A candle where the open and close are virtually equal. It signifies indecision in the market and can be a turning point.',
    candles: [{ open: 50, high: 70, low: 30, close: 50.5 }],
  },
];
