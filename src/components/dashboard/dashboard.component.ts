import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header / Actions -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-3xl font-bold text-slate-800 dark:text-white">{{ lang.t().dashboard }}</h2>
          <p class="text-slate-500 text-sm mt-1">{{ lang.t().rateUpdateInfo }}</p>
        </div>
        <button (click)="gemini.fetchRates()" 
          [disabled]="gemini.isLoading()"
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-70">
          <i class="fa-solid" [class.fa-rotate]="!gemini.isLoading()" [class.fa-spinner]="gemini.isLoading()" [class.fa-spin]="gemini.isLoading()"></i>
          <span>{{ gemini.isLoading() ? lang.t().fetching : lang.t().fetchRates }}</span>
        </button>
      </div>

      <!-- Main Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Portfolio Value -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
          <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <i class="fa-solid fa-wallet text-6xl text-emerald-500"></i>
          </div>
          <h3 class="text-slate-500 dark:text-slate-400 font-medium mb-2">{{ lang.t().portfolioValue }}</h3>
          <p class="text-3xl font-bold text-slate-800 dark:text-white">
            {{ data.portfolioValue() | number:'1.0-0' }} <span class="text-base text-slate-500 font-normal">{{ lang.t().currency }}</span>
          </p>
        </div>

        <!-- Net Worth -->
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group">
          <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <i class="fa-solid fa-scale-balanced text-6xl text-blue-500"></i>
          </div>
          <h3 class="text-slate-500 dark:text-slate-400 font-medium mb-2">{{ lang.t().netWorth }}</h3>
          <p class="text-3xl font-bold text-slate-800 dark:text-white">
            {{ data.netWorth() | number:'1.0-0' }} <span class="text-base text-slate-500 font-normal">{{ lang.t().currency }}</span>
          </p>
        </div>

        <!-- Zakat Status -->
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 p-6 rounded-2xl shadow-sm border border-amber-100 dark:border-slate-700 relative overflow-hidden">
          <div class="absolute right-0 top-0 p-4 opacity-10">
            <i class="fa-solid fa-hand-holding-dollar text-6xl text-amber-500"></i>
          </div>
          <h3 class="text-amber-700 dark:text-amber-500 font-medium mb-2">{{ lang.t().zakatStatus }}</h3>
          @if (data.isZakatDue()) {
             <p class="text-2xl font-bold text-red-600">
               {{ lang.t().zakatDue }}
             </p>
             <p class="text-lg font-semibold text-red-500 mt-1">
               {{ data.zakatAmount() | number:'1.0-0' }} {{ lang.t().currency }}
             </p>
          } @else {
            <p class="text-2xl font-bold text-emerald-600">
               {{ lang.t().notEligible }}
            </p>
            <p class="text-sm text-slate-500 mt-1">
              < {{ data.nisabThreshold() | number:'1.0-0' }} {{ lang.t().currency }}
            </p>
          }
        </div>
      </div>

      <!-- Current Rates Grid -->
      <h3 class="text-xl font-bold text-slate-700 dark:text-slate-200 mt-4">{{ lang.t().price }} (Live)</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Gold 24 -->
        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
           <div class="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mb-2">
             <span class="font-bold text-xs">24K</span>
           </div>
           <span class="text-xs text-slate-500 uppercase">{{ lang.t().gold24 }}</span>
           <span class="text-lg font-bold text-slate-800 dark:text-white">{{ data.rates().gold24 | number:'1.0-0' }}</span>
        </div>

        <!-- Gold 21 -->
        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
           <div class="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mb-2">
             <span class="font-bold text-xs">21K</span>
           </div>
           <span class="text-xs text-slate-500 uppercase">{{ lang.t().gold21 }}</span>
           <span class="text-lg font-bold text-slate-800 dark:text-white">{{ data.rates().gold21 | number:'1.0-0' }}</span>
        </div>

        <!-- Silver -->
        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
           <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-2">
             <i class="fa-solid fa-ring"></i>
           </div>
           <span class="text-xs text-slate-500 uppercase">{{ lang.t().silver }}</span>
           <span class="text-lg font-bold text-slate-800 dark:text-white">{{ data.rates().silver | number:'1.0-2' }}</span>
        </div>

        <!-- USD -->
        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center">
           <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
             <i class="fa-solid fa-dollar-sign"></i>
           </div>
           <span class="text-xs text-slate-500 uppercase">{{ lang.t().usd }}</span>
           <span class="text-lg font-bold text-slate-800 dark:text-white">{{ data.rates().usd | number:'1.2-2' }}</span>
        </div>
      </div>

      <!-- Holdings Summary -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
          <h3 class="font-bold text-slate-700 dark:text-white">{{ lang.t().totalAssets }}</h3>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700">
          <div class="px-6 py-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <span class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div class="w-2 h-2 rounded-full bg-yellow-500"></div> {{ lang.t().gold24 }}
            </span>
            <span class="font-mono font-medium dark:text-white">{{ data.portfolioHoldings().GOLD24 | number }} g</span>
          </div>
          <div class="px-6 py-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <span class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div class="w-2 h-2 rounded-full bg-yellow-400"></div> {{ lang.t().gold21 }}
            </span>
            <span class="font-mono font-medium dark:text-white">{{ data.portfolioHoldings().GOLD21 | number }} g</span>
          </div>
          <div class="px-6 py-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <span class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div class="w-2 h-2 rounded-full bg-slate-400"></div> {{ lang.t().silver }}
            </span>
            <span class="font-mono font-medium dark:text-white">{{ data.portfolioHoldings().SILVER | number }} g</span>
          </div>
          <div class="px-6 py-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <span class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div class="w-2 h-2 rounded-full bg-green-500"></div> {{ lang.t().usd }}
            </span>
            <span class="font-mono font-medium dark:text-white">$ {{ data.portfolioHoldings().USD | number:'1.2-2' }}</span>
          </div>
          <div class="px-6 py-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <span class="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <div class="w-2 h-2 rounded-full bg-indigo-500"></div> {{ lang.t().egp }}
            </span>
            <span class="font-mono font-medium dark:text-white">{{ data.portfolioHoldings().EGP | number:'1.0-0' }} EGP</span>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent {
  data = inject(DataService);
  lang = inject(LanguageService);
  gemini = inject(GeminiService);
}
