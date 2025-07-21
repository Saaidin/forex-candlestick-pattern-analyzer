
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PatternType, Trend } from '../types';
import { marked } from 'marked';

// IMPORTANT: Set your API key in the environment variables.
// Do not hardcode the API key here.
const apiKey = process.env.API_KEY;

if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Fetches a detailed explanation for a given candlestick pattern using the Gemini API.
 * @param patternName The name of the candlestick pattern.
 * @returns A formatted HTML string with the explanation.
 */
export async function getPatternExplanation(patternName: string, patternType: PatternType, trend: Trend): Promise<string> {
  const model = 'gemini-2.5-flash';

  const prompt = `
    As an expert forex trading analyst, provide a detailed explanation for the candlestick pattern: "${patternName}".
    This is known as a "${patternType}" pattern that signals a potential "${trend}".

    Structure your response in Markdown format with the following sections:

    ### Pattern Formation and Psychology
    Explain how and why this pattern forms. Describe the battle between buyers (bulls) and sellers (bears) that leads to its specific shape.

    ### How to Identify
    Provide a clear, bulleted list of criteria to identify the pattern on a chart. Be specific about candle colors, body sizes, and wick lengths.

    ### Trading Strategy
    Outline a common trading strategy for this pattern. Include:
    - **Entry Point:** Where a trader might enter a trade.
    - **Stop-Loss:** Where to place a stop-loss to manage risk.
    - **Profit Target:** How to determine potential profit targets.

    ### Confirmation Signals
    What other indicators or price action should a trader look for to confirm the signal from this pattern? (e.g., volume, subsequent candles, support/resistance levels).

    Keep the tone professional and educational.
  `;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("Received an empty response from Gemini API.");
    }
    
    // Convert Markdown to HTML
    const htmlContent = marked.parse(text);
    return htmlContent as string;

  } catch (error) {
    console.error(`Error fetching explanation for ${patternName}:`, error);
    throw new Error('The AI model could not generate an explanation. Please try again later.');
  }
}
