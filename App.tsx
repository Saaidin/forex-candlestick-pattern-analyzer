import React, { useState, useEffect, useCallback } from 'react';
import { CandlestickPattern, PatternType } from './types';
import { CANDLESTICK_PATTERNS } from './constants';
import { getPatternExplanation } from './services/geminiService';
import CandlestickChart from './components/CandlestickChart';
import { LogoIcon, LoadingIcon } from './components/Icons';
import TradingViewWidget from './components/TradingViewWidget';

export default function App() {
  const [selectedPattern, setSelectedPattern] = useState<CandlestickPattern | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteCurrencies, setFavoriteCurrencies] = useState<string[]>(() => {
    const stored = localStorage.getItem('favoriteCurrencies');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoriteCurrencies', JSON.stringify(favoriteCurrencies));
  }, [favoriteCurrencies]);

  const toggleFavoriteCurrency = useCallback((currency: string) => {
    setFavoriteCurrencies((prev) =>
      prev.includes(currency)
        ? prev.filter((c) => c !== currency)
        : [...prev, currency]
    );
  }, []);

  const fetchExplanation = useCallback(async (pattern: CandlestickPattern) => {
    setIsLoading(true);
    setError(null);
    setExplanation('');
    try {
      const result = await getPatternExplanation(pattern.name, pattern.type, pattern.trend);
      setExplanation(result);
    } catch (err) {
      setError('Failed to fetch explanation from Gemini. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPattern) {
      fetchExplanation(selectedPattern);
    }
  }, [selectedPattern, fetchExplanation]);

  // Helper to extract currency from pattern name (assumes pattern.name starts with currency, e.g. "EURUSD ...")
  function getCurrencyFromPattern(pattern: CandlestickPattern): string {
    // Adjust this logic if your pattern names are different
    return pattern.name.split(' ')[0];
  }

  // Modified PatternList to support currency favorites
  const PatternList: React.FC<{
    patterns: CandlestickPattern[];
    selectedPattern: CandlestickPattern | null;
    onSelectPattern: (pattern: CandlestickPattern) => void;
    favoriteCurrencies: string[];
    onToggleFavoriteCurrency: (currency: string) => void;
  }> = ({ patterns, selectedPattern, onSelectPattern, favoriteCurrencies, onToggleFavoriteCurrency }) => (
    <aside className="w-full md:w-1/4 lg:w-1/5 bg-slate-800/50 p-4 rounded-lg border border-slate-700 h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4">Patterns</h2>
      <ul className="space-y-2">
        {patterns.map((pattern) => {
          const currency = getCurrencyFromPattern(pattern);
          return (
            <li key={pattern.name} className="flex items-center">
              <button
                onClick={() => onSelectPattern(pattern)}
                className={`w-full text-left p-3 rounded-md transition-all duration-200 flex items-center gap-4 ${
                  selectedPattern?.name === pattern.name
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <div className="w-16 h-12 bg-slate-900/50 rounded-md p-1 flex-shrink-0 border border-slate-600">
                  <CandlestickChart candles={pattern.candles} />
                </div>
                <span className="font-semibold flex-grow">{pattern.name}</span>
              </button>
              <button
                onClick={() => onToggleFavoriteCurrency(currency)}
                className="ml-2 text-yellow-400 hover:text-yellow-300"
                title={favoriteCurrencies.includes(currency) ? "Unfavorite Currency" : "Favorite Currency"}
                aria-label="Favorite Currency"
              >
                {favoriteCurrencies.includes(currency) ? '★' : '☆'}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );

  const PatternDetail: React.FC<{
      pattern: CandlestickPattern;
      explanation: string;
      isLoading: boolean;
      error: string | null;
  }> = ({ pattern, explanation, isLoading, error }: {
      pattern: CandlestickPattern;
      explanation: string;
      isLoading: boolean;
      error: string | null;
  }) => {
      const typeColor = pattern.type === PatternType.BULLISH ? 'text-green-400' : pattern.type === PatternType.BEARISH ? 'text-red-400' : 'text-yellow-400';
      const typeBgColor = pattern.type === PatternType.BULLISH ? 'bg-green-500/10' : pattern.type === PatternType.BEARISH ? 'bg-red-500/10' : 'bg-yellow-500/10';

      return (
          <div className="bg-slate-800/50 p-6 md:p-8 rounded-lg border border-slate-700 h-full">
              <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{pattern.name}</h2>
                  <div className="flex items-center gap-4 mb-4">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${typeBgColor} ${typeColor}`}>{pattern.type}</span>
                      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-slate-600 text-slate-300">{pattern.trend}</span>
                  </div>
                  <p className="text-slate-400 mb-6">{pattern.description}</p>
                  
                  <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
                  {isLoading && (
                      <div className="flex items-center justify-center h-40 text-slate-400">
                           <LoadingIcon />
                          <span className="ml-2">Gemini is analyzing the pattern...</span>
                      </div>
                  )}
                  {error && (
                      <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
                          <h4 className="font-bold">Error</h4>
                          <p>{error}</p>
                      </div>
                  )}
                  {!isLoading && !error && (
                      <div className="prose prose-slate prose-invert max-w-none text-slate-300 prose-headings:text-white prose-strong:text-white">
                          <div dangerouslySetInnerHTML={{ __html: explanation }} />
                      </div>
                  )}
              </div>
          </div>
      );
  };


  const WelcomeScreen: React.FC = () => (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <LogoIcon className="h-16 w-16 text-indigo-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to the Candlestick Analyzer</h1>
          <p className="max-w-md">Select a pattern from the list to view its details and AI analysis below the chart.</p>
      </div>
  );


  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 flex flex-col">
      <header className="mb-6 flex items-center gap-4 flex-shrink-0">
        <LogoIcon className="h-10 w-10 text-indigo-500"/>
        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">Forex Candlestick Pattern Analyzer</h1>
      </header>
      <main className="flex flex-col md:flex-row gap-6 flex-grow min-h-0">
        <PatternList
          patterns={CANDLESTICK_PATTERNS}
          selectedPattern={selectedPattern}
          onSelectPattern={setSelectedPattern}
          favoriteCurrencies={favoriteCurrencies}
          onToggleFavoriteCurrency={toggleFavoriteCurrency}
        />
        <div className="w-full md:w-3/4 lg:w-4/5 flex flex-col gap-6">
          <div className="flex-[3] bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden min-h-0">
            <TradingViewWidget />
          </div>
          <div className="flex-[2] min-h-0 overflow-y-auto">
            {selectedPattern ? (
                <PatternDetail pattern={selectedPattern} explanation={explanation} isLoading={isLoading} error={error}/>
            ) : (
                <WelcomeScreen />
            )}
          </div>
        </div>
      </main>
      <footer className="w-full text-center text-xs text-slate-500 mt-4">
        ©2025 Saaidin Mat Esa. For Educational Purposes.
      </footer>
    </div>
  );
}