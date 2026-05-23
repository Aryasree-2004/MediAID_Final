import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { ComplianceService } from '../../core/services/compliance.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-compliance-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatProgressSpinnerModule, StatusBadgeComponent],
  template: `
    <div class="page-header">
      <h2 class="page-title">Compliance Management</h2>
      <p class="page-sub">Monitor compliance records, violations, and trigger evaluations</p>
    </div>

    <mat-tab-group>
      <mat-tab label="All Records">
        <div class="tab-content"><ng-container *ngTemplateOutlet="table; context:{data: all}"></ng-container></div>
      </mat-tab>
      <mat-tab label="Violations">
        <div class="tab-content"><ng-container *ngTemplateOutlet="table; context:{data: violations}"></ng-container></div>
      </mat-tab>
      <mat-tab label="Flagged">
        <div class="tab-content"><ng-container *ngTemplateOutlet="table; context:{data: flagged}"></ng-container></div>
      </mat-tab>
      <mat-tab label="Full Evaluation">
        <div class="tab-content">
          <div class="section-card">
            <h3 class="section-title">Full Compliance Evaluation</h3>
            <form [formGroup]="evalForm" (ngSubmit)="evaluateFull()" class="eval-form">
              <mat-form-field appearance="outline"><mat-label>Entity ID</mat-label><input matInput formControlName="entityId" type="number"><mat-error>Required</mat-error></mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Entity Type</mat-label>
                <mat-select formControlName="entityType">
                  <mat-option value="CLAIM">Claim</mat-option>
                  <mat-option value="ENROLLMENT">Enrollment</mat-option>
                  <mat-option value="DISBURSEMENT">Disbursement</mat-option>
                </mat-select>
              </mat-form-field>
              <button class="btn-evaluate" type="submit"><mat-icon>rule</mat-icon> Evaluate</button>
            </form>
            <div *ngIf="evalResult" class="eval-result">
              <h4>Evaluation Result</h4>
              <pre>{{ evalResult | json }}</pre>
            </div>
          </div>
        </div>
      </mat-tab>
      <mat-tab label="Create Record">
        <div class="tab-content">
          <div class="section-card">
            <h3 class="section-title">Create Compliance Record</h3>
            <form [formGroup]="recordForm" (ngSubmit)="createRecord()" class="eval-form">
              <mat-form-field appearance="outline"><mat-label>Entity ID</mat-label><input matInput formControlName="entityId" type="number"><mat-error>Required</mat-error></mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Entity Type</mat-label>
                <mat-select formControlName="entityType">
                  <mat-option value="CLAIM">Claim</mat-option>
                  <mat-option value="ENROLLMENT">Enrollment</mat-option>
                  <mat-option value="DISBURSEMENT">Disbursement</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Result</mat-label>
                <mat-select formControlName="result">
                  <mat-option value="PASS">Pass</mat-option>
                  <mat-option value="FAIL">Fail</mat-option>
                  <mat-option value="FLAGGED">Flagged</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" style="width:300px"><mat-label>Notes</mat-label><textarea matInput formControlName="notes" rows="2"></textarea></mat-form-field>
              <button class="btn-evaluate" type="submit"><mat-icon>save</mat-icon> Save Record</button>
            </form>
          </div>
        </div>
      </mat-tab>
    </mat-tab-group>

    <ng-template #table let-data="data">
      <div class="section-card">
        <div class="center" *ngIf="loading"><mat-spinner diameter="40" color="accent"></mat-spinner></div>
        <table mat-table [dataSource]="data" class="data-table" *ngIf="!loading && data.length">
          <ng-container matColumnDef="complianceId"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let r" class="id-cell">#{{ r.complianceId }}</td></ng-container>
          <ng-container matColumnDef="entityId"><th mat-header-cell *matHeaderCellDef>Entity</th><td mat-cell *matCellDef="let r">{{ r.entityId }}</td></ng-container>
          <ng-container matColumnDef="entityType"><th mat-header-cell *matHeaderCellDef>Type</th><td mat-cell *matCellDef="let r">{{ r.entityType }}</td></ng-container>
          <ng-container matColumnDef="result"><th mat-header-cell *matHeaderCellDef>Result</th><td mat-cell *matCellDef="let r"><app-status-badge [status]="r.result"></app-status-badge></td></ng-container>
          <ng-container matColumnDef="notes"><th mat-header-cell *matHeaderCellDef>Notes</th><td mat-cell *matCellDef="let r">{{ r.notes }}</td></ng-container>
          <ng-container matColumnDef="evaluatedAt"><th mat-header-cell *matHeaderCellDef>Evaluated</th><td mat-cell *matCellDef="let r" class="date-cell">{{ r.evaluatedAt | date:'dd MMM y' }}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
        <div class="empty-state" *ngIf="!loading && !data.length">
          <mat-icon>rule</mat-icon><p>No records found</p>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-title { margin: 0 0 4px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-sub { margin: 0; font-size: 13px; color: rgba(255,255,255,0.4); }

    .tab-content { padding: 20px 0; }
    .section-card { background: linear-gradient(145deg, #111827, #1a2235); border: 1px solid rgba(99,102,241,0.15); border-radius: 14px; padding: 24px; }
    .section-title { margin: 0 0 20px; font-size: 15px; font-weight: 700; color: #f1f5f9; }

    .center { display: flex; justify-content: center; padding: 40px; }
    .data-table { width: 100%; }
    .id-cell { color: #818cf8; font-weight: 700; font-family: monospace; }
    .date-cell { color: rgba(255,255,255,0.4); font-size: 12px; }

    .eval-form { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
    .eval-form mat-form-field { width: 200px; }
    .btn-evaluate {
      display: inline-flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
      border: none; border-radius: 10px; padding: 12px 20px;
      font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; margin-top: 4px;
    }
    .btn-evaluate:hover { box-shadow: 0 4px 14px rgba(99,102,241,0.4); }
    .btn-evaluate mat-icon { font-size: 17px; height: 17px; width: 17px; }

    .eval-result {
      margin-top: 20px; padding: 16px;
      background: rgba(99,102,241,0.08); border: 1px solid rgba(99,102,241,0.2); border-radius: 10px;
    }
    .eval-result h4 { margin: 0 0 10px; color: #818cf8; font-size: 13px; text-transform: uppercase; }
    .eval-result pre { margin: 0; font-size: 12px; color: rgba(255,255,255,0.7); white-space: pre-wrap; }

    .empty-state { display: flex; align-items: center; gap: 10px; justify-content: center; padding: 40px; color: rgba(255,255,255,0.25); }
    .empty-state mat-icon { font-size: 24px; }
    .empty-state p { margin: 0; font-size: 14px; }
  `]
})
export class ComplianceManagementComponent implements OnInit {
  all: any[] = []; violations: any[] = []; flagged: any[] = [];
  loading = true;
  evalResult: any = null;
  cols = ['complianceId', 'entityId', 'entityType', 'result', 'notes', 'evaluatedAt'];

  private fb = inject(FormBuilder);
  // requestedBy removed from form — auto-sourced from JWT for the evaluate endpoint
  evalForm = this.fb.group({ entityId: [null, Validators.required], entityType: ['CLAIM'] });
  recordForm = this.fb.group({ entityId: [null, Validators.required], entityType: ['CLAIM'], result: ['PASS'], notes: [''] });

  constructor(private complianceSvc: ComplianceService, private authSvc: AuthService, private toastr: ToastrService) {}

  ngOnInit() {
    this.complianceSvc.getAll().subscribe({ next: r => { this.loading = false; if (r.data) this.all = r.data; }, error: () => { this.loading = false; } });
    this.complianceSvc.getViolations().subscribe(r => { if (r.data) this.violations = r.data; });
    this.complianceSvc.getFlagged().subscribe(r => { if (r.data) this.flagged = r.data; });
  }

  evaluateFull() {
    if (this.evalForm.invalid) { this.evalForm.markAllAsTouched(); return; }
    // Include requestedBy as userId (number) in the request body
    const payload = { ...this.evalForm.value, requestedBy: Number(this.authSvc.getUserId()) };
    this.complianceSvc.evaluateFull(payload as any).subscribe({
      next: r => { this.evalResult = r.data; this.toastr.success('Evaluation complete.'); }
    });
  }

  createRecord() {
    if (this.recordForm.invalid) { this.recordForm.markAllAsTouched(); return; }
    this.complianceSvc.createRecord(this.recordForm.value as any).subscribe({
      next: r => { this.all.unshift(r.data); this.toastr.success('Record created.'); this.recordForm.reset({ entityType: 'CLAIM', result: 'PASS' }); }
    });
  }
}
