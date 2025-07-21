
import React, { useEffect, useRef } from 'react';

const TradingViewWidget: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Ensure the TradingView script is loaded and that the widget is only initialized once.
    if (!containerRef.current || hasInitialized.current || !(window as any).TradingView) {
      return;
    }
    
    hasInitialized.current = true;

    new (window as any).TradingView.widget({
      autosize: true,
      symbol: "FX:EURUSD",
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
  }, []);

  return (
    <div id="tradingview-widget-container" ref={containerRef} className="w-full h-full" />
  );
});

export default TradingViewWidget;
