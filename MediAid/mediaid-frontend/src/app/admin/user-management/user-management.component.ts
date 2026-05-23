import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../core/services/user.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatSortModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <h2 class="page-title">User Management</h2>
    <mat-card class="page-card">
      <div class="toolbar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search users...</mat-label>
          <input matInput [(ngModel)]="search" (input)="applyFilter()" placeholder="Name or email">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <span>{{ dataSource.data.length }} user(s)</span>
      </div>
      <div class="center" *ngIf="loading"><mat-spinner diameter="40"></mat-spinner></div>
      <table mat-table [dataSource]="dataSource" matSort class="full-width" *ngIf="!loading">
        <ng-container matColumnDef="userId">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
          <td mat-cell *matCellDef="let u">{{ u.userId }}</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
          <td mat-cell *matCellDef="let u">
            <span *ngIf="editingUser?.userId !== u.userId">{{ u.name }}</span>
            <input *ngIf="editingUser?.userId === u.userId" [(ngModel)]="editingUser.name" class="inline-input">
          </td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
          <td mat-cell *matCellDef="let u">{{ u.email }}</td>
        </ng-container>
        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>Role</th>
          <td mat-cell *matCellDef="let u">
            <span *ngIf="editingUser?.userId !== u.userId" class="role-chip {{ u.role.toLowerCase() }}">{{ u.role }}</span>
            <mat-select *ngIf="editingUser?.userId === u.userId" [(ngModel)]="editingUser.role" style="width:120px">
              <mat-option value="CITIZEN">Citizen</mat-option>
              <mat-option value="OFFICER">Officer</mat-option>
              <mat-option value="MANAGER">Manager</mat-option>
              <mat-option value="ADMIN">Admin</mat-option>
            </mat-select>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let u">
            <ng-container *ngIf="editingUser?.userId !== u.userId">
              <button mat-icon-button (click)="startEdit(u)" title="Edit"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="deleteUser(u)" title="Delete"><mat-icon>delete</mat-icon></button>
            </ng-container>
            <ng-container *ngIf="editingUser?.userId === u.userId">
              <button mat-icon-button color="primary" (click)="saveEdit(u)" title="Save"><mat-icon>check</mat-icon></button>
              <button mat-icon-button (click)="editingUser=null" title="Cancel"><mat-icon>close</mat-icon></button>
            </ng-container>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;" [class.editing-row]="editingUser?.userId === row.userId"></tr>
      </table>
      <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
    </mat-card>
  `,
  styles: [`
    .page-title { margin: 0 0 20px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-card { padding: 24px; }
    .toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .search-field { width: 320px; }
    .toolbar span { color: rgba(255,255,255,0.5); font-size: 13px; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .full-width { width: 100%; }
    .role-chip { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.4px; }
    .role-chip.citizen { background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.3); }
    .role-chip.officer { background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.25); }
    .role-chip.manager { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
    .role-chip.admin { background: rgba(167,139,250,0.12); color: #c4b5fd; border: 1px solid rgba(167,139,250,0.25); }
    .inline-input {
      background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.35);
      border-radius: 6px; padding: 5px 10px; font-size: 13px; width: 140px;
      color: #f1f5f9; outline: none;
    }
    .editing-row td { background: rgba(99,102,241,0.07) !important; }
  `]
})
export class UserManagementComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  loading = true;
  search = '';
  editingUser: any = null;
  cols = ['userId', 'name', 'email', 'role', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userSvc: UserService, private toastr: ToastrService, private dialog: MatDialog) {}

  ngOnInit() {
    this.userSvc.getAll().subscribe({
      next: r => {
        this.loading = false;
        if (r.data) {
          this.dataSource.data = r.data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter() {
    this.dataSource.filter = this.search.trim().toLowerCase();
    this.dataSource.filterPredicate = (u, filter) =>
      u.name?.toLowerCase().includes(filter) || u.email?.toLowerCase().includes(filter);
  }

  startEdit(u: any) { this.editingUser = { ...u }; }

  saveEdit(original: any) {
    const roleChanged = this.editingUser.role !== original.role;
    // Always include role in the update payload to satisfy backend validation
    this.userSvc.update(this.editingUser.userId, {
      name: this.editingUser.name,
      email: this.editingUser.email,
      role: this.editingUser.role
    }).subscribe({
      next: r => {
        Object.assign(original, r.data ?? this.editingUser);
        if (roleChanged) {
          this.userSvc.updateRole(original.userId, this.editingUser.role).subscribe({
            next: r2 => { original.role = r2.data?.role ?? this.editingUser.role; }
          });
        }
        this.editingUser = null;
        this.toastr.success('User updated.');
      },
      error: err => {
        this.toastr.error(err?.error?.message || 'Update failed.');
      }
    });
  }

  deleteUser(u: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete User', message: `Delete user "${u.name}"? This cannot be undone.` } });
    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.userSvc.delete(u.userId).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter((x: any) => x.userId !== u.userId);
          this.toastr.success('User deleted.');
        }
      });
    });
  }
}
