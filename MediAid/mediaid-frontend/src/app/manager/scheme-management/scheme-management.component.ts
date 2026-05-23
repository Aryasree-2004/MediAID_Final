import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SchemeService } from '../../core/services/scheme.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-scheme-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressSpinnerModule, MatDialogModule, StatusBadgeComponent],
  template: `
    <h2 class="page-title">Scheme Management</h2>
    <mat-card class="page-card">
      <div class="toolbar">
        <input class="search-input" placeholder="Search schemes..." [(ngModel)]="search" (input)="applyFilter()">
        <button mat-flat-button color="primary" (click)="showForm=!showForm; resetForm()">
          <mat-icon>add</mat-icon> Create Scheme
        </button>
      </div>

      <div *ngIf="showForm" class="scheme-form-panel">
        <h3>{{ editMode ? 'Edit' : 'New' }} Scheme</h3>
        <form [formGroup]="schemeForm" (ngSubmit)="submit()" class="scheme-form">
          <div class="two-col">
            <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name"><mat-error>Required</mat-error></mat-form-field>
            <mat-form-field appearance="outline"><mat-label>Max Coverage (₹)</mat-label><input matInput formControlName="maxCoverageAmount" type="number"><mat-error>Required</mat-error></mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput formControlName="description" rows="2" maxlength="1000"></textarea></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Eligibility Criteria</mat-label><textarea matInput formControlName="eligibilityCriteria" rows="2" maxlength="500"></textarea></mat-form-field>
          <mat-form-field appearance="outline" class="full-width"><mat-label>Benefits</mat-label><textarea matInput formControlName="benefits" rows="2" maxlength="500"></textarea></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>Validity (Years)</mat-label><input matInput formControlName="validityYears" type="number"><mat-error>Required</mat-error></mat-form-field>
          <div class="form-actions">
            <button mat-button type="button" (click)="showForm=false">Cancel</button>
            <button mat-flat-button color="primary" type="submit">{{ editMode ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>

      <div class="center" *ngIf="loading"><mat-spinner diameter="40"></mat-spinner></div>
      <table mat-table [dataSource]="filtered" class="full-width" *ngIf="!loading && filtered.length">
        <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let s">{{ s.name }}</td></ng-container>
        <ng-container matColumnDef="maxCoverageAmount"><th mat-header-cell *matHeaderCellDef>Max Coverage</th><td mat-cell *matCellDef="let s">₹{{ s.maxCoverageAmount | number:'1.0-0' }}</td></ng-container>
        <ng-container matColumnDef="validityYears"><th mat-header-cell *matHeaderCellDef>Validity</th><td mat-cell *matCellDef="let s">{{ s.validityYears }} yr(s)</td></ng-container>
        <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let s"><app-status-badge [status]="s.status"></app-status-badge></td></ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let s">
            <button mat-icon-button (click)="toggleStatus(s)" [title]="s.status === 'ACTIVE' ? 'Deactivate' : 'Activate'">
              <mat-icon>{{ s.status === 'ACTIVE' ? 'toggle_on' : 'toggle_off' }}</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteScheme(s)" title="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>
      <p *ngIf="!loading && !filtered.length" class="empty">No schemes found.</p>
    </mat-card>
  `,
  styles: [`
    .page-title { margin: 0 0 20px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-card { padding: 24px; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 16px; }
    .search-input {
      flex: 1; max-width: 300px; padding: 10px 14px;
      background: rgba(255,255,255,0.05); border: 1px solid rgba(99,102,241,0.25);
      border-radius: 8px; font-size: 14px; color: #f1f5f9; outline: none;
    }
    .search-input::placeholder { color: rgba(255,255,255,0.3); }
    .search-input:focus { border-color: rgba(99,102,241,0.5); }
    .scheme-form-panel {
      background: rgba(99,102,241,0.07); border: 1px solid rgba(99,102,241,0.15);
      padding: 20px; border-radius: 12px; margin-bottom: 20px;
    }
    .scheme-form-panel h3 { margin: 0 0 16px; color: #f1f5f9; }
    .scheme-form { display: flex; flex-direction: column; gap: 8px; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .two-col mat-form-field, .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .full-width { width: 100%; }
    .empty { color: rgba(255,255,255,0.3); padding: 20px 0; font-size: 14px; }
  `]
})
export class SchemeManagementComponent implements OnInit {
  schemes: any[] = [];
  filtered: any[] = [];
  loading = true;
  showForm = false;
  editMode = false;
  search = '';
  cols = ['name', 'maxCoverageAmount', 'validityYears', 'status', 'actions'];

  private fb = inject(FormBuilder);
  schemeForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    eligibilityCriteria: [''],
    benefits: [''],
    maxCoverageAmount: [null, Validators.required],
    validityYears: [1, Validators.required]
  });

  constructor(private schemeSvc: SchemeService, private toastr: ToastrService, private dialog: MatDialog) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.schemeSvc.getAll().subscribe({
      next: r => { this.loading = false; if (r.data) { this.schemes = r.data; this.applyFilter(); } },
      error: () => { this.loading = false; }
    });
  }

  applyFilter() {
    this.filtered = this.search
      ? this.schemes.filter(s => s.name.toLowerCase().includes(this.search.toLowerCase()))
      : this.schemes;
  }

  resetForm() { this.editMode = false; this.schemeForm.reset({ validityYears: 1 }); }

  submit() {
    if (this.schemeForm.invalid) { this.schemeForm.markAllAsTouched(); return; }
    this.schemeSvc.create(this.schemeForm.value as any).subscribe({
      next: r => { this.toastr.success('Scheme created!'); this.showForm = false; this.load(); }
    });
  }

  toggleStatus(s: any) {
    const newStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.schemeSvc.updateStatus(s.schemeId, { status: newStatus }).subscribe({
      next: r => { s.status = r.data.status; this.toastr.success(`Scheme ${newStatus.toLowerCase()}.`); }
    });
  }

  deleteScheme(s: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete Scheme', message: `Delete scheme "${s.name}"? This cannot be undone.` } });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.schemeSvc.delete(s.schemeId).subscribe({
        next: () => { this.toastr.success('Scheme deleted.'); this.load(); }
      });
    });
  }
}
