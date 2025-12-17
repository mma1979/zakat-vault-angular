import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-liabilities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-slate-800 dark:text-white">{{ lang.t().myLiabilities }}</h2>
        <button (click)="openForm()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-colors">
          <i class="fa-solid fa-plus"></i>
          <span class="hidden sm:inline">{{ lang.t().addLiability }}</span>
        </button>
      </div>

      <!-- Form -->
      @if (showForm()) {
        <div class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 gap-4">
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ lang.t().title }}</label>
              <input type="text" formControlName="title" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ lang.t().amount }} (EGP)</label>
                <input type="number" formControlName="amount" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{{ lang.t().dueDate }}</label>
                <input type="date" formControlName="dueDate" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              </div>
            </div>

            <div class="flex items-center gap-2 mt-2">
              <input type="checkbox" formControlName="isDeductible" id="isDeductible" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
              <label for="isDeductible" class="text-sm text-slate-700 dark:text-slate-300 select-none cursor-pointer">{{ lang.t().deductible }}</label>
            </div>

            <div class="flex justify-end gap-3 mt-4">
              <button type="button" (click)="closeForm()" class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                {{ lang.t().cancel }}
              </button>
              <button type="submit" [disabled]="form.invalid" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {{ lang.t().save }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- List -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
         @for (item of data.liabilities(); track item.id) {
           <div class="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between group relative overflow-hidden">
              <div class="absolute top-0 right-0 w-1 h-full" [class.bg-emerald-500]="item.isDeductible" [class.bg-slate-300]="!item.isDeductible"></div>
              
              <div class="flex justify-between items-start mb-3">
                 <div>
                    <h3 class="font-bold text-lg text-slate-800 dark:text-white">{{ item.title }}</h3>
                    <p class="text-xs text-slate-400">{{ lang.t().dueDate }}: {{ item.dueDate }}</p>
                 </div>
                 <button (click)="delete(item.id)" class="text-slate-300 hover:text-red-500 transition-colors">
                   <i class="fa-solid fa-trash"></i>
                 </button>
              </div>

              <div class="flex justify-between items-end">
                <div class="flex items-center gap-2">
                   @if (item.isDeductible) {
                     <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                       <i class="fa-solid fa-check mr-1"></i> Zakat Deductible
                     </span>
                   }
                </div>
                <span class="text-xl font-mono font-bold text-slate-700 dark:text-slate-200">-{{ item.amount | number }}</span>
              </div>
           </div>
         } @empty {
            <div class="col-span-full p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
               {{ lang.t().noLiabilities }}
            </div>
         }
      </div>

    </div>
  `
})
export class LiabilitiesComponent {
  data = inject(DataService);
  lang = inject(LanguageService);
  fb = inject(FormBuilder);

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
