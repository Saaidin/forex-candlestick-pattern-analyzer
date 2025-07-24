
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = React.memo(({ symbol = 'FX:EURUSD', onSymbolChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  const currentSymbol = useRef<string>(symbol);

  useEffect(() => {
    // Clean up previous widget if symbol changes
    if (currentSymbol.current !== symbol && widgetRef.current) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      widgetRef.current = null;
    }
    
    currentSymbol.current = symbol;

    // Initialize widget if not already done or if symbol changed
    if (!containerRef.current || !(window as any).TradingView) {
      return;
    }

    try {
      widgetRef.current = new (window as any).TradingView.widget({
        autosize: true,
        symbol: symbol,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        container_id: containerRef.current.id,
      });

    } catch (error) {
      console.error('Error initializing TradingView widget:', error);
    }
  }, [symbol]);

  return (
    <div id="tradingview-widget-container" ref={containerRef} className="w-full h-full" />
  );
});

export default TradingViewWidget;
