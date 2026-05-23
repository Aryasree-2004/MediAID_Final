import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuditManagementService } from '../../core/services/audit.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-formal-audit-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatExpansionModule, MatProgressSpinnerModule, StatusBadgeComponent],
  template: `
    <div class="page-header">
      <h2 class="page-title">Formal Audit Management</h2>
      <p class="page-sub">Create, track and update formal compliance audits</p>
    </div>

    <mat-tab-group>
      <mat-tab label="All Audits">
        <div class="tab-content">
          <div class="section-card">
            <div class="toolbar">
              <div class="filters">
                <mat-form-field appearance="outline" class="filter-field">
                  <mat-label>Status</mat-label>
                  <mat-select [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
                    <mat-option value="">All</mat-option>
                    <mat-option value="PLANNED">Planned</mat-option>
                    <mat-option value="IN_PROGRESS">In Progress</mat-option>
                    <mat-option value="COMPLETED">Completed</mat-option>
                    <mat-option value="ESCALATED">Escalated</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline" class="filter-field">
                  <mat-label>Scope</mat-label>
                  <mat-select [(ngModel)]="filterScope" (ngModelChange)="applyFilter()">
                    <mat-option value="">All</mat-option>
                    <mat-option value="CLAIM">Claim</mat-option>
                    <mat-option value="POLICY">Policy</mat-option>
                    <mat-option value="DISBURSEMENT">Disbursement</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              <button class="btn-new" (click)="showCreateForm=!showCreateForm">
                <mat-icon>add</mat-icon> New Audit
              </button>
            </div>

            <form *ngIf="showCreateForm" [formGroup]="auditForm" (ngSubmit)="createAudit()" class="audit-form">
              <mat-form-field appearance="outline"><mat-label>Officer ID</mat-label><input matInput formControlName="officerId" type="number"><mat-error>Required</mat-error></mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Scope</mat-label>
                <mat-select formControlName="scope">
                  <mat-option value="CLAIM">Claim</mat-option>
                  <mat-option value="POLICY">Policy</mat-option>
                  <mat-option value="DISBURSEMENT">Disbursement</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Scope Entity ID</mat-label><input matInput formControlName="scopeEntityId" type="number"><mat-error>Required</mat-error></mat-form-field>
              <mat-form-field appearance="outline" style="width:280px"><mat-label>Findings (optional)</mat-label><textarea matInput formControlName="findings" rows="2"></textarea></mat-form-field>
              <div class="form-btns">
                <button class="btn-submit" type="submit">Create Audit</button>
                <button class="btn-cancel" type="button" (click)="showCreateForm=false">Cancel</button>
              </div>
            </form>

            <div class="center" *ngIf="loading"><mat-spinner diameter="40" color="accent"></mat-spinner></div>

            <mat-accordion *ngIf="!loading && filtered.length" class="audit-accordion">
              <mat-expansion-panel *ngFor="let a of filtered" class="audit-panel">
                <mat-expansion-panel-header>
                  <mat-panel-title class="panel-title">
                    <span class="audit-id">#{{ a.auditId }}</span>
                    <span class="scope-tag">{{ a.scope }}</span>
                  </mat-panel-title>
                  <mat-panel-description>
                    <app-status-badge [status]="a.status"></app-status-badge>
                  </mat-panel-description>
                </mat-expansion-panel-header>
                <div class="audit-detail">
                  <div class="info-grid">
                    <div class="info-item"><span class="label">Officer ID</span><span class="value">{{ a.officerId }}</span></div>
                    <div class="info-item"><span class="label">Entity ID</span><span class="value">{{ a.scopeEntityId }}</span></div>
                    <div class="info-item"><span class="label">Created</span><span class="value date">{{ a.createdAt | date:'dd MMM y' }}</span></div>
                    <div class="info-item full"><span class="label">Findings</span><span class="value">{{ a.findings || '—' }}</span></div>
                  </div>
                  <div class="audit-actions">
                    <mat-form-field appearance="outline" style="width:180px">
                      <mat-label>Update Status</mat-label>
                      <mat-select [(ngModel)]="a._newStatus">
                        <mat-option value="PLANNED">Planned</mat-option>
                        <mat-option value="IN_PROGRESS">In Progress</mat-option>
                        <mat-option value="COMPLETED">Completed</mat-option>
                        <mat-option value="ESCALATED">Escalated</mat-option>
                      </mat-select>
                    </mat-form-field>
                    <button class="btn-update" (click)="updateAudit(a)">
                      <mat-icon>save</mat-icon> Update
                    </button>
                    <button class="btn-compliance" (click)="triggerCompliance(a)">
                      <mat-icon>rule</mat-icon> Trigger Compliance
                    </button>
                  </div>
                </div>
              </mat-expansion-panel>
            </mat-accordion>

            <div class="empty-state" *ngIf="!loading && !filtered.length">
              <mat-icon>fact_check</mat-icon><p>No audits found</p>
            </div>
          </div>
        </div>
      </mat-tab>

      <mat-tab label="Audit Logs">
        <div class="tab-content">
          <div class="section-card">
            <h3 class="section-title">Audit Management Logs</h3>
            <div class="center" *ngIf="logsLoading"><mat-spinner diameter="40" color="accent"></mat-spinner></div>
            <table mat-table [dataSource]="logs" class="data-table" *ngIf="!logsLoading && logs.length">
              <ng-container matColumnDef="logId"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let l" class="id-cell">#{{ l.logId }}</td></ng-container>
              <ng-container matColumnDef="userId"><th mat-header-cell *matHeaderCellDef>User</th><td mat-cell *matCellDef="let l">{{ l.userId }}</td></ng-container>
              <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>Action</th><td mat-cell *matCellDef="let l">{{ l.action }}</td></ng-container>
              <ng-container matColumnDef="resource"><th mat-header-cell *matHeaderCellDef>Resource</th><td mat-cell *matCellDef="let l">{{ l.resource }}</td></ng-container>
              <ng-container matColumnDef="timestamp"><th mat-header-cell *matHeaderCellDef>Time</th><td mat-cell *matCellDef="let l" class="date-cell">{{ l.timestamp | date:'medium' }}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="logCols"></tr>
              <tr mat-row *matRowDef="let row; columns: logCols;"></tr>
            </table>
            <div class="empty-state" *ngIf="!logsLoading && !logs.length">
              <mat-icon>history</mat-icon><p>No logs found</p>
            </div>
          </div>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-title { margin: 0 0 4px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-sub { margin: 0; font-size: 13px; color: rgba(255,255,255,0.4); }

    .tab-content { padding: 20px 0; }
    .section-card { background: linear-gradient(145deg, #111827, #1a2235); border: 1px solid rgba(99,102,241,0.15); border-radius: 14px; padding: 24px; }
    .section-title { margin: 0 0 20px; font-size: 15px; font-weight: 700; color: #f1f5f9; }

    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .filters { display: flex; gap: 12px; }
    .filter-field { width: 180px; }
    .btn-new {
      display: inline-flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
      border: none; border-radius: 10px; padding: 10px 18px;
      font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .btn-new:hover { box-shadow: 0 4px 14px rgba(99,102,241,0.4); transform: translateY(-1px); }
    .btn-new mat-icon { font-size: 17px; height: 17px; width: 17px; }

    .audit-form {
      display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start;
      padding: 16px; background: rgba(99,102,241,0.07);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 10px; margin-bottom: 20px;
    }
    .audit-form mat-form-field { width: 180px; }
    .form-btns { display: flex; gap: 8px; align-items: center; padding-top: 4px; }
    .btn-submit {
      background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
      border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer;
    }
    .btn-cancel {
      background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 16px;
      font-size: 13px; cursor: pointer;
    }

    .center { display: flex; justify-content: center; padding: 40px; }

    .audit-accordion { display: flex; flex-direction: column; gap: 8px; }
    .audit-panel {
      background: rgba(255,255,255,0.02) !important;
      border: 1px solid rgba(99,102,241,0.12) !important;
      border-radius: 10px !important; box-shadow: none !important; color: #f1f5f9 !important;
    }
    .audit-panel:hover { border-color: rgba(99,102,241,0.25) !important; }
    .panel-title { display: flex; align-items: center; gap: 10px; }
    .audit-id { color: #818cf8; font-weight: 700; font-family: monospace; }
    .scope-tag { background: rgba(99,102,241,0.15); color: #a5b4fc; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }

    .audit-detail { padding: 8px 0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-item.full { grid-column: span 2; }
    .label { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 14px; color: rgba(255,255,255,0.8); }
    .value.date { color: rgba(255,255,255,0.4); font-size: 12px; }

    .audit-actions { display: flex; align-items: center; gap: 10px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
    .btn-update {
      display: inline-flex; align-items: center; gap: 5px;
      background: rgba(99,102,241,0.15); color: #818cf8;
      border: 1px solid rgba(99,102,241,0.3); border-radius: 8px;
      padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s;
    }
    .btn-update:hover { background: rgba(99,102,241,0.25); }
    .btn-update mat-icon { font-size: 15px; height: 15px; width: 15px; }
    .btn-compliance {
      display: inline-flex; align-items: center; gap: 5px;
      background: rgba(56,189,248,0.1); color: #38bdf8;
      border: 1px solid rgba(56,189,248,0.25); border-radius: 8px;
      padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s;
    }
    .btn-compliance:hover { background: rgba(56,189,248,0.2); }
    .btn-compliance mat-icon { font-size: 15px; height: 15px; width: 15px; }

    .data-table { width: 100%; }
    .id-cell { color: #818cf8; font-weight: 700; font-family: monospace; }
    .date-cell { color: rgba(255,255,255,0.4); font-size: 12px; }

    .empty-state { display: flex; align-items: center; gap: 10px; justify-content: center; padding: 40px; color: rgba(255,255,255,0.25); }
    .empty-state mat-icon { font-size: 24px; }
    .empty-state p { margin: 0; font-size: 14px; }
  `]
})
export class FormalAuditManagementComponent implements OnInit {
  audits: any[] = [];
  filtered: any[] = [];
  logs: any[] = [];
  loading = true;
  logsLoading = true;
  showCreateForm = false;
  filterStatus = '';
  filterScope = '';
  logCols = ['logId', 'userId', 'action', 'resource', 'timestamp'];

  private fb = inject(FormBuilder);
  auditForm = this.fb.group({
    officerId: [null, Validators.required],
    scope: ['CLAIM', Validators.required],
    scopeEntityId: [null, Validators.required],
    findings: ['']
  });

  constructor(private auditMgmtSvc: AuditManagementService, private toastr: ToastrService) {}

  ngOnInit() {
    this.auditMgmtSvc.getAllAudits().subscribe({
      next: r => { this.loading = false; if (r.data) { this.audits = r.data.map((a: any) => ({ ...a, _newStatus: a.status })); this.applyFilter(); } },
      error: () => { this.loading = false; }
    });
    this.auditMgmtSvc.getLogs().subscribe({
      next: r => { this.logsLoading = false; if (r.data) this.logs = r.data; },
      error: () => { this.logsLoading = false; }
    });
  }

  applyFilter() {
    this.filtered = this.audits.filter(a =>
      (!this.filterStatus || a.status === this.filterStatus) &&
      (!this.filterScope || a.scope === this.filterScope)
    );
  }

  createAudit() {
    if (this.auditForm.invalid) { this.auditForm.markAllAsTouched(); return; }
    this.auditMgmtSvc.createAudit(this.auditForm.value as any).subscribe({
      next: r => {
        this.audits.unshift({ ...r.data, _newStatus: r.data.status });
        this.applyFilter();
        this.showCreateForm = false;
        this.auditForm.reset({ scope: 'CLAIM' });
        this.toastr.success('Audit created!');
      }
    });
  }

  updateAudit(a: any) {
    this.auditMgmtSvc.updateAudit(a.auditId, { status: a._newStatus }).subscribe({
      next: r => { a.status = r.data.status; this.applyFilter(); this.toastr.success('Audit updated.'); }
    });
  }

  triggerCompliance(a: any) {
    this.auditMgmtSvc.triggerCompliance(a.auditId).subscribe({
      next: () => { this.toastr.success('Compliance triggered for audit.'); }
    });
  }
}
