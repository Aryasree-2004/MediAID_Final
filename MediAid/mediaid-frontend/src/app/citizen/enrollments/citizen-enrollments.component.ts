import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { SchemeService } from '../../core/services/scheme.service';
import { CitizenService } from '../../core/services/citizen.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-citizen-enrollments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule, StatusBadgeComponent],
  template: `
    <h2 class="page-title">My Enrollments</h2>

    <!-- No Profile Banner -->
    <div class="no-profile-banner" *ngIf="!profileLoading && !hasProfile">
      <mat-icon>account_circle</mat-icon>
      <div>
        <strong>Profile Required</strong>
        <p>You need to create your citizen profile before you can enroll in schemes.</p>
      </div>
      <a mat-flat-button color="primary" routerLink="/citizen/profile">Create Profile</a>
    </div>

    <!-- Pending Approval Banner -->
    <div class="pending-banner" *ngIf="!profileLoading && hasProfile && citizenStatus === 'PENDING'">
      <mat-icon>hourglass_top</mat-icon>
      <div>
        <strong>Profile Pending Approval</strong>
        <p>Your citizen profile is awaiting officer verification. You can enroll in schemes once your profile is approved.</p>
      </div>
    </div>

    <!-- Rejected Banner -->
    <div class="rejected-banner" *ngIf="!profileLoading && hasProfile && citizenStatus === 'REJECTED'">
      <mat-icon>cancel</mat-icon>
      <div>
        <strong>Profile Rejected</strong>
        <p>Your citizen profile was rejected. Please update your profile and contact support.</p>
      </div>
      <a mat-flat-button color="warn" routerLink="/citizen/profile">Update Profile</a>
    </div>

    <mat-card class="page-card" *ngIf="!profileLoading && hasProfile && citizenStatus === 'VERIFIED'">
      <div class="toolbar">
        <span>{{ enrollments.length }} enrollment(s)</span>
        <button mat-flat-button color="primary" (click)="openEnrollDialog()">
          <mat-icon>add</mat-icon> Enroll in Scheme
        </button>
      </div>
      <div class="center" *ngIf="loading"><mat-spinner diameter="40"></mat-spinner></div>
      <table mat-table [dataSource]="enrollments" class="full-width" *ngIf="!loading && enrollments.length">
        <ng-container matColumnDef="enrollmentId">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let e">{{ e.enrollmentId }}</td>
        </ng-container>
        <ng-container matColumnDef="schemeId">
          <th mat-header-cell *matHeaderCellDef>Scheme</th>
          <td mat-cell *matCellDef="let e">{{ schemeName(e.schemeId) }}</td>
        </ng-container>
        <ng-container matColumnDef="enrollmentDate">
          <th mat-header-cell *matHeaderCellDef>Enrolled On</th>
          <td mat-cell *matCellDef="let e">{{ e.enrollmentDate | date:'mediumDate' }}</td>
        </ng-container>
        <ng-container matColumnDef="expiryDate">
          <th mat-header-cell *matHeaderCellDef>Expires</th>
          <td mat-cell *matCellDef="let e">{{ e.expiryDate | date:'mediumDate' }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let e"><app-status-badge [status]="e.status"></app-status-badge></td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>
      <p *ngIf="!loading && !enrollments.length" class="empty">No enrollments yet.</p>
    </mat-card>
    <div class="center" *ngIf="profileLoading"><mat-spinner diameter="40"></mat-spinner></div>

    <div class="dialog-overlay" *ngIf="showDialog">
      <mat-card class="dialog-card">
        <h3>Enroll in a Scheme</h3>
        <form [formGroup]="enrollForm" (ngSubmit)="submitEnroll()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Select Scheme</mat-label>
            <mat-select formControlName="schemeId">
              <mat-option *ngIf="schemesLoading" disabled>Loading schemes...</mat-option>
              <mat-option *ngIf="!schemesLoading && schemes.length === 0" disabled>No active schemes available</mat-option>
              <mat-option *ngFor="let s of schemes" [value]="s.schemeId">{{ s.name }}</mat-option>
            </mat-select>
            <mat-error>Please select a scheme</mat-error>
          </mat-form-field>
          <div class="dialog-actions">
            <button mat-button type="button" (click)="showDialog=false">Cancel</button>
            <button mat-flat-button color="primary" type="submit" [disabled]="schemes.length === 0">Enroll</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-title { margin: 0 0 20px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-card { padding: 24px; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .toolbar span { color: rgba(255,255,255,0.5); font-size: 13px; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .full-width { width: 100%; }
    .empty { color: rgba(255,255,255,0.3); padding: 20px 0; font-size: 14px; }
    .dialog-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 200;
      backdrop-filter: blur(4px);
    }
    .dialog-card { width: 420px; padding: 28px; }
    .dialog-card h3 { margin: 0 0 20px; color: #f1f5f9; font-size: 1.1rem; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
    .no-profile-banner {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
      background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.08));
      border: 1px solid rgba(245,158,11,0.35); border-radius: 14px;
      padding: 24px 28px; margin-bottom: 24px;
    }
    .no-profile-banner mat-icon { font-size: 42px; height: 42px; width: 42px; color: #f59e0b; flex-shrink: 0; }
    .no-profile-banner strong { display: block; color: #fbbf24; font-size: 16px; margin-bottom: 4px; }
    .no-profile-banner p { margin: 0; color: rgba(255,255,255,0.55); font-size: 13px; }
    .no-profile-banner a { margin-left: auto; flex-shrink: 0; }
    .pending-banner {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
      background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(79,70,229,0.08));
      border: 1px solid rgba(99,102,241,0.35); border-radius: 14px;
      padding: 24px 28px; margin-bottom: 24px;
    }
    .pending-banner mat-icon { font-size: 42px; height: 42px; width: 42px; color: #818cf8; flex-shrink: 0; }
    .pending-banner strong { display: block; color: #a5b4fc; font-size: 16px; margin-bottom: 4px; }
    .pending-banner p { margin: 0; color: rgba(255,255,255,0.55); font-size: 13px; }
    .rejected-banner {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
      background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.08));
      border: 1px solid rgba(239,68,68,0.35); border-radius: 14px;
      padding: 24px 28px; margin-bottom: 24px;
    }
    .rejected-banner mat-icon { font-size: 42px; height: 42px; width: 42px; color: #f87171; flex-shrink: 0; }
    .rejected-banner strong { display: block; color: #fca5a5; font-size: 16px; margin-bottom: 4px; }
    .rejected-banner p { margin: 0; color: rgba(255,255,255,0.55); font-size: 13px; }
    .rejected-banner a { margin-left: auto; flex-shrink: 0; }
  `]
})
export class CitizenEnrollmentsComponent implements OnInit {
  enrollments: any[] = [];
  schemes: any[] = [];
  loading = true;
  schemesLoading = true;
  profileLoading = true;
  hasProfile = false;
  citizenStatus = '';
  showDialog = false;
  cols = ['enrollmentId', 'schemeId', 'enrollmentDate', 'expiryDate', 'status'];

  private fb = inject(FormBuilder);
  enrollForm = this.fb.group({ schemeId: [null, Validators.required] });

  constructor(
    private enrollSvc: EnrollmentService,
    private schemeSvc: SchemeService,
    private citizenSvc: CitizenService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const userId = Number(this.auth.getUserId());
    this.citizenSvc.getCitizen(userId).subscribe({
      next: r => {
        this.profileLoading = false;
        this.hasProfile = !!(r.data);
        this.citizenStatus = r.data?.status || '';
        if (this.citizenStatus === 'VERIFIED') { this.load(); this.loadSchemes(); }
      },
      error: () => {
        this.profileLoading = false;
        this.hasProfile = false;
      }
    });
  }

  loadSchemes() {
    this.schemesLoading = true;
    this.schemeSvc.getAll().subscribe({
      next: r => {
        this.schemesLoading = false;
        if (r.data) {
          this.schemes = r.data.filter((s: any) => s.status?.toUpperCase() === 'ACTIVE');
          // If no ACTIVE schemes found, show all schemes as fallback
          if (this.schemes.length === 0) {
            this.schemes = r.data;
          }
        }
      },
      error: () => {
        this.schemesLoading = false;
        this.toastr.error('Failed to load schemes. Please try again.');
      }
    });
  }

  load() {
    this.loading = true;
    this.enrollSvc.getMy().subscribe({
      next: r => { this.loading = false; if (r.data) this.enrollments = r.data; },
      error: () => { this.loading = false; }
    });
  }

  schemeName(id: number) { return this.schemes.find(s => s.schemeId === id)?.name || `Scheme #${id}`; }

  openEnrollDialog() { this.enrollForm.reset(); this.showDialog = true; }

  submitEnroll() {
    if (this.enrollForm.invalid) { this.enrollForm.markAllAsTouched(); return; }
    this.enrollSvc.enroll(this.enrollForm.value as any).subscribe({
      next: () => { this.toastr.success('Enrollment submitted!'); this.showDialog = false; this.load(); }
    });
  }
}
