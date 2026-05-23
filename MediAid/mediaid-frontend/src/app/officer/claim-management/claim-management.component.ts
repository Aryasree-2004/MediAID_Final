import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastrService } from 'ngx-toastr';
import { ClaimService } from '../../core/services/claim.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-claim-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule, MatDialogModule, MatExpansionModule, StatusBadgeComponent],
  template: `
    <div class="page-header">
      <div>
        <h2 class="page-title">Claim Management</h2>
        <p class="page-sub">Review and process citizen claim submissions</p>
      </div>
    </div>

    <div class="toolbar-card">
      <div class="toolbar">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Filter by Status</mat-label>
          <mat-select [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
            <mat-option value="">All</mat-option>
            <mat-option value="PENDING">Pending</mat-option>
            <mat-option value="APPROVED">Approved</mat-option>
            <mat-option value="REJECTED">Rejected</mat-option>
          </mat-select>
        </mat-form-field>
        <span class="count-badge">{{ filtered.length }} claim(s)</span>
      </div>
    </div>

    <div class="center" *ngIf="loading">
      <mat-spinner diameter="40" color="accent"></mat-spinner>
    </div>

    <mat-accordion *ngIf="!loading && filtered.length" class="claims-accordion">
      <mat-expansion-panel *ngFor="let c of filtered" class="claim-panel">
        <mat-expansion-panel-header>
          <mat-panel-title class="panel-title">
            <span class="claim-id">#{{ c.claimId }}</span>
            <span class="claim-amount">₹{{ c.claimAmount | number:'1.0-0' }}</span>
          </mat-panel-title>
          <mat-panel-description>
            <app-status-badge [status]="c.status"></app-status-badge>
          </mat-panel-description>
        </mat-expansion-panel-header>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Citizen ID</span>
            <span class="value">{{ c.citizenId }}</span>
          </div>
          <div class="info-item">
            <span class="label">Scheme ID</span>
            <span class="value">{{ c.schemeId }}</span>
          </div>
          <div class="info-item">
            <span class="label">Date Filed</span>
            <span class="value">{{ c.claimDate | date:'dd MMM y' }}</span>
          </div>
          <div class="info-item">
            <span class="label">Amount</span>
            <span class="value amount">₹{{ c.claimAmount | number:'1.0-2' }}</span>
          </div>
          <div class="info-item full">
            <span class="label">Description</span>
            <span class="value">{{ c.description || '—' }}</span>
          </div>
        </div>
        <div class="action-bar" *ngIf="c.status === 'PENDING'">
          <button class="btn-approve" (click)="updateStatus(c, 'APPROVED')">
            <mat-icon>check_circle</mat-icon> Approve
          </button>
          <button class="btn-reject" (click)="updateStatus(c, 'REJECTED')">
            <mat-icon>cancel</mat-icon> Reject
          </button>
        </div>
      </mat-expansion-panel>
    </mat-accordion>

    <div class="empty-state" *ngIf="!loading && !filtered.length">
      <div class="empty-icon"><mat-icon>receipt_long</mat-icon></div>
      <p>No claims found</p>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-title { margin: 0 0 4px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-sub { margin: 0; font-size: 13px; color: rgba(255,255,255,0.4); }

    .toolbar-card {
      background: linear-gradient(145deg, #111827, #1a2235);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 14px;
      padding: 16px 20px; margin-bottom: 20px;
    }
    .toolbar { display: flex; align-items: center; gap: 16px; }
    .filter-field { width: 200px; }
    .count-badge {
      background: rgba(99,102,241,0.15); color: #818cf8;
      padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;
    }

    .center { display: flex; justify-content: center; padding: 48px; }

    .claims-accordion { display: flex; flex-direction: column; gap: 8px; }
    .claim-panel {
      background: linear-gradient(145deg, #111827, #1a2235) !important;
      border: 1px solid rgba(99,102,241,0.15) !important;
      border-radius: 12px !important;
      box-shadow: none !important;
      color: #f1f5f9 !important;
    }
    .claim-panel:hover { border-color: rgba(99,102,241,0.3) !important; }
    .panel-title { display: flex; align-items: center; gap: 12px; }
    .claim-id { color: #818cf8; font-weight: 700; font-family: monospace; font-size: 14px; }
    .claim-amount { font-weight: 700; color: #4ade80; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 8px 0 16px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-item.full { grid-column: span 2; }
    .label { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 14px; color: rgba(255,255,255,0.8); }
    .value.amount { color: #4ade80; font-weight: 700; }

    .action-bar { display: flex; gap: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06); }
    .btn-approve {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(52,211,153,0.15); color: #34d399;
      border: 1px solid rgba(52,211,153,0.3); border-radius: 8px;
      padding: 8px 16px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s;
    }
    .btn-approve:hover { background: rgba(52,211,153,0.25); }
    .btn-approve mat-icon { font-size: 16px; height: 16px; width: 16px; }
    .btn-reject {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(248,113,113,0.15); color: #f87171;
      border: 1px solid rgba(248,113,113,0.3); border-radius: 8px;
      padding: 8px 16px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s;
    }
    .btn-reject:hover { background: rgba(248,113,113,0.25); }
    .btn-reject mat-icon { font-size: 16px; height: 16px; width: 16px; }

    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-icon {
      width: 56px; height: 56px; background: rgba(99,102,241,0.1);
      border: 1px solid rgba(99,102,241,0.2); border-radius: 14px;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
    }
    .empty-icon mat-icon { font-size: 28px; color: rgba(255,255,255,0.2); }
    .empty-state p { color: rgba(255,255,255,0.35); font-size: 15px; margin: 0; }
  `]
})
export class ClaimManagementComponent implements OnInit {
  claims: any[] = [];
  filtered: any[] = [];
  filterStatus = '';
  loading = true;

  constructor(private claimSvc: ClaimService, private toastr: ToastrService, private dialog: MatDialog) {}

  ngOnInit() {
    this.claimSvc.getAll().subscribe({
      next: r => { this.loading = false; if (r.data) { this.claims = r.data; this.applyFilter(); } },
      error: () => { this.loading = false; }
    });
  }

  applyFilter() {
    this.filtered = this.filterStatus ? this.claims.filter(c => c.status === this.filterStatus) : this.claims;
  }

  updateStatus(c: any, status: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: `${status} Claim`, message: `${status} claim #${c.claimId}?` }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.claimSvc.updateStatus(c.claimId, { status }).subscribe({
        next: r => { c.status = r.data.status; this.applyFilter(); this.toastr.success(`Claim ${status.toLowerCase()}.`); }
      });
    });
  }
}
