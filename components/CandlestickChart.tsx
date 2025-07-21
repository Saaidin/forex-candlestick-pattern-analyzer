
import React from 'react';
import { Candle } from '../types';

interface CandlestickChartProps {
  candles: Candle[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ candles }) => {
  const width = 200;
  const height = 150;
  const padding = 10; // Reduced padding for better visuals in small containers

  const allValues = candles.flatMap(c => [c.high, c.low]);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  
  const valRange = (maxVal - minVal) || 1; // Avoid division by zero
  const yBuffer = valRange * 0.1; // 10% buffer top and bottom

  const scaleY = (val: number) => {
    const scaled = ((val - (minVal - yBuffer)) / (valRange + yBuffer * 2)) * (height - 2 * padding);
    return height - padding - scaled;
  };
  
  const totalCandles = candles.length;
  const spacing = width / (totalCandles + 1);
  const candleWidth = Math.min(spacing / 1.5, 40);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {candles.map((candle, i) => {
        const x = spacing * (i + 1);
        const isBullish = candle.close > candle.open;
        const color = isBullish ? '#22c55e' : '#ef4444'; // green-500, red-500

        const bodyTop = scaleY(Math.max(candle.open, candle.close));
        const bodyBottom = scaleY(Math.min(candle.open, candle.close));
        const bodyHeight = bodyBottom - bodyTop;

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={x}
              y1={scaleY(candle.high)}
              x2={x}
              y2={scaleY(candle.low)}
              stroke={color}
              strokeWidth="2"
            />
            {/* Body */}
            <rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight > 0 ? bodyHeight : 1}
              fill={color}
            />
          </g>
        );
      })}
    </svg>
  );
};

export default CandlestickChart;
