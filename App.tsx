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
  const [currentCurrency, setCurrentCurrency] = useState<string>('EUR/USD');
  
  // Available currency options
  const currencyOptions = [
    { label: 'EUR/USD', value: 'EUR/USD', symbol: 'FX:EURUSD' },
    { label: 'GBP/USD', value: 'GBP/USD', symbol: 'FX:GBPUSD' },
    { label: 'GOLD', value: 'GOLD', symbol: 'TVC:GOLD' },
  ];
  const [favoritePatterns, setFavoritePatterns] = useState<Array<{pattern: string, currency: string}>>(() => {
    const stored = localStorage.getItem('favoritePatterns');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoritePatterns', JSON.stringify(favoritePatterns));
  }, [favoritePatterns]);

  const toggleFavoritePattern = useCallback((patternName: string) => {
    setFavoritePatterns((prev) => {
      const existingIndex = prev.findIndex(fav => fav.pattern === patternName && fav.currency === currentCurrency);
      if (existingIndex >= 0) {
        // Remove from favorites
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Add to favorites
        return [...prev, { pattern: patternName, currency: currentCurrency }];
      }
    });
  }, [currentCurrency]);

  const isPatternFavorited = useCallback((patternName: string) => {
    return favoritePatterns.some(fav => fav.pattern === patternName && fav.currency === currentCurrency);
  }, [favoritePatterns, currentCurrency]);

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



  // PatternList component for displaying all patterns
  const PatternList: React.FC<{
    patterns: CandlestickPattern[];
    selectedPattern: CandlestickPattern | null;
    onSelectPattern: (pattern: CandlestickPattern) => void;
    isPatternFavorited: (patternName: string) => boolean;
    onToggleFavoritePattern: (patternName: string) => void;
    currentCurrency: string;
  }> = ({ patterns, selectedPattern, onSelectPattern, isPatternFavorited, onToggleFavoritePattern, currentCurrency }) => (
    <section className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700 min-h-[600px] max-h-[800px] sm:min-h-[700px] sm:max-h-[900px] md:min-h-[800px] md:max-h-[1000px] overflow-y-auto">
      <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
        <span className="block sm:hidden">Patterns - {currentCurrency}</span>
        <span className="hidden sm:block">Candlestick Patterns - {currentCurrency}</span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
        {patterns.map((pattern) => (
          <div key={pattern.name} className="flex flex-col">
            <button
              onClick={() => onSelectPattern(pattern)}
              className={`p-2 sm:p-3 rounded-md transition-all duration-200 flex flex-col items-center gap-1 sm:gap-2 text-center ${
                selectedPattern?.name === pattern.name
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <div className="w-12 h-9 sm:w-16 sm:h-12 bg-slate-900/50 rounded-md p-1 flex-shrink-0 border border-slate-600">
                <CandlestickChart candles={pattern.candles} />
              </div>
              <span className="font-semibold text-xs sm:text-sm leading-tight">{pattern.name}</span>
              <div className="flex items-center gap-1 text-xs">
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                  pattern.type === PatternType.BULLISH ? 'bg-green-500/20 text-green-400' :
                  pattern.type === PatternType.BEARISH ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  <span className="hidden sm:inline">{pattern.type}</span>
                  <span className="sm:hidden">
                    {pattern.type === PatternType.BULLISH ? 'B' : 
                     pattern.type === PatternType.BEARISH ? 'S' : 'N'}
                  </span>
                </span>
              </div>
            </button>
            <button
              onClick={() => onToggleFavoritePattern(pattern.name)}
              className={`mt-1 text-center text-sm sm:text-base p-1 transition-colors duration-200 ${
                isPatternFavorited(pattern.name) 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-yellow-400 hover:text-yellow-300'
              }`}
              title={isPatternFavorited(pattern.name) ? "Remove from Favorites" : "Add to Favorites"}
              aria-label="Toggle Favorite"
            >
              {isPatternFavorited(pattern.name) ? '★' : '☆'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );

  // FavoritePatterns component for displaying favorite patterns
  const FavoritePatterns: React.FC<{
    patterns: CandlestickPattern[];
    selectedPattern: CandlestickPattern | null;
    onSelectPattern: (pattern: CandlestickPattern) => void;
    favoritePatterns: Array<{pattern: string, currency: string}>;
    onToggleFavoritePattern: (patternName: string) => void;
  }> = ({ patterns, selectedPattern, onSelectPattern, favoritePatterns, onToggleFavoritePattern }) => {
    // Group favorites by currency
    const favoritesByPattern = favoritePatterns.reduce((acc, fav) => {
      const pattern = patterns.find(p => p.name === fav.pattern);
      if (pattern) {
        const key = fav.pattern;
        if (!acc[key]) {
          acc[key] = { pattern, currencies: [] };
        }
        acc[key].currencies.push(fav.currency);
      }
      return acc;
    }, {} as Record<string, { pattern: CandlestickPattern, currencies: string[] }>);
    
    const favoriteEntries = Object.values(favoritesByPattern);
    
    return (
      <section className="bg-slate-800/50 p-3 sm:p-4 rounded-lg border border-slate-700 min-h-[320px] h-[350px] sm:h-96 md:h-[450px] lg:h-[500px] xl:h-[600px] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Favorites</h2>
        {favoriteEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 sm:h-32 text-slate-400 text-center">
            <span className="text-2xl sm:text-4xl mb-1 sm:mb-2">☆</span>
            <p className="text-xs sm:text-sm">No favorite patterns yet</p>
            <p className="text-xs hidden sm:block">Click the star icon on any pattern to add it here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:gap-3">
            {favoriteEntries.map(({ pattern, currencies }) => (
              <div key={pattern.name} className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => onSelectPattern(pattern)}
                  className={`flex-1 p-2 sm:p-3 rounded-md transition-all duration-200 flex items-center gap-2 sm:gap-3 text-left ${
                    selectedPattern?.name === pattern.name
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <div className="w-12 h-9 sm:w-16 sm:h-12 bg-slate-900/50 rounded-md p-1 flex-shrink-0 border border-slate-600">
                    <CandlestickChart candles={pattern.candles} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-xs sm:text-sm block truncate">{pattern.name}</span>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1">
                      <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                        pattern.type === PatternType.BULLISH ? 'bg-green-500/20 text-green-400' :
                        pattern.type === PatternType.BEARISH ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {pattern.type}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {currencies.map((currency) => (
                          <span key={currency} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            {currency}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onToggleFavoritePattern(pattern.name)}
                  className="text-red-400 hover:text-red-300 text-base sm:text-lg p-1 transition-colors duration-200"
                  title="Remove from Favorites"
                  aria-label="Remove from Favorites"
                >
                  ★
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

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
          <div className="bg-slate-800/50 p-4 sm:p-6 md:p-8 rounded-lg border border-slate-700 h-full">
              <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{pattern.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                      <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${typeBgColor} ${typeColor}`}>{pattern.type}</span>
                      <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full bg-slate-600 text-slate-300">{pattern.trend}</span>
                  </div>
                  <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6">{pattern.description}</p>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">AI Analysis</h3>
                  {isLoading && (
                      <div className="flex items-center justify-center h-32 sm:h-40 text-slate-400">
                           <LoadingIcon />
                          <span className="ml-2 text-sm sm:text-base">Gemini is analyzing the pattern...</span>
                      </div>
                  )}
                  {error && (
                      <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 sm:p-4 rounded-lg">
                          <h4 className="font-bold text-sm sm:text-base">Error</h4>
                          <p className="text-sm sm:text-base">{error}</p>
                      </div>
                  )}
                  {!isLoading && !error && (
                      <div className="prose prose-slate prose-invert max-w-none text-slate-300 prose-headings:text-white prose-strong:text-white text-sm sm:text-base">
                          <div dangerouslySetInnerHTML={{ __html: explanation }} />
                      </div>
                  )}
              </div>
          </div>
      );
  };


  const WelcomeScreen: React.FC = () => (
      <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 bg-slate-800/50 p-4 sm:p-6 rounded-lg border border-slate-700">
          <LogoIcon className="h-12 w-12 sm:h-16 sm:w-16 text-indigo-500 mb-3 sm:mb-4" />
          <h1 className="text-lg sm:text-2xl font-bold text-white mb-2">Welcome to the Candlestick Analyzer</h1>
          <p className="max-w-md text-sm sm:text-base">Select a pattern from the list to view its details and AI analysis.</p>
      </div>
  );


  return (
    <div className="min-h-screen bg-slate-900 text-white p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col">
      <header className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <LogoIcon className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-500"/>
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold tracking-tight">
            <span className="block sm:hidden">Candlestick Analyzer</span>
            <span className="hidden sm:block">Forex Candlestick Pattern Analyzer</span>
          </h1>
        </div>
      </header>
      
      {/* Currency Selector */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <span className="text-white font-semibold text-sm sm:text-base">Select Currency:</span>
        <div className="flex gap-2 w-full sm:w-auto">
          {currencyOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setCurrentCurrency(option.value)}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
                currentCurrency === option.value
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <main className="flex flex-col gap-4 sm:gap-6 flex-grow min-h-0">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
          <div className="w-full md:w-80 md:flex-shrink-0">
            <FavoritePatterns
              patterns={CANDLESTICK_PATTERNS}
              selectedPattern={selectedPattern}
              onSelectPattern={setSelectedPattern}
              favoritePatterns={favoritePatterns}
              onToggleFavoritePattern={toggleFavoritePattern}
            />
          </div>
          <div className="flex-1 min-h-[320px] h-[350px] sm:h-96 md:h-[450px] lg:h-[500px] xl:h-[600px] bg-slate-800/50 rounded-lg border border-slate-700 relative">
            <TradingViewWidget 
              symbol={currencyOptions.find(opt => opt.value === currentCurrency)?.symbol || 'FX:EURUSD'}
              onSymbolChange={setCurrentCurrency} 
            />
          </div>
        </div>
        <PatternList
          patterns={CANDLESTICK_PATTERNS}
          selectedPattern={selectedPattern}
          onSelectPattern={setSelectedPattern}
          isPatternFavorited={isPatternFavorited}
          onToggleFavoritePattern={toggleFavoritePattern}
          currentCurrency={currentCurrency}
        />
        <div className="flex-[2] min-h-0 overflow-y-auto">
          {selectedPattern ? (
              <PatternDetail pattern={selectedPattern} explanation={explanation} isLoading={isLoading} error={error}/>
          ) : (
              <WelcomeScreen />
          )}
        </div>
      </main>
      <footer className="w-full text-center text-xs sm:text-sm text-slate-500 mt-4 sm:mt-6 py-2">
        <span className="block sm:inline">©2025 Saaidin Mat Esa.</span>
        <span className="block sm:inline sm:ml-1">For Educational Purposes.</span>
      </footer>
    </div>
  );
}