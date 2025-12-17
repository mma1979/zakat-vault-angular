import { Injectable, signal, computed } from '@angular/core';

export interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  assetType: 'GOLD24' | 'GOLD21' | 'SILVER' | 'USD' | 'EGP';
  amount: number;
  pricePerUnit?: number; // EGP cost per unit at time of transaction
  date: string;
  notes?: string;
}

export interface Liability {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  isDeductible: boolean;
}

export interface MarketRates {
  gold24: number; // EGP per gram
  gold21: number; // EGP per gram
  silver: number; // EGP per gram
  usd: number;    // EGP per USD
  egp: number;    // 1 (Base)
  lastUpdated: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Signals for state
  transactions = signal<Transaction[]>([]);
  liabilities = signal<Liability[]>([]);
  rates = signal<MarketRates>({
    gold24: 3500, // Fallback initial values
    gold21: 3000,
    silver: 40,
    usd: 48,
    egp: 1,
    lastUpdated: Date.now()
  });

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const tx = localStorage.getItem('zv_transactions');
      if (tx) this.transactions.set(JSON.parse(tx));

      const lbs = localStorage.getItem('zv_liabilities');
      if (lbs) this.liabilities.set(JSON.parse(lbs));

      const rts = localStorage.getItem('zv_rates');
      if (rts) this.rates.set(JSON.parse(rts));
    } catch (e) {
      console.error('Failed to load data', e);
    }
  }

  private saveToStorage() {
    localStorage.setItem('zv_transactions', JSON.stringify(this.transactions()));
    localStorage.setItem('zv_liabilities', JSON.stringify(this.liabilities()));
    localStorage.setItem('zv_rates', JSON.stringify(this.rates()));
  }

  // --- Transactions ---
  addTransaction(tx: Omit<Transaction, 'id'>) {
    const newTx = { ...tx, id: crypto.randomUUID() };
    this.transactions.update(prev => [newTx, ...prev]); // Add to top
    this.saveToStorage();
  }

  deleteTransaction(id: string) {
    this.transactions.update(prev => prev.filter(t => t.id !== id));
    this.saveToStorage();
  }

  // --- Liabilities ---
  addLiability(l: Omit<Liability, 'id'>) {
    const newL = { ...l, id: crypto.randomUUID() };
    this.liabilities.update(prev => [newL, ...prev]);
    this.saveToStorage();
  }

  deleteLiability(id: string) {
    this.liabilities.update(prev => prev.filter(l => l.id !== id));
    this.saveToStorage();
  }

  // --- Rates ---
  updateRates(newRates: Partial<MarketRates>) {
    this.rates.update(prev => ({ ...prev, ...newRates, lastUpdated: Date.now() }));
    this.saveToStorage();
  }

  // --- Derived Computed Stats ---
  
  // Calculate current holdings based on transactions
  portfolioHoldings = computed(() => {
    const hold = {
      GOLD24: 0,
      GOLD21: 0,
      SILVER: 0,
      USD: 0,
      EGP: 0
    };

    this.transactions().forEach(tx => {
      const sign = tx.type === 'buy' ? 1 : -1;
      if (hold.hasOwnProperty(tx.assetType)) {
        hold[tx.assetType] += (tx.amount * sign);
      }
    });

    // Prevent negative holdings from logic errors, though technically possible in margin but not here
    return {
      GOLD24: Math.max(0, hold.GOLD24),
      GOLD21: Math.max(0, hold.GOLD21),
      SILVER: Math.max(0, hold.SILVER),
      USD: Math.max(0, hold.USD),
      EGP: Math.max(0, hold.EGP)
    };
  });

  // Calculate Total Value in EGP
  portfolioValue = computed(() => {
    const h = this.portfolioHoldings();
    const r = this.rates();
    return (
      (h.GOLD24 * r.gold24) +
      (h.GOLD21 * r.gold21) +
      (h.SILVER * r.silver) +
      (h.USD * r.usd) +
      (h.EGP * 1)
    );
  });

  totalLiabilities = computed(() => {
    return this.liabilities().reduce((sum, l) => sum + l.amount, 0);
  });
  
  deductibleLiabilities = computed(() => {
    return this.liabilities()
      .filter(l => l.isDeductible)
      .reduce((sum, l) => sum + l.amount, 0);
  });

  netWorth = computed(() => this.portfolioValue() - this.totalLiabilities());

  zakatBase = computed(() => Math.max(0, this.portfolioValue() - this.deductibleLiabilities()));

  // Nisab is typically 85g of 24k Gold
  nisabThreshold = computed(() => 85 * this.rates().gold24);
  
  isZakatDue = computed(() => this.zakatBase() >= this.nisabThreshold());
  
  zakatAmount = computed(() => this.isZakatDue() ? (this.zakatBase() * 0.025) : 0);
}
