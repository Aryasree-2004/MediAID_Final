import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DisbursementService } from '../../core/services/disbursement.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-citizen-disbursements',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule, StatusBadgeComponent],
  template: `
    <div class="page-header">
      <div>
        <h2 class="page-title">My Disbursements</h2>
        <p class="page-sub">Healthcare aid disbursements approved for your claims</p>
      </div>
    </div>

    <div class="center" *ngIf="loading">
      <mat-spinner diameter="40" color="accent"></mat-spinner>
    </div>

    <div class="table-card" *ngIf="!loading && disbursements.length">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Disbursement ID</th>
              <th>Claim ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of disbursements">
              <td class="id-cell">#{{ d.disbursementId }}</td>
              <td class="ref-cell">#{{ d.claimId }}</td>
              <td class="amount-cell">₹{{ d.amount | number:'1.0-2' }}</td>
              <td class="date-cell">{{ d.date | date:'dd MMM y' }}</td>
              <td><app-status-badge [status]="d.status"></app-status-badge></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="empty-state" *ngIf="!loading && !disbursements.length">
      <div class="empty-icon"><mat-icon>account_balance_wallet</mat-icon></div>
      <h3>No disbursements yet</h3>
      <p>Disbursements will appear here once your claims are approved and processed.</p>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .page-title { margin: 0 0 4px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-sub { margin: 0; font-size: 13px; color: rgba(255,255,255,0.4); }

    .center { display: flex; justify-content: center; padding: 60px; }

    .table-card {
      background: linear-gradient(145deg, #111827, #1a2235);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 16px; overflow: hidden;
    }
    .table-wrap { overflow-x: auto; }

    .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .data-table th {
      text-align: left; padding: 12px 20px;
      background: rgba(99,102,241,0.06);
      color: rgba(255,255,255,0.35); font-weight: 600; font-size: 11px;
      letter-spacing: 0.6px; text-transform: uppercase;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .data-table td { padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.7); }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: rgba(99,102,241,0.06); color: white; }

    .id-cell { color: #818cf8; font-weight: 700; font-family: monospace; }
    .ref-cell { color: rgba(255,255,255,0.5); font-family: monospace; }
    .amount-cell { color: #4ade80; font-weight: 700; font-size: 14px; }
    .date-cell { color: rgba(255,255,255,0.35); font-size: 12px; }

    .empty-state {
      text-align: center; padding: 80px 20px;
    }
    .empty-icon {
      width: 64px; height: 64px; background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.2); border-radius: 18px;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
    }
    .empty-icon mat-icon { font-size: 30px; color: rgba(255,255,255,0.2); }
    .empty-state h3 { margin: 0 0 10px; font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.6); }
    .empty-state p { margin: 0; font-size: 14px; color: rgba(255,255,255,0.3); max-width: 360px; margin: 0 auto; }
  `]
})
export class CitizenDisbursementsComponent implements OnInit {
  disbursements: any[] = [];
  loading = true;

  constructor(private disbursementSvc: DisbursementService) {}

  ngOnInit() {
    this.disbursementSvc.getMy().subscribe({
      next: r => { this.loading = false; if (r.data) this.disbursements = r.data; },
      error: () => { this.loading = false; }
    });
  }
}
