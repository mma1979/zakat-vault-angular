import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, Transaction } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-liabilities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      <div class="flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{{ lang.t().myLiabilities }}</h2>
            <p class="text-slate-500 text-sm mt-1">Track debts and deductible payments.</p>
        </div>
        <button (click)="openForm()" class="bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95">
          <i class="fa-solid fa-plus"></i>
          <span class="hidden sm:inline font-medium">{{ lang.t().addLiability }}</span>
        </button>
      </div>

      <!-- Form -->
      @if (showForm()) {
        <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 animate-slide-down">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 gap-6">
            
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{{ lang.t().title }}</label>
              <input type="text" formControlName="title" placeholder="e.g. Credit Card Debt" class="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors">
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{{ lang.t().amount }} (EGP)</label>
                <input type="number" formControlName="amount" class="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors font-mono font-medium">
              </div>
              
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{{ lang.t().dueDate }}</label>
                <input type="date" formControlName="dueDate" class="w-full rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors font-medium">
              </div>
            </div>

            <div class="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <input type="checkbox" formControlName="isDeductible" id="isDeductible" class="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500">
              <div>
                  <label for="isDeductible" class="text-sm font-medium text-slate-900 dark:text-white select-none cursor-pointer block">{{ lang.t().deductible }}</label>
                  <p class="text-xs text-slate-500">Check this if the debt is short-term and due immediately, reducing your Zakat base.</p>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" (click)="closeForm()" class="px-6 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                {{ lang.t().cancel }}
              </button>
              <button type="submit" [disabled]="form.invalid" class="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md disabled:opacity-50">
                {{ lang.t().save }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
         @for (item of data.liabilities(); track item.id) {
           <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between group relative overflow-hidden hover:shadow-md transition-all">
              <!-- Colored Sidebar -->
              <div class="absolute top-0 left-0 w-2 h-full transition-colors" [class.bg-emerald-500]="item.isDeductible" [class.bg-slate-300]="!item.isDeductible"></div>
              
              <div class="pl-4">
                  <div class="flex justify-between items-start mb-4">
                     <div>
                        <h3 class="font-bold text-xl text-slate-900 dark:text-white">{{ item.title }}</h3>
                        <div class="flex items-center gap-2 mt-1 text-xs text-slate-500">
                             <i class="fa-regular fa-calendar"></i>
                             <span>{{ item.dueDate }}</span>
                        </div>
                     </div>
                     <button (click)="delete(item.id)" class="text-slate-300 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2">
                       <i class="fa-solid fa-trash-can"></i>
                     </button>
                  </div>

                  <div class="flex justify-between items-end mt-4">
                    <div class="flex items-center gap-2">
                       @if (item.isDeductible) {
                         <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                           <i class="fa-solid fa-check"></i> Deductible
                         </span>
                       } else {
                         <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500">
                            Non-Deductible
                         </span>
                       }
                    </div>
                    <span class="text-2xl font-mono font-bold text-slate-800 dark:text-white tracking-tight">-{{ item.amount | number }}</span>
                  </div>
              </div>
           </div>
         } @empty {
            <div class="col-span-full p-16 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400">
               <i class="fa-solid fa-file-invoice-dollar text-4xl mb-4 text-slate-300"></i>
               <p>{{ lang.t().noLiabilities }}</p>
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
export class LiabilitiesComponent {
  data = inject(DataService);
  lang = inject(LanguageService);
  private fb: FormBuilder = inject(FormBuilder);

  showForm = signal(false);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      dueDate: [new Date().toISOString().split('T')[0], Validators.required],
      isDeductible: [true]
    });
  }

  openForm() {
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.form.reset({
      dueDate: new Date().toISOString().split('T')[0],
      isDeductible: true
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.data.addLiability(this.form.value);
      this.closeForm();
    }
  }

  delete(id: string) {
    if (confirm('Are you sure?')) {
      this.data.deleteLiability(id);
    }
  }
}