import { Injectable, signal } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { DataService, MarketRates } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private dataService: DataService) {}

  async fetchRates() {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const apiKey = process.env['API_KEY'];
      if (!apiKey) throw new Error('API Key missing');

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        You are a financial data API. 
        Get the current estimated market rates in EGYPT (EGP).
        I need:
        - Gold 24k price per gram in EGP
        - Gold 21k price per gram in EGP
        - Silver price per gram in EGP
        - USD to EGP exchange rate

        Return ONLY a raw JSON object with this schema (no markdown, no backticks):
        {
          "gold24": number,
          "gold21": number,
          "silver": number,
          "usd": number
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text.trim().replace(/```json/g, '').replace(/```/g, '');
      const json = JSON.parse(text);

      if (json.gold24 && json.usd) {
        this.dataService.updateRates({
          gold24: json.gold24,
          gold21: json.gold21,
          silver: json.silver,
          usd: json.usd,
        });
      } else {
        throw new Error('Invalid data format');
      }

    } catch (e) {
      console.error('Gemini Error:', e);
      this.error.set('Failed to fetch rates. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
