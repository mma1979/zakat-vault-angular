import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, Transaction } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      <div class="flex justify-between items-center">
        <div>
           <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{{ lang.t().transactions }}</h2>
           <p class="text-slate-500 text-sm mt-1">Manage your buy and sell history.</p>
        </div>
        <button (click)="openForm()" class="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-slate-200 dark:shadow-none flex items-center gap-2 transition-all active:scale-95">
          <i class="fa-solid fa-plus"></i>
          <span class="hidden sm:inline font-medium">{{ lang.t().addTransaction }}</span>
        </button>
      </div>

      <!-- Form (Collapsible) -->
      @if (showForm()) {
        <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 animate-slide-down relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-6">New Transaction</h3>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Type -->
            <div class="col-span-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{{ lang.t().type }}</label>
              <div class="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                <button type="button" (click)="setType('buy')" 
                  class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all"
                  [class]="form.value.type === 'buy' ? 'bg-white dark:bg-slate-600 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'">
                  <i class="fa-solid fa-arrow-down mr-1"></i> {{ lang.t().buy }}
                </button>
                <button type="button" (click)="setType('sell')" 
                  class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all"
                  [class]="form.value.type === 'sell' ? 'bg-white dark:bg-slate-600 text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'">
                  <i class="fa-solid fa-arrow-up mr-1"></i> {{ lang.t().sell }}
                </button>
              </div>
            </div>

            <!-- Asset -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{{ lang.t().asset }}</label>
              <div class="relative">
                 <select formControlName="assetType" class="w-full appearance-none rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors font-medium">
                    <option value="GOLD24">{{ lang.t().gold24 }}</option>
                    <option value="GOLD21">{{ lang.t().gold21 }}</option>
                    <option value="SILVER">{{ lang.t().silver }}</option>
                    <option value="USD">{{ lang.t().usd }}</option>
                    <option value="EGP">{{ lang.t().egp }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                    <i class="fa-solid fa-chevron-down text-xs"></i>
                  </div>
              </div>
            </div>

            <!-- Amount -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{{ lang.t().amount }}</label>
              <input type="number" formControlName="amount" placeholder="0.00" class="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors font-mono font-medium">
            </div>

            <!-- Date -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{{ lang.t().date }}</label>
              <input type="date" formControlName="date" class="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors font-medium">
            </div>

            <!-- Notes -->
            <div class="md:col-span-2">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{{ lang.t().notes }}</label>
              <textarea formControlName="notes" rows="2" class="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors"></textarea>
            </div>

            <!-- Actions -->
            <div class="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button type="button" (click)="closeForm()" class="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                {{ lang.t().cancel }}
              </button>
              <button type="submit" [disabled]="form.invalid" class="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed">
                {{ lang.t().save }}
              </button>
            </div>

          </form>
        </div>
      }

      <!-- List -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        @if (data.transactions().length === 0) {
          <div class="p-16 text-center text-slate-400 dark:text-slate-500">
            <div class="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
               <i class="fa-solid fa-receipt text-3xl"></i>
            </div>
            <p class="text-lg font-medium">{{ lang.t().noTransactions }}</p>
            <p class="text-sm">Start by adding your first asset purchase.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-700/50 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th scope="col" class="px-8 py-4 font-semibold">{{ lang.t().date }}</th>
                  <th scope="col" class="px-6 py-4 font-semibold">{{ lang.t().type }}</th>
                  <th scope="col" class="px-6 py-4 font-semibold">{{ lang.t().asset }}</th>
                  <th scope="col" class="px-6 py-4 font-semibold text-right">{{ lang.t().amount }}</th>
                  <th scope="col" class="px-8 py-4 font-semibold text-center">{{ lang.t().delete }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                @for (tx of data.transactions(); track tx.id) {
                  <tr class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td class="px-8 py-5 font-medium text-slate-600 dark:text-slate-300">{{ tx.date }}</td>
                    <td class="px-6 py-5">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border" 
                        [class.bg-emerald-50]="tx.type === 'buy'" 
                        [class.border-emerald-100]="tx.type === 'buy'"
                        [class.text-emerald-700]="tx.type === 'buy'"
                        [class.bg-red-50]="tx.type === 'sell'"
                        [class.border-red-100]="tx.type === 'sell'"
                        [class.text-red-700]="tx.type === 'sell'">
                        <i class="fa-solid" [class.fa-arrow-down]="tx.type==='buy'" [class.fa-arrow-up]="tx.type==='sell'"></i>
                        {{ tx.type === 'buy' ? lang.t().buy : lang.t().sell }}
                      </span>
                    </td>
                    <td class="px-6 py-5">
                      <div class="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                         <div class="w-2 h-2 rounded-full" 
                            [class.bg-yellow-400]="tx.assetType.includes('GOLD')"
                            [class.bg-slate-400]="tx.assetType === 'SILVER'"
                            [class.bg-green-500]="tx.assetType === 'USD'"
                            [class.bg-indigo-500]="tx.assetType === 'EGP'"></div>
                         {{ getAssetName(tx.assetType) }}
                      </div>
                    </td>
                    <td class="px-6 py-5 text-right font-mono font-medium text-slate-700 dark:text-slate-200">
                      {{ tx.amount | number }}
                    </td>
                    <td class="px-8 py-5 text-center">
                      <button (click)="delete(tx.id)" class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                        <i class="fa-solid fa-trash-can"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

    </div>
  `,
  styles: [`
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-20px); height: 0; }
      to { opacity: 1; transform: translateY(0); height: auto; }
    }
    .animate-slide-down {
      animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `]
})
export class TransactionsComponent {
  data = inject(DataService);
  lang = inject(LanguageService);
  private fb: FormBuilder = inject(FormBuilder);

  showForm = signal(false);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      type: ['buy', Validators.required],
      assetType: ['GOLD24', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      notes: ['']
    });
  }

  openForm() {
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.form.reset({
      type: 'buy',
      assetType: 'GOLD24',
      date: new Date().toISOString().split('T')[0]
    });
  }

  setType(type: 'buy' | 'sell') {
    this.form.patchValue({ type });
  }

  getAssetName(code: string): string {
    const map: any = {
      'GOLD24': this.lang.t().gold24,
      'GOLD21': this.lang.t().gold21,
      'SILVER': this.lang.t().silver,
      'USD': this.lang.t().usd,
      'EGP': this.lang.t().egp,
    };
    return map[code] || code;
  }

  onSubmit() {
    if (this.form.valid) {
      this.data.addTransaction(this.form.value);
      this.closeForm();
    }
  }

  delete(id: string) {
    if (confirm('Are you sure?')) {
      this.data.deleteTransaction(id);
    }
  }
}