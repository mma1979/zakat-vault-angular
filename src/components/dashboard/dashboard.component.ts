import { Component, inject, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { GeminiService } from '../../services/gemini.service';

declare const d3: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8 animate-fade-in">
      <!-- Header / Actions -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{{ lang.t().dashboard }}</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {{ lang.t().rateUpdateInfo }}
          </p>
        </div>
        <button (click)="gemini.fetchRates()" 
          [disabled]="gemini.isLoading()"
          class="group flex items-center gap-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
          <i class="fa-solid transition-transform duration-700" [class.fa-rotate]="!gemini.isLoading()" [class.group-hover:rotate-180]="!gemini.isLoading()" [class.fa-spinner]="gemini.isLoading()" [class.fa-spin]="gemini.isLoading()"></i>
          <span class="font-medium">{{ gemini.isLoading() ? lang.t().fetching : lang.t().fetchRates }}</span>
        </button>
      </div>

      <!-- Main Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Portfolio Value -->
        <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div class="absolute right-0 top-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110 origin-top-right">
            <i class="fa-solid fa-wallet text-9xl"></i>
          </div>
          <h3 class="text-slate-500 dark:text-slate-400 font-medium mb-3 uppercase text-xs tracking-wider">{{ lang.t().portfolioValue }}</h3>
          <p class="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {{ data.portfolioValue() | number:'1.0-0' }} <span class="text-lg text-slate-400 font-normal ml-1">{{ lang.t().currency }}</span>
          </p>
          <div class="mt-4 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full w-fit">
            <i class="fa-solid fa-arrow-trend-up"></i>
            <span>Asset Evaluation</span>
          </div>
        </div>

        <!-- Net Worth -->
        <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
          <div class="absolute right-0 top-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-110 origin-top-right">
            <i class="fa-solid fa-scale-balanced text-9xl"></i>
          </div>
          <h3 class="text-slate-500 dark:text-slate-400 font-medium mb-3 uppercase text-xs tracking-wider">{{ lang.t().netWorth }}</h3>
          <p class="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {{ data.netWorth() | number:'1.0-0' }} <span class="text-lg text-slate-400 font-normal ml-1">{{ lang.t().currency }}</span>
          </p>
          <div class="mt-4 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full w-fit">
             <i class="fa-solid fa-shield-halved"></i>
             <span>After Liabilities</span>
          </div>
        </div>

        <!-- Zakat Status -->
        <div class="relative overflow-hidden p-8 rounded-3xl shadow-sm transition-all duration-300 border"
             [class.bg-gradient-to-br]="true"
             [class.from-amber-50]="!data.isZakatDue()" [class.to-orange-50]="!data.isZakatDue()"
             [class.border-amber-100]="!data.isZakatDue()"
             [class.from-indigo-900]="data.isZakatDue()" [class.to-purple-900]="data.isZakatDue()"
             [class.border-transparent]="data.isZakatDue()"
             [class.text-white]="data.isZakatDue()">
          
          <div class="absolute right-0 top-0 p-6 opacity-10">
            <i class="fa-solid fa-hand-holding-dollar text-8xl"></i>
          </div>
          
          <h3 class="font-medium mb-3 uppercase text-xs tracking-wider opacity-80">{{ lang.t().zakatStatus }}</h3>
          
          @if (data.isZakatDue()) {
             <p class="text-4xl font-bold text-white mb-1">
               {{ lang.t().zakatDue }}
             </p>
             <p class="text-2xl font-medium text-indigo-200 mt-2">
               {{ data.zakatAmount() | number:'1.0-0' }} {{ lang.t().currency }}
             </p>
             <div class="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                <i class="fa-solid fa-circle-check text-emerald-300"></i> Payment Due
             </div>
          } @else {
            <p class="text-4xl font-bold text-emerald-600">
               {{ lang.t().notEligible }}
            </p>
            <p class="text-sm text-slate-500 mt-2">
              < {{ data.nisabThreshold() | number:'1.0-0' }} {{ lang.t().currency }}
            </p>
            <div class="mt-4 inline-flex items-center gap-2 bg-emerald-100/50 px-3 py-1 rounded-full text-sm text-emerald-700">
                <i class="fa-solid fa-seedling"></i> Keep Saving
            </div>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Chart Section -->
        <div class="lg:col-span-1 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex flex-col items-center justify-center">
            <h3 class="w-full text-left font-bold text-slate-900 dark:text-white mb-4">Asset Allocation</h3>
            <div #chartContainer class="w-full h-64 flex items-center justify-center relative">
               <!-- D3 Chart Rendered Here -->
            </div>
            <div class="w-full mt-4 space-y-2">
                <div class="flex justify-between text-xs">
                    <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-yellow-400"></span> Gold</span>
                    <span class="font-mono">{{ getPercentage('gold') }}%</span>
                </div>
                 <div class="flex justify-between text-xs">
                    <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-slate-400"></span> Silver</span>
                    <span class="font-mono">{{ getPercentage('silver') }}%</span>
                </div>
                 <div class="flex justify-between text-xs">
                    <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Cash</span>
                    <span class="font-mono">{{ getPercentage('cash') }}%</span>
                </div>
            </div>
        </div>

        <!-- Holdings Table -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col">
          <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-700">
            <h3 class="font-bold text-slate-900 dark:text-white text-lg">{{ lang.t().totalAssets }}</h3>
          </div>
          <div class="flex-1 overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <tbody>
                  <tr class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                    <td class="pl-8 py-4">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                                <span class="font-bold text-xs">24K</span>
                            </div>
                            <div>
                                <p class="font-semibold text-slate-900 dark:text-white">{{ lang.t().gold24 }}</p>
                                <p class="text-xs text-slate-500">Rate: {{ data.rates().gold24 | number:'1.0-0' }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <p class="font-mono font-medium text-slate-700 dark:text-slate-300">{{ data.portfolioHoldings().GOLD24 | number }} g</p>
                    </td>
                    <td class="pr-8 py-4 text-right">
                        <p class="font-mono font-bold text-slate-900 dark:text-white">{{ (data.portfolioHoldings().GOLD24 * data.rates().gold24) | number:'1.0-0' }} <span class="text-xs text-slate-400 font-normal">EGP</span></p>
                    </td>
                  </tr>

                  <tr class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                    <td class="pl-8 py-4">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
                                <span class="font-bold text-xs">21K</span>
                            </div>
                            <div>
                                <p class="font-semibold text-slate-900 dark:text-white">{{ lang.t().gold21 }}</p>
                                <p class="text-xs text-slate-500">Rate: {{ data.rates().gold21 | number:'1.0-0' }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <p class="font-mono font-medium text-slate-700 dark:text-slate-300">{{ data.portfolioHoldings().GOLD21 | number }} g</p>
                    </td>
                    <td class="pr-8 py-4 text-right">
                        <p class="font-mono font-bold text-slate-900 dark:text-white">{{ (data.portfolioHoldings().GOLD21 * data.rates().gold21) | number:'1.0-0' }} <span class="text-xs text-slate-400 font-normal">EGP</span></p>
                    </td>
                  </tr>

                  <tr class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                    <td class="pl-8 py-4">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center">
                                <i class="fa-solid fa-ring"></i>
                            </div>
                            <div>
                                <p class="font-semibold text-slate-900 dark:text-white">{{ lang.t().silver }}</p>
                                <p class="text-xs text-slate-500">Rate: {{ data.rates().silver | number:'1.0-2' }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <p class="font-mono font-medium text-slate-700 dark:text-slate-300">{{ data.portfolioHoldings().SILVER | number }} g</p>
                    </td>
                    <td class="pr-8 py-4 text-right">
                        <p class="font-mono font-bold text-slate-900 dark:text-white">{{ (data.portfolioHoldings().SILVER * data.rates().silver) | number:'1.0-0' }} <span class="text-xs text-slate-400 font-normal">EGP</span></p>
                    </td>
                  </tr>

                  <tr class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-b border-slate-50 dark:border-slate-700/50">
                    <td class="pl-8 py-4">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                <i class="fa-solid fa-dollar-sign"></i>
                            </div>
                            <div>
                                <p class="font-semibold text-slate-900 dark:text-white">{{ lang.t().usd }}</p>
                                <p class="text-xs text-slate-500">Rate: {{ data.rates().usd | number:'1.2-2' }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <p class="font-mono font-medium text-slate-700 dark:text-slate-300">$ {{ data.portfolioHoldings().USD | number:'1.2-2' }}</p>
                    </td>
                    <td class="pr-8 py-4 text-right">
                        <p class="font-mono font-bold text-slate-900 dark:text-white">{{ (data.portfolioHoldings().USD * data.rates().usd) | number:'1.0-0' }} <span class="text-xs text-slate-400 font-normal">EGP</span></p>
                    </td>
                  </tr>

                   <tr class="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td class="pl-8 py-4">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <span class="font-bold text-xs">EGP</span>
                            </div>
                            <div>
                                <p class="font-semibold text-slate-900 dark:text-white">{{ lang.t().egp }}</p>
                                <p class="text-xs text-slate-500">Base Currency</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <p class="font-mono font-medium text-slate-700 dark:text-slate-300">-</p>
                    </td>
                    <td class="pr-8 py-4 text-right">
                        <p class="font-mono font-bold text-slate-900 dark:text-white">{{ data.portfolioHoldings().EGP | number:'1.0-0' }} <span class="text-xs text-slate-400 font-normal">EGP</span></p>
                    </td>
                  </tr>
                </tbody>
            </table>
          </div>
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
export class DashboardComponent {
  data = inject(DataService);
  lang = inject(LanguageService);
  gemini = inject(GeminiService);

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  constructor() {
    effect(() => {
        // Trigger chart update when portfolio or rates change
        const h = this.data.portfolioHoldings();
        const r = this.data.rates();
        // Wait for view init
        setTimeout(() => this.renderChart(h, r), 0);
    });
  }

  getPercentage(type: 'gold' | 'silver' | 'cash'): string {
      const h = this.data.portfolioHoldings();
      const r = this.data.rates();
      const total = this.data.portfolioValue();
      if (total === 0) return '0';

      let val = 0;
      if (type === 'gold') val = (h.GOLD24 * r.gold24) + (h.GOLD21 * r.gold21);
      if (type === 'silver') val = (h.SILVER * r.silver);
      if (type === 'cash') val = (h.USD * r.usd) + h.EGP;

      return ((val / total) * 100).toFixed(1);
  }

  renderChart(h: any, r: any) {
    if (!this.chartContainer) return;
    
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll("*").remove();

    const goldVal = (h.GOLD24 * r.gold24) + (h.GOLD21 * r.gold21);
    const silverVal = h.SILVER * r.silver;
    const cashVal = (h.USD * r.usd) + h.EGP;
    const total = goldVal + silverVal + cashVal;

    if (total === 0) {
        d3.select(element).append("div").attr("class", "text-slate-400 text-sm").text("No data");
        return;
    }

    const data = [
        { label: 'Gold', value: goldVal, color: '#facc15' },   // yellow-400
        { label: 'Silver', value: silverVal, color: '#94a3b8' }, // slate-400
        { label: 'Cash', value: cashVal, color: '#10b981' }      // emerald-500
    ].filter(d => d.value > 0);

    const width = 250;
    const height = 250;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(element)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const pie = d3.pie().value((d: any) => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius);

    const arcs = svg.selectAll("arc")
        .data(pie(data as any))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc as any)
        .attr("fill", (d: any) => d.data.color)
        .attr("stroke", "white")
        .style("stroke-width", "2px");
  }
}
