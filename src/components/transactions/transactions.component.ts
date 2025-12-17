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
    <div class="max-w-4xl mx-auto space-y-6">
      
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">{{ lang.t().transactions }}</h2>
        <button (click)="openForm()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-plus"></i>
          <span class="hidden sm:inline">{{ lang.t().addTransaction }}</span>
        </button>
      </div>

      <!-- Form (Collapsible) -->
      @if (showForm()) {
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in-down">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <!-- Type -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ lang.t().type }}</label>
              <div class="flex rounded-md shadow-sm">
                <button type="button" (click)="setType('buy')" 
                  class="flex-1 px-4 py-2 text-sm font-medium border rounded-l-md focus:z-10 focus:ring-2"
                  [class]="form.value.type === 'buy' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'">
                  {{ lang.t().buy }}
                </button>
                <button type="button" (click)="setType('sell')" 
                  class="flex-1 px-4 py-2 text-sm font-medium border rounded-r-md focus:z-10 focus:ring-2"
                  [class]="form.value.type === 'sell' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'">
                  {{ lang.t().sell }}
                </button>
              </div>
            </div>

            <!-- Asset -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ lang.t().asset }}</label>
              <select formControlName="assetType" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2">
                <option value="GOLD24">{{ lang.t().gold24 }}</option>
                <option value="GOLD21">{{ lang.t().gold21 }}</option>
                <option value="SILVER">{{ lang.t().silver }}</option>
                <option value="USD">{{ lang.t().usd }}</option>
                <option value="EGP">{{ lang.t().egp }}</option>
              </select>
            </div>

            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ lang.t().amount }}</label>
              <input type="number" formControlName="amount" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2">
            </div>

            <!-- Date -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ lang.t().date }}</label>
              <input type="date" formControlName="date" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2">
            </div>

            <!-- Notes -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ lang.t().notes }}</label>
              <textarea formControlName="notes" rows="2" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2"></textarea>
            </div>

            <!-- Actions -->
            <div class="md:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" (click)="closeForm()" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                {{ lang.t().cancel }}
              </button>
              <button type="submit" [disabled]="form.invalid" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ lang.t().save }}
              </button>
            </div>

          </form>
        </div>
      }

      <!-- List -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        @if (data.transactions().length === 0) {
          <div class="p-12 text-center text-slate-500 dark:text-slate-400">
            <i class="fa-regular fa-folder-open text-4xl mb-3"></i>
            <p>{{ lang.t().noTransactions }}</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-slate-500 dark:text-slate-400">
              <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="col" class="px-6 py-3">{{ lang.t().date }}</th>
                  <th scope="col" class="px-6 py-3">{{ lang.t().type }}</th>
                  <th scope="col" class="px-6 py-3">{{ lang.t().asset }}</th>
                  <th scope="col" class="px-6 py-3 text-right">{{ lang.t().amount }}</th>
                  <th scope="col" class="px-6 py-3 text-center">{{ lang.t().delete }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                @for (tx of data.transactions(); track tx.id) {
                  <tr class="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td class="px-6 py-4 font-medium">{{ tx.date }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2 py-1 rounded-full text-xs font-semibold" 
                        [class.bg-emerald-100]="tx.type === 'buy'" 
                        [class.text-emerald-700]="tx.type === 'buy'"
                        [class.bg-red-100]="tx.type === 'sell'"
                        [class.text-red-700]="tx.type === 'sell'">
                        {{ tx.type === 'buy' ? lang.t().buy : lang.t().sell }}
                      </span>
                    </td>
                    <td class="px-6 py-4 font-semibold text-slate-800 dark:text-white">
                      {{ getAssetName(tx.assetType) }}
                    </td>
                    <td class="px-6 py-4 text-right font-mono">
                      {{ tx.amount | number }}
                    </td>
                    <td class="px-6 py-4 text-center">
                      <button (click)="delete(tx.id)" class="text-slate-400 hover:text-red-500 transition-colors">
                        <i class="fa-solid fa-trash"></i>
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
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-down {
      animation: fadeInDown 0.3s ease-out;
    }
  `]
})
export class TransactionsComponent {
  data = inject(DataService);
  lang = inject(LanguageService);
  fb = inject(FormBuilder);

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
