import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-zakat',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      <div class="text-center space-y-2 mb-8">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white">{{ lang.t().zakat }}</h2>
        <p class="text-slate-500">{{ lang.t().zakatStatus }}</p>
      </div>

      <!-- Main Result Card -->
      <div class="rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden transition-all duration-500 group"
           [class.bg-gradient-to-br]="true"
           [class.from-slate-800]="!data.isZakatDue()" [class.to-slate-900]="!data.isZakatDue()"
           [class.from-indigo-600]="data.isZakatDue()" [class.to-purple-800]="data.isZakatDue()">
        
        <!-- Background Pattern -->
        <div class="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div class="absolute -right-10 -top-10 p-10 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
          <i class="fa-solid fa-kaaba text-[12rem]"></i>
        </div>
        
        <div class="relative z-10 text-center flex flex-col items-center">
          <p class="text-white/70 text-lg mb-2 uppercase tracking-[0.2em] font-medium">{{ lang.t().zakatDue }}</p>
          <h1 class="text-6xl md:text-7xl font-bold mb-6 font-mono tracking-tighter">
            {{ data.zakatAmount() | number:'1.0-2' }} <span class="text-3xl text-white/50">{{ lang.t().currency }}</span>
          </h1>
          
          <div class="inline-flex items-center gap-3 px-6 py-2 rounded-full backdrop-blur-md border border-white/20 text-white font-medium shadow-lg">
             @if (data.isZakatDue()) {
               <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
               <span class="text-emerald-100">{{ lang.t().eligible }}</span>
             } @else {
               <div class="w-2 h-2 rounded-full bg-amber-400"></div>
               <span class="text-amber-100">{{ lang.t().notEligible }}</span>
             }
          </div>
        </div>
      </div>

      <!-- Breakdown -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden">
         <div class="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
           <h3 class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
             <i class="fa-solid fa-calculator text-indigo-500"></i> Calculation Breakdown
           </h3>
         </div>
         
         <div class="divide-y divide-slate-100 dark:divide-slate-700">
            <!-- Assets -->
            <div class="p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
              <span class="text-slate-600 dark:text-slate-400 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <i class="fa-solid fa-wallet"></i>
                </div>
                {{ lang.t().portfolioValue }}
              </span>
              <span class="font-mono font-medium text-lg dark:text-white">{{ data.portfolioValue() | number:'1.0-2' }}</span>
            </div>

            <!-- Deductible Liabilities -->
            <div class="p-6 flex justify-between items-center bg-red-50/30 dark:bg-red-900/10">
              <span class="text-red-700 dark:text-red-400 flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <i class="fa-solid fa-file-invoice"></i>
                </div>
                {{ lang.t().deductible }}
              </span>
              <span class="font-mono font-medium text-lg text-red-700 dark:text-red-400">
                - {{ data.deductibleLiabilities() | number:'1.0-2' }}
              </span>
            </div>

            <!-- Net Zakat Base -->
            <div class="p-6 flex justify-between items-center bg-indigo-50/30 dark:bg-indigo-900/10">
              <span class="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-3">
                 <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <i class="fa-solid fa-scale-balanced"></i>
                 </div>
                 Zakat Base (Net)
              </span>
              <span class="font-mono font-bold text-xl text-indigo-900 dark:text-indigo-200">{{ data.zakatBase() | number:'1.0-2' }}</span>
            </div>

            <!-- Nisab Threshold -->
            <div class="p-6 flex justify-between items-center text-sm bg-slate-50 dark:bg-slate-800/50">
              <span class="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <i class="fa-solid fa-circle-info"></i>
                {{ lang.t().nisabThreshold }} (85g Gold 24k)
              </span>
              <span class="font-mono text-slate-500 dark:text-slate-400">
                 {{ data.nisabThreshold() | number:'1.0-2' }}
              </span>
            </div>
         </div>
      </div>
      
      <div class="p-6 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 text-sm text-blue-800 dark:text-slate-400 flex gap-4 items-start shadow-sm">
         <i class="fa-solid fa-lightbulb text-xl text-blue-500 mt-0.5"></i>
         <div>
             <p class="font-bold mb-1">Methodology Note</p>
             <p class="leading-relaxed opacity-90">
                This calculation uses the Gold standard (85g of 24k) for Nisab, which is commonly used for gold savings. 
                If your savings are purely in Silver, consider manually checking against the Silver Nisab.
                Always consult with a qualified scholar for complex financial situations.
             </p>
         </div>
      </div>

    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `]
})
export class ZakatComponent {
  data = inject(DataService);
  lang = inject(LanguageService);
}
