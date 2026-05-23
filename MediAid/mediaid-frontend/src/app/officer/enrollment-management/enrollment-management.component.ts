import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-enrollment-management',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatSelectModule, MatFormFieldModule, MatProgressSpinnerModule, MatDialogModule, StatusBadgeComponent],
  template: `
    <h2 class="page-title">Enrollment Management</h2>
    <mat-card class="page-card">
      <div class="toolbar">
        <mat-form-field appearance="outline">
          <mat-label>Filter by Status</mat-label>
          <mat-select [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
            <mat-option value="">All</mat-option>
            <mat-option value="PENDING">Pending</mat-option>
            <mat-option value="APPROVED">Approved</mat-option>
            <mat-option value="REJECTED">Rejected</mat-option>
            <mat-option value="ACTIVE">Active</mat-option>
          </mat-select>
        </mat-form-field>
        <span>{{ filtered.length }} record(s)</span>
      </div>
      <div class="center" *ngIf="loading"><mat-spinner diameter="40"></mat-spinner></div>
      <table mat-table [dataSource]="filtered" class="full-width" *ngIf="!loading && filtered.length">
        <ng-container matColumnDef="enrollmentId">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let e">{{ e.enrollmentId }}</td>
        </ng-container>
        <ng-container matColumnDef="citizenId">
          <th mat-header-cell *matHeaderCellDef>Citizen ID</th>
          <td mat-cell *matCellDef="let e">{{ e.citizenId }}</td>
        </ng-container>
        <ng-container matColumnDef="schemeId">
          <th mat-header-cell *matHeaderCellDef>Scheme ID</th>
          <td mat-cell *matCellDef="let e">{{ e.schemeId }}</td>
        </ng-container>
        <ng-container matColumnDef="enrollmentDate">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let e">{{ e.enrollmentDate | date:'mediumDate' }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let e"><app-status-badge [status]="e.status"></app-status-badge></td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let e">
            <ng-container *ngIf="e.status === 'PENDING'">
              <button mat-button color="primary" (click)="updateStatus(e, 'APPROVED')">Approve</button>
              <button mat-button color="warn" (click)="updateStatus(e, 'REJECTED')">Reject</button>
            </ng-container>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>
      <p *ngIf="!loading && !filtered.length" class="empty">No enrollments found.</p>
    </mat-card>
  `,
  styles: [`
    .page-title { margin: 0 0 20px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-card { padding: 24px; }
    .toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
    .toolbar mat-form-field { width: 200px; }
    .toolbar span { color: rgba(255,255,255,0.5); font-size: 13px; margin-left: auto; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .full-width { width: 100%; }
    .empty { color: rgba(255,255,255,0.3); padding: 20px 0; font-size: 14px; }
  `]
})
export class EnrollmentManagementComponent implements OnInit {
  enrollments: any[] = [];
  filtered: any[] = [];
  filterStatus = '';
  loading = true;
  cols = ['enrollmentId', 'citizenId', 'schemeId', 'enrollmentDate', 'status', 'actions'];

  constructor(private enrollSvc: EnrollmentService, private toastr: ToastrService, private dialog: MatDialog) {}

  ngOnInit() {
    this.enrollSvc.getAll().subscribe({
      next: r => { this.loading = false; if (r.data) { this.enrollments = r.data; this.applyFilter(); } },
      error: () => { this.loading = false; }
    });
  }

  applyFilter() {
    this.filtered = this.filterStatus
      ? this.enrollments.filter(e => e.status === this.filterStatus)
      : this.enrollments;
  }

  updateStatus(e: any, status: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: `${status === 'APPROVED' ? 'Approve' : 'Reject'} Enrollment`, message: `Are you sure you want to ${status.toLowerCase()} enrollment #${e.enrollmentId}?` } });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.enrollSvc.updateStatus(e.enrollmentId, status).subscribe({
        next: r => {
          e.status = r.data.status;
          this.applyFilter();
          this.toastr.success(`Enrollment ${status.toLowerCase()}.`);
        }
      });
    });
  }
}
