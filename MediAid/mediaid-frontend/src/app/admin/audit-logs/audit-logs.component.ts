import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuditService, AuditManagementService } from '../../core/services/audit.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatProgressSpinnerModule],
  template: `
    <h2 class="page-title">Audit Logs</h2>
    <mat-tab-group>
      <mat-tab label="Basic Audit Logs">
        <div class="tab-content">
          <mat-card>
            <div class="toolbar">
              <mat-form-field appearance="outline">
                <mat-label>Filter by User ID</mat-label>
                <input matInput [(ngModel)]="userIdFilter" type="number" placeholder="Enter user ID">
              </mat-form-field>
              <button mat-flat-button color="primary" (click)="filterByUser()">Filter</button>
              <button mat-button (click)="loadAll()">Clear</button>
              <button mat-stroked-button (click)="exportCSV(basicLogs, 'audit-logs.csv')">
                <mat-icon>download</mat-icon> Export CSV
              </button>
            </div>
            <div class="center" *ngIf="basicLoading"><mat-spinner diameter="40"></mat-spinner></div>
            <table mat-table [dataSource]="basicLogs" class="full-width" *ngIf="!basicLoading && basicLogs.length">
              <ng-container matColumnDef="logId"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let l">{{ l.logId }}</td></ng-container>
              <ng-container matColumnDef="userId"><th mat-header-cell *matHeaderCellDef>User ID</th><td mat-cell *matCellDef="let l">{{ l.userId }}</td></ng-container>
              <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>Action</th><td mat-cell *matCellDef="let l">{{ l.action }}</td></ng-container>
              <ng-container matColumnDef="resource"><th mat-header-cell *matHeaderCellDef>Resource</th><td mat-cell *matCellDef="let l">{{ l.resource }}</td></ng-container>
              <ng-container matColumnDef="timestamp"><th mat-header-cell *matHeaderCellDef>Timestamp</th><td mat-cell *matCellDef="let l">{{ l.timestamp | date:'medium' }}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="basicCols"></tr>
              <tr mat-row *matRowDef="let row; columns: basicCols;"></tr>
            </table>
            <p *ngIf="!basicLoading && !basicLogs.length" class="empty">No audit logs found.</p>
          </mat-card>
        </div>
      </mat-tab>
      <mat-tab label="Audit Management Logs">
        <div class="tab-content">
          <mat-card>
            <div class="toolbar">
              <mat-form-field appearance="outline">
                <mat-label>Filter by Action</mat-label>
                <input matInput [(ngModel)]="actionFilter" placeholder="e.g. CREATE, UPDATE">
              </mat-form-field>
              <button mat-flat-button color="primary" (click)="filterByAction()">Filter</button>
              <button mat-button (click)="loadMgmtLogs()">Clear</button>
              <button mat-stroked-button (click)="exportCSV(mgmtLogs, 'audit-mgmt-logs.csv')">
                <mat-icon>download</mat-icon> Export CSV
              </button>
            </div>
            <div class="center" *ngIf="mgmtLoading"><mat-spinner diameter="40"></mat-spinner></div>
            <table mat-table [dataSource]="mgmtLogs" class="full-width" *ngIf="!mgmtLoading && mgmtLogs.length">
              <ng-container matColumnDef="logId"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let l">{{ l.logId }}</td></ng-container>
              <ng-container matColumnDef="userId"><th mat-header-cell *matHeaderCellDef>User ID</th><td mat-cell *matCellDef="let l">{{ l.userId }}</td></ng-container>
              <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>Action</th><td mat-cell *matCellDef="let l">{{ l.action }}</td></ng-container>
              <ng-container matColumnDef="resource"><th mat-header-cell *matHeaderCellDef>Resource</th><td mat-cell *matCellDef="let l">{{ l.resource }}</td></ng-container>
              <ng-container matColumnDef="details"><th mat-header-cell *matHeaderCellDef>Details</th><td mat-cell *matCellDef="let l">{{ l.details }}</td></ng-container>
              <ng-container matColumnDef="timestamp"><th mat-header-cell *matHeaderCellDef>Timestamp</th><td mat-cell *matCellDef="let l">{{ l.timestamp | date:'medium' }}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="mgmtCols"></tr>
              <tr mat-row *matRowDef="let row; columns: mgmtCols;"></tr>
            </table>
            <p *ngIf="!mgmtLoading && !mgmtLogs.length" class="empty">No audit management logs found.</p>
          </mat-card>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    .page-title { margin: 0 0 20px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .tab-content { padding: 16px 0; }
    mat-card { padding: 24px; }
    .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
    .toolbar mat-form-field { width: 220px; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .full-width { width: 100%; }
    .empty { color: rgba(255,255,255,0.3); padding: 20px 0; font-size: 14px; }
  `]
})
export class AuditLogsComponent implements OnInit {
  basicLogs: any[] = [];
  mgmtLogs: any[] = [];
  basicLoading = true;
  mgmtLoading = true;
  userIdFilter: number | null = null;
  actionFilter = '';
  basicCols = ['logId', 'userId', 'action', 'resource', 'timestamp'];
  mgmtCols = ['logId', 'userId', 'action', 'resource', 'details', 'timestamp'];

  constructor(private auditSvc: AuditService, private auditMgmtSvc: AuditManagementService) {}

  ngOnInit() { this.loadAll(); this.loadMgmtLogs(); }

  loadAll() {
    this.basicLoading = true;
    this.auditSvc.getAll().subscribe({
      next: r => { this.basicLoading = false; if (r.data) this.basicLogs = r.data; },
      error: () => { this.basicLoading = false; }
    });
  }

  loadMgmtLogs() {
    this.mgmtLoading = true;
    this.auditMgmtSvc.getLogs().subscribe({
      next: r => { this.mgmtLoading = false; if (r.data) this.mgmtLogs = r.data; },
      error: () => { this.mgmtLoading = false; }
    });
  }

  filterByUser() {
    if (!this.userIdFilter) { this.loadAll(); return; }
    this.basicLoading = true;
    this.auditSvc.getByUser(this.userIdFilter).subscribe({
      next: r => { this.basicLoading = false; if (r.data) this.basicLogs = r.data; },
      error: () => { this.basicLoading = false; }
    });
  }

  filterByAction() {
    if (!this.actionFilter) { this.loadMgmtLogs(); return; }
    this.mgmtLoading = true;
    this.auditMgmtSvc.getLogsByAction(this.actionFilter).subscribe({
      next: r => { this.mgmtLoading = false; if (r.data) this.mgmtLogs = r.data; },
      error: () => { this.mgmtLoading = false; }
    });
  }

  exportCSV(data: any[], filename: string) {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
}
