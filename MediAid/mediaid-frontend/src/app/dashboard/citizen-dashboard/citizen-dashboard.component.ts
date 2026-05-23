import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { ClaimService } from '../../core/services/claim.service';
import { DisbursementService } from '../../core/services/disbursement.service';
import { PaymentService } from '../../core/services/payment.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule, StatusBadgeComponent],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <div class="dash-header">
        <div>
          <div class="dash-eyebrow">
            <span class="eyebrow-dot"></span> Overview
          </div>
          <h1 class="dash-title">My Dashboard</h1>
          <p class="dash-subtitle">Track your healthcare aid, claims, and disbursements</p>
        </div>
        <a routerLink="/citizen/enrollments" class="enroll-btn">
          <mat-icon>add</mat-icon>
          New Enrollment
        </a>
      </div>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <div class="summary-card" *ngFor="let card of summaryCards">
          <div class="card-glow" [style.background]="card.glow"></div>
          <div class="card-icon-wrap" [style.background]="card.grad">
            <mat-icon>{{ card.icon }}</mat-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ card.value }}</div>
            <div class="card-label">{{ card.label }}</div>
          </div>
          <div class="card-trend">
            <span class="material-icons trend-arrow">trending_up</span>
          </div>
        </div>
      </div>

      <!-- Tables Row -->
      <div class="tables-row">
        <!-- Enrollments -->
        <div class="table-card">
          <div class="table-card-header">
            <div class="tch-left">
              <div class="tch-icon blue"><span class="material-icons">assignment</span></div>
              <h3>Recent Enrollments</h3>
            </div>
            <a routerLink="/citizen/enrollments" class="view-all-btn">
              View all <span class="material-icons">arrow_forward</span>
            </a>
          </div>
          <div class="table-wrap" *ngIf="enrollments.length; else noEnroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Enrollment ID</th>
                  <th>Scheme</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let e of enrollments.slice(0,5)">
                  <td class="id-cell">#{{ e.enrollmentId }}</td>
                  <td class="scheme-cell">Scheme #{{ e.schemeId }}</td>
                  <td class="date-cell">{{ e.enrollmentDate | date:'dd MMM y' }}</td>
                  <td><app-status-badge [status]="e.status"></app-status-badge></td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noEnroll>
            <div class="empty-state">
              <div class="empty-icon"><span class="material-icons">assignment</span></div>
              <p>No enrollments yet</p>
              <a routerLink="/citizen/enrollments">Browse schemes &rarr;</a>
            </div>
          </ng-template>
        </div>

        <!-- Claims -->
        <div class="table-card">
          <div class="table-card-header">
            <div class="tch-left">
              <div class="tch-icon purple"><span class="material-icons">receipt_long</span></div>
              <h3>Recent Claims</h3>
            </div>
            <a routerLink="/citizen/claims" class="view-all-btn">
              View all <span class="material-icons">arrow_forward</span>
            </a>
          </div>
          <div class="table-wrap" *ngIf="claims.length; else noClaim">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let c of claims.slice(0,5)">
                  <td class="id-cell">#{{ c.claimId }}</td>
                  <td class="amount-cell">₹{{ c.claimAmount | number:'1.0-0' }}</td>
                  <td class="date-cell">{{ c.claimDate | date:'dd MMM y' }}</td>
                  <td><app-status-badge [status]="c.status"></app-status-badge></td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #noClaim>
            <div class="empty-state">
              <div class="empty-icon"><span class="material-icons">receipt_long</span></div>
              <p>No claims submitted</p>
              <a routerLink="/citizen/claims">Submit a claim &rarr;</a>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { font-family: 'Inter', 'Roboto', sans-serif; color: white; }

    /* Header */
    .dash-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
    }
    .dash-eyebrow {
      display: flex; align-items: center; gap: 7px;
      font-size: 12px; font-weight: 600; color: #818cf8;
      text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;
    }
    .eyebrow-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #6366f1;
      box-shadow: 0 0 8px rgba(99,102,241,0.8);
      animation: pulse-glow 2s ease-in-out infinite;
    }
    @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 8px rgba(99,102,241,0.8); } 50% { box-shadow: 0 0 18px rgba(99,102,241,1); } }
    .dash-title {
      margin: 0 0 6px; font-size: 1.8rem; font-weight: 800; color: white; letter-spacing: -0.8px;
    }
    .dash-subtitle { margin: 0; font-size: 14px; color: rgba(255,255,255,0.4); }
    .enroll-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white; text-decoration: none; padding: 11px 22px; border-radius: 10px;
      font-size: 14px; font-weight: 700; transition: all 0.2s;
      box-shadow: 0 4px 18px rgba(99,102,241,0.4);
    }
    .enroll-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.55); }
    .enroll-btn mat-icon { font-size: 18px; height: 18px; width: 18px; }

    /* Summary Cards */
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 28px; }
    .summary-card {
      background: linear-gradient(145deg, #111827, #1a2235);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 16px;
      padding: 22px; display: flex; align-items: center; gap: 16px;
      position: relative; overflow: hidden; transition: all 0.25s;
    }
    .summary-card:hover { transform: translateY(-3px); border-color: rgba(99,102,241,0.3); box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
    .card-glow {
      position: absolute; top: -30px; right: -30px; width: 120px; height: 120px;
      border-radius: 50%; opacity: 0.12; filter: blur(20px); pointer-events: none;
    }
    .card-icon-wrap {
      width: 50px; height: 50px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      position: relative; z-index: 1;
    }
    .card-icon-wrap mat-icon { color: white; font-size: 24px; height: 24px; width: 24px; }
    .card-content { flex: 1; position: relative; z-index: 1; }
    .card-value { font-size: 1.75rem; font-weight: 800; color: white; line-height: 1; }
    .card-label { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 6px; font-weight: 500; }
    .card-trend {
      position: relative; z-index: 1;
    }
    .trend-arrow { font-size: 18px; color: rgba(74,222,128,0.6); }

    /* Tables */
    .tables-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .table-card {
      background: linear-gradient(145deg, #111827, #1a2235);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 16px;
      overflow: hidden;
    }
    .table-card-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .tch-left { display: flex; align-items: center; gap: 10px; }
    .tch-icon {
      width: 32px; height: 32px; border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
    }
    .tch-icon.blue { background: rgba(99,102,241,0.2); }
    .tch-icon.blue .material-icons { color: #818cf8; font-size: 17px; }
    .tch-icon.purple { background: rgba(167,139,250,0.2); }
    .tch-icon.purple .material-icons { color: #c4b5fd; font-size: 17px; }
    .table-card-header h3 { margin: 0; font-size: 14px; font-weight: 700; color: white; }
    .view-all-btn {
      display: inline-flex; align-items: center; gap: 3px;
      color: #818cf8; font-size: 12px; font-weight: 600; text-decoration: none;
      padding: 5px 10px; border-radius: 6px; background: rgba(99,102,241,0.1);
      transition: all 0.18s;
    }
    .view-all-btn:hover { background: rgba(99,102,241,0.2); color: #a5b4fc; }
    .view-all-btn .material-icons { font-size: 13px; }
    .table-wrap { overflow-x: auto; }

    .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .data-table th {
      text-align: left; padding: 10px 16px;
      background: rgba(99,102,241,0.06);
      color: rgba(255,255,255,0.35); font-weight: 600; font-size: 11px;
      letter-spacing: 0.6px; text-transform: uppercase;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .data-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.7); }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: rgba(99,102,241,0.06); color: white; }

    .id-cell { color: #818cf8; font-weight: 600; font-family: monospace; }
    .scheme-cell { color: rgba(255,255,255,0.8); }
    .amount-cell { font-weight: 700; color: #4ade80; }
    .date-cell { color: rgba(255,255,255,0.35); font-size: 12px; }

    .empty-state {
      padding: 40px; text-align: center;
    }
    .empty-icon {
      width: 52px; height: 52px; border-radius: 14px; background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.2); display: flex; align-items: center; justify-content: center;
      margin: 0 auto 12px;
    }
    .empty-icon .material-icons { font-size: 24px; color: rgba(255,255,255,0.2); }
    .empty-state p { color: rgba(255,255,255,0.35); font-size: 14px; margin: 0 0 10px; }
    .empty-state a { color: #818cf8; font-size: 13px; font-weight: 600; text-decoration: none; }
    .empty-state a:hover { color: #a5b4fc; }

    @media (max-width: 1200px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .tables-row { grid-template-columns: 1fr; } }
  `]
})
export class CitizenDashboardComponent implements OnInit {
  enrollments: any[] = [];
  claims: any[] = [];
  payments: any[] = [];
  pendingClaims = 0;
  totalDisbursed = 0;
  summaryCards: any[] = [];

  constructor(
    private enrollmentSvc: EnrollmentService,
    private claimSvc: ClaimService,
    private disbursementSvc: DisbursementService,
    private paymentSvc: PaymentService
  ) {}

  ngOnInit() {
    this.refreshCards();
    this.enrollmentSvc.getMy().subscribe(r => {
      if (r.data) { this.enrollments = r.data; this.refreshCards(); }
    });
    this.claimSvc.getMy().subscribe(r => {
      if (r.data) {
        this.claims = r.data;
        this.pendingClaims = r.data.filter((c: any) => c.status === 'PENDING').length;
        this.refreshCards();
      }
    });
    this.disbursementSvc.getMy().subscribe(r => {
      if (r.data) {
        this.totalDisbursed = r.data.reduce((s: number, d: any) => s + (d.amount || 0), 0);
        this.refreshCards();
      }
    });
    this.paymentSvc.getMy().subscribe(r => {
      if (r.data) { this.payments = r.data; this.refreshCards(); }
    });
  }

  refreshCards() {
    const fmt = (n: number) => n >= 100000
      ? '₹' + (n / 100000).toFixed(1) + 'L'
      : n >= 1000
      ? '₹' + (n / 1000).toFixed(1) + 'K'
      : '₹' + n;

    this.summaryCards = [
      {
        label: 'Total Enrollments',
        value: this.enrollments.length,
        icon: 'assignment',
        grad: 'linear-gradient(135deg,#6366f1,#4f46e5)',
        glow: '#6366f1',
      },
      {
        label: 'Pending Claims',
        value: this.pendingClaims,
        icon: 'hourglass_top',
        grad: 'linear-gradient(135deg,#f59e0b,#d97706)',
        glow: '#f59e0b',
      },
      {
        label: 'Total Disbursed',
        value: this.totalDisbursed > 0 ? fmt(this.totalDisbursed) : '₹0',
        icon: 'account_balance_wallet',
        grad: 'linear-gradient(135deg,#059669,#10b981)',
        glow: '#10b981',
      },
      {
        label: 'Payments Received',
        value: this.payments.length,
        icon: 'payments',
        grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
        glow: '#8b5cf6',
      },
    ];
  }
}
