import { Injectable, signal, computed, effect } from '@angular/core';

export type Language = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLang = signal<Language>('en');

  dictionary = {
    en: {
      appTitle: 'ZakatVault',
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      liabilities: 'Liabilities',
      zakat: 'Zakat Calc',
      portfolioValue: 'Portfolio Value',
      totalAssets: 'Total Assets',
      netWorth: 'Net Worth',
      gold24: 'Gold 24k',
      gold21: 'Gold 21k',
      silver: 'Silver',
      usd: 'USD',
      egp: 'EGP',
      price: 'Price',
      fetchRates: 'Update Rates',
      fetching: 'Fetching...',
      addTransaction: 'Add Transaction',
      type: 'Type',
      asset: 'Asset',
      amount: 'Amount',
      date: 'Date',
      notes: 'Notes',
      buy: 'Buy',
      sell: 'Sell',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      myLiabilities: 'My Liabilities',
      addLiability: 'Add Liability',
      title: 'Title',
      dueDate: 'Due Date',
      deductible: 'Deductible (Short-term)',
      zakatStatus: 'Zakat Status',
      nisabThreshold: 'Nisab Threshold',
      zakatDue: 'Zakat Due (2.5%)',
      eligible: 'Eligible',
      notEligible: 'Below Nisab',
      gram: 'g',
      currency: 'EGP',
      rateUpdateInfo: 'Rates provided by Gemini AI',
      noTransactions: 'No transactions found.',
      noLiabilities: 'No liabilities recorded.',
      errorFetching: 'Failed to fetch rates.',
    },
    ar: {
      appTitle: 'زكاة فولت',
      dashboard: 'لوحة المعلومات',
      transactions: 'المعاملات',
      liabilities: 'الديون / الالتزامات',
      zakat: 'حساب الزكاة',
      portfolioValue: 'قيمة المحفظة',
      totalAssets: 'إجمالي الأصول',
      netWorth: 'صافي الثروة',
      gold24: 'ذهب 24',
      gold21: 'ذهب 21',
      silver: 'فضة',
      usd: 'دولار أمريكي',
      egp: 'جنيه مصري',
      price: 'السعر',
      fetchRates: 'تحديث الأسعار',
      fetching: 'جاري التحديث...',
      addTransaction: 'إضافة معاملة',
      type: 'النوع',
      asset: 'الأصل',
      amount: 'الكمية',
      date: 'التاريخ',
      notes: 'ملاحظات',
      buy: 'شراء',
      sell: 'بيع',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      myLiabilities: 'التزاماتي',
      addLiability: 'إضافة التزام',
      title: 'العنوان',
      dueDate: 'تاريخ الاستحقاق',
      deductible: 'يخصم من الزكاة (قصير الأجل)',
      zakatStatus: 'حالة الزكاة',
      nisabThreshold: 'حد النصاب',
      zakatDue: 'الزكاة المستحقة (2.5%)',
      eligible: 'تجب فيه الزكاة',
      notEligible: 'دون النصاب',
      gram: 'جم',
      currency: 'ج.م',
      rateUpdateInfo: 'الأسعار مقدمة من Gemini AI',
      noTransactions: 'لا توجد معاملات.',
      noLiabilities: 'لا توجد التزامات مسجلة.',
      errorFetching: 'فشل تحديث الأسعار.',
    }
  };

  t = computed(() => this.dictionary[this.currentLang()]);
  dir = computed(() => this.currentLang() === 'ar' ? 'rtl' : 'ltr');

  constructor() {
    const saved = localStorage.getItem('app_lang') as Language;
    if (saved) {
      this.currentLang.set(saved);
    }
    
    effect(() => {
      document.documentElement.setAttribute('dir', this.dir());
      document.documentElement.lang = this.currentLang();
      localStorage.setItem('app_lang', this.currentLang());
    });
  }

  toggleLanguage() {
    this.currentLang.update(l => l === 'en' ? 'ar' : 'en');
  }
}
