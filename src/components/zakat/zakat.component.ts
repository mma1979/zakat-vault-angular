import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-zakat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-8">
      
      <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold text-slate-800 dark:text-white">{{ lang.t().zakat }}</h2>
        <p class="text-slate-500">{{ lang.t().zakatStatus }}</p>
      </div>

      <!-- Main Result Card -->
      <div class="bg-gradient-to-b from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <i class="fa-solid fa-kaaba text-9xl"></i>
        </div>
        
        <div class="relative z-10 text-center">
          <p class="text-indigo-200 text-lg mb-2 uppercase tracking-wide">{{ lang.t().zakatDue }}</p>
          <h1 class="text-5xl md:text-6xl font-bold mb-4 font-mono">
            {{ data.zakatAmount() | number:'1.0-2' }} <span class="text-2xl">{{ lang.t().currency }}</span>
          </h1>
          
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm">
             @if (data.isZakatDue()) {
               <i class="fa-solid fa-check-circle text-emerald-400"></i> {{ lang.t().eligible }}
             } @else {
               <i class="fa-solid fa-circle-exclamation text-amber-400"></i> {{ lang.t().notEligible }}
             }
          </div>
        </div>
      </div>

      <!-- Breakdown -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
         <div class="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
           <h3 class="font-bold text-slate-700 dark:text-slate-200">Calculation Breakdown</h3>
         </div>
         
         <div class="divide-y divide-slate-100 dark:divide-slate-700">
            <!-- Assets -->
            <div class="p-6 flex justify-between items-center">
              <span class="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <i class="fa-solid fa-wallet w-5 text-center text-slate-400"></i>
                {{ lang.t().portfolioValue }}
              </span>
              <span class="font-mono font-medium dark:text-white">{{ data.portfolioValue() | number:'1.0-2' }}</span>
            </div>

            <!-- Deductible Liabilities -->
            <div class="p-6 flex justify-between items-center bg-red-50/50 dark:bg-red-900/10">
              <span class="text-red-600 dark:text-red-400 flex items-center gap-2">
                <i class="fa-solid fa-file-invoice w-5 text-center"></i>
                {{ lang.t().deductible }}
              </span>
              <span class="font-mono font-medium text-red-700 dark:text-red-400">
                - {{ data.deductibleLiabilities() | number:'1.0-2' }}
              </span>
            </div>

            <!-- Net Zakat Base -->
            <div class="p-6 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-900/10">
              <span class="font-bold text-indigo-900 dark:text-indigo-200">Zakat Base (Net)</span>
              <span class="font-mono font-bold text-indigo-900 dark:text-indigo-200">{{ data.zakatBase() | number:'1.0-2' }}</span>
            </div>

            <!-- Nisab Threshold -->
            <div class="p-6 flex justify-between items-center text-sm">
              <span class="text-slate-500 dark:text-slate-400">
                {{ lang.t().nisabThreshold }} (85g Gold 24k)
              </span>
              <span class="font-mono text-slate-500 dark:text-slate-400">
                 {{ data.nisabThreshold() | number:'1.0-2' }}
              </span>
            </div>
         </div>
      </div>
      
      <div class="p-4 rounded-lg bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-sm text-blue-800 dark:text-slate-300">
         <p class="flex gap-2">
           <i class="fa-solid fa-circle-info mt-0.5"></i>
           <span>
             Note: This calculation uses the Gold standard (85g of 24k) for Nisab, which is commonly used for gold savings. 
             If your savings are purely in Silver, consider manually checking against the Silver Nisab.
             Always consult with a qualified scholar for complex financial situations.
           </span>
         </p>
      </div>

    </div>
  `
})
export class ZakatComponent {
  data = inject(DataService);
  lang = inject(LanguageService);
}
