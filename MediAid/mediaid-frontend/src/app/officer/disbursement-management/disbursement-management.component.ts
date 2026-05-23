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
import { DisbursementService } from '../../core/services/disbursement.service';
import { PaymentService } from '../../core/services/payment.service';
import { SchemeService } from '../../core/services/scheme.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-disbursement-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatProgressSpinnerModule, StatusBadgeComponent],
  template: `
    <div class="page-header">
      <h2 class="page-title">Disbursement & Payment Management</h2>
      <p class="page-sub">Process disbursements and manage payment records</p>
    </div>

    <mat-tab-group>
      <!-- Disbursements Tab -->
      <mat-tab label="Disbursements">
        <div class="tab-content">
          <div class="section-card">
            <div class="toolbar">
              <h3 class="section-title">All Disbursements</h3>
              <button class="btn-new" (click)="showDisbForm=!showDisbForm">
                <mat-icon>add</mat-icon> New Disbursement
              </button>
            </div>
            <form *ngIf="showDisbForm" [formGroup]="disbForm" (ngSubmit)="createDisbursement()" class="inline-form">
              <mat-form-field appearance="outline"><mat-label>Claim ID</mat-label><input matInput formControlName="claimId" type="number"><mat-error>Required</mat-error></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Citizen ID</mat-label><input matInput formControlName="citizenId" type="number"><mat-error>Required</mat-error></mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Scheme</mat-label>
                <mat-select formControlName="schemeId">
                  <mat-option *ngFor="let s of schemes" [value]="s.schemeId">{{ s.name }}</mat-option>
                </mat-select>
                <mat-error>Required</mat-error>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Amount (₹)</mat-label><input matInput formControlName="amount" type="number"><mat-error>Required</mat-error></mat-form-field>
              <div class="form-btns">
                <button class="btn-submit" type="submit">Create</button>
                <button class="btn-cancel" type="button" (click)="showDisbForm=false">Cancel</button>
              </div>
            </form>
            <div class="center" *ngIf="disbLoading"><mat-spinner diameter="40" color="accent"></mat-spinner></div>
            <table mat-table [dataSource]="disbursements" class="data-table" *ngIf="!disbLoading && disbursements.length">
              <ng-container matColumnDef="disbursementId"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let d" class="id-cell">#{{ d.disbursementId }}</td></ng-container>
              <ng-container matColumnDef="claimId"><th mat-header-cell *matHeaderCellDef>Claim</th><td mat-cell *matCellDef="let d">#{{ d.claimId }}</td></ng-container>
              <ng-container matColumnDef="citizenId"><th mat-header-cell *matHeaderCellDef>Citizen</th><td mat-cell *matCellDef="let d">{{ d.citizenId }}</td></ng-container>
              <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Amount</th><td mat-cell *matCellDef="let d" class="amount-cell">₹{{ d.amount | number:'1.0-2' }}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let d"><app-status-badge [status]="d.status"></app-status-badge></td></ng-container>
              <tr mat-header-row *matHeaderRowDef="disbCols"></tr>
              <tr mat-row *matRowDef="let row; columns: disbCols;"></tr>
            </table>
            <div class="empty-state" *ngIf="!disbLoading && !disbursements.length">
              <mat-icon>account_balance_wallet</mat-icon>
              <p>No disbursements found</p>
            </div>
          </div>
        </div>
      </mat-tab>

      <!-- Payments Tab -->
      <mat-tab label="Payments">
        <div class="tab-content">
          <div class="section-card">
            <div class="toolbar">
              <h3 class="section-title">All Payments</h3>
              <button class="btn-new" (click)="showPayForm=!showPayForm">
                <mat-icon>add</mat-icon> Process Payment
              </button>
            </div>
            <form *ngIf="showPayForm" [formGroup]="payForm" (ngSubmit)="createPayment()" class="inline-form">
              <mat-form-field appearance="outline"><mat-label>Disbursement ID</mat-label><input matInput formControlName="disbursementId" type="number"><mat-error>Required</mat-error></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>Amount (₹)</mat-label><input matInput formControlName="amount" type="number"><mat-error>Required</mat-error></mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Method</mat-label>
                <mat-select formControlName="method">
                  <mat-option value="Bank Transfer">Bank Transfer</mat-option>
                  <mat-option value="Credit Card">Credit Card</mat-option>
                  <mat-option value="PayPal">PayPal</mat-option>
                </mat-select>
              </mat-form-field>
              <div class="form-btns">
                <button class="btn-submit" type="submit">Process</button>
                <button class="btn-cancel" type="button" (click)="showPayForm=false">Cancel</button>
              </div>
            </form>
            <div class="center" *ngIf="payLoading"><mat-spinner diameter="40" color="accent"></mat-spinner></div>
            <table mat-table [dataSource]="payments" class="data-table" *ngIf="!payLoading && payments.length">
              <ng-container matColumnDef="paymentId"><th mat-header-cell *matHeaderCellDef>ID</th><td mat-cell *matCellDef="let p" class="id-cell">#{{ p.paymentId }}</td></ng-container>
              <ng-container matColumnDef="disbursementId"><th mat-header-cell *matHeaderCellDef>Disbursement</th><td mat-cell *matCellDef="let p">#{{ p.disbursementId }}</td></ng-container>
              <ng-container matColumnDef="method"><th mat-header-cell *matHeaderCellDef>Method</th><td mat-cell *matCellDef="let p">{{ p.method }}</td></ng-container>
              <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>Amount</th><td mat-cell *matCellDef="let p" class="amount-cell">₹{{ p.amount | number:'1.0-2' }}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let p"><app-status-badge [status]="p.status"></app-status-badge></td></ng-container>
              <tr mat-header-row *matHeaderRowDef="payCols"></tr>
              <tr mat-row *matRowDef="let row; columns: payCols;"></tr>
            </table>
            <div class="empty-state" *ngIf="!payLoading && !payments.length">
              <mat-icon>payments</mat-icon>
              <p>No payments found</p>
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
    .section-card {
      background: linear-gradient(145deg, #111827, #1a2235);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 14px; padding: 24px;
    }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-title { margin: 0; font-size: 16px; font-weight: 700; color: #f1f5f9; }
    .btn-new {
      display: inline-flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
      border: none; border-radius: 10px; padding: 10px 18px;
      font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .btn-new:hover { box-shadow: 0 4px 14px rgba(99,102,241,0.4); transform: translateY(-1px); }
    .btn-new mat-icon { font-size: 17px; height: 17px; width: 17px; }

    .inline-form {
      display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
      padding: 16px; background: rgba(99,102,241,0.07); border-radius: 10px;
      border: 1px solid rgba(99,102,241,0.15); margin-bottom: 20px;
    }
    .inline-form mat-form-field { width: 160px; }
    .form-btns { display: flex; gap: 8px; align-items: center; }
    .btn-submit {
      background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
      border: none; border-radius: 8px; padding: 10px 20px;
      font-size: 13px; font-weight: 700; cursor: pointer;
    }
    .btn-cancel {
      background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 16px;
      font-size: 13px; cursor: pointer;
    }

    .center { display: flex; justify-content: center; padding: 40px; }
    .data-table { width: 100%; }
    .id-cell { color: #818cf8; font-weight: 700; font-family: monospace; }
    .amount-cell { color: #4ade80; font-weight: 700; }

    .empty-state {
      display: flex; align-items: center; gap: 10px; justify-content: center;
      padding: 40px; color: rgba(255,255,255,0.25);
    }
    .empty-state mat-icon { font-size: 24px; }
    .empty-state p { margin: 0; font-size: 14px; }
  `]
})
export class DisbursementManagementComponent implements OnInit {
  disbursements: any[] = [];
  payments: any[] = [];
  schemes: any[] = [];
  disbLoading = true;
  payLoading = true;
  showDisbForm = false;
  showPayForm = false;
  disbCols = ['disbursementId', 'claimId', 'citizenId', 'amount', 'status'];
  payCols = ['paymentId', 'disbursementId', 'method', 'amount', 'status'];

  private fb = inject(FormBuilder);
  disbForm = this.fb.group({ claimId: [null, Validators.required], citizenId: [null, Validators.required], schemeId: [null, Validators.required], amount: [null, Validators.required] });
  payForm = this.fb.group({ disbursementId: [null, Validators.required], amount: [null, Validators.required], method: ['Bank Transfer', Validators.required] });

  constructor(private disbSvc: DisbursementService, private paySvc: PaymentService, private schemeSvc: SchemeService, private toastr: ToastrService) {}

  ngOnInit() {
    this.disbSvc.getAll().subscribe({ next: r => { this.disbLoading = false; if (r.data) this.disbursements = r.data; }, error: () => { this.disbLoading = false; } });
    this.paySvc.getAll().subscribe({ next: r => { this.payLoading = false; if (r.data) this.payments = r.data; }, error: () => { this.payLoading = false; } });
    this.schemeSvc.getAll().subscribe({ next: r => { if (r.data) this.schemes = r.data; } });
  }

  createDisbursement() {
    if (this.disbForm.invalid) { this.disbForm.markAllAsTouched(); return; }
    const payload = {
      ...this.disbForm.value,
      status: 'Pending',
      date: new Date().toISOString().slice(0, 19) // LocalDateTime format: 2026-05-20T10:30:00
    };
    this.disbSvc.create(payload as any).subscribe({
      next: r => { this.disbursements.unshift(r.data); this.showDisbForm = false; this.disbForm.reset(); this.toastr.success('Disbursement created!'); }
    });
  }

  createPayment() {
    if (this.payForm.invalid) { this.payForm.markAllAsTouched(); return; }
    const payload = {
      ...this.payForm.value,
      status: 'Pending',
      date: new Date().toISOString().slice(0, 19)
    };
    this.paySvc.create(payload as any).subscribe({
      next: r => { this.payments.unshift(r.data); this.showPayForm = false; this.payForm.reset({ method: 'Bank Transfer' }); this.toastr.success('Payment processed!'); }
    });
  }
}
