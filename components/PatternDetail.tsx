
import React from 'react';
import { CandlestickPattern, PatternType } from '../types';
import { LoadingIcon } from './Icons';

const PatternDetail: React.FC<{
    pattern: CandlestickPattern;
    explanation: string;
    isLoading: boolean;
    error: string | null;
}> = ({ pattern, explanation, isLoading, error }) => {
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

export default PatternDetail;
