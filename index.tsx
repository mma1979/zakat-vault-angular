import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { AppComponent } from './src/app.component';
import { DashboardComponent } from './src/components/dashboard/dashboard.component';
import { TransactionsComponent } from './src/components/transactions/transactions.component';
import { LiabilitiesComponent } from './src/components/liabilities/liabilities.component';
import { ZakatComponent } from './src/components/zakat/zakat.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter([
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'liabilities', component: LiabilitiesComponent },
      { path: 'zakat', component: ZakatComponent },
    ], withHashLocation())
  ]
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
