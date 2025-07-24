
import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  onSymbolChange?: (symbol: string) => void;
}

const TradingViewWidget: React.FC<TradingViewWidgetProps> = React.memo(({ symbol = 'FX:EURUSD', onSymbolChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    // Ensure the TradingView script is loaded and container is available
    if (!containerRef.current || !(window as any).TradingView) {
      return;
    }

    // Clear previous widget if it exists
    if (widgetRef.current) {
      widgetRef.current.remove();
      widgetRef.current = null;
    }

    // Clear container
    containerRef.current.innerHTML = '';

    console.log('Creating TradingView widget with symbol:', symbol);

    // Create new widget
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

    console.log('TradingView widget created for symbol:', symbol);

    // Cleanup function
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
        } catch (e) {
          console.log('Error removing widget:', e);
        }
        widgetRef.current = null;
      }
    };
  }, [symbol]);

  return (
    <div id="tradingview-widget-container" ref={containerRef} className="w-full h-full" />
  );
});

export default TradingViewWidget;
