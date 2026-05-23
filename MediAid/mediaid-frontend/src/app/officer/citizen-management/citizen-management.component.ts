import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { CitizenService } from '../../core/services/citizen.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-citizen-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatProgressSpinnerModule, StatusBadgeComponent],
  template: `
    <div class="page-header">
      <div>
        <h2 class="page-title">Citizen Management</h2>
        <p class="page-sub">Review pending profiles, verify citizens and manage documents</p>
      </div>
    </div>

    <mat-tab-group>

      <!-- Pending Approvals Tab -->
      <mat-tab label="Pending Approvals">
        <div class="tab-content">
          <div class="pending-toolbar">
            <span class="pending-count" *ngIf="!pendingLoading">{{ pendingCitizens.length }} pending</span>
            <button class="btn-refresh" (click)="loadPending()">
              <mat-icon>refresh</mat-icon> Refresh
            </button>
          </div>
          <div *ngIf="pendingLoading" class="center"><mat-spinner diameter="40" color="accent"></mat-spinner></div>
          <div *ngIf="!pendingLoading && pendingCitizens.length === 0" class="empty-state">
            <mat-icon>check_circle</mat-icon><p>No pending approvals</p>
          </div>
          <div class="pending-list" *ngIf="!pendingLoading && pendingCitizens.length">
            <div class="pending-card" *ngFor="let c of pendingCitizens">
              <div class="pending-info">
                <div class="citizen-name">{{ c.name }}</div>
                <div class="citizen-meta">ID: {{ c.citizenId }} · DOB: {{ c.dob }} · {{ c.gender }} · {{ c.contactInfo }}</div>
                <div class="citizen-addr">{{ c.address }}</div>
              </div>
              <div class="pending-actions">
                <button class="btn-approve" (click)="verifyFromList(c, 'VERIFIED')">
                  <mat-icon>check_circle</mat-icon> Verify
                </button>
                <button class="btn-reject" (click)="verifyFromList(c, 'REJECTED')">
                  <mat-icon>cancel</mat-icon> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </mat-tab>

      <!-- Lookup by ID Tab -->
      <mat-tab label="Lookup by ID">
        <div class="tab-content">
          <div class="search-bar">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Citizen ID</mat-label>
              <input matInput [(ngModel)]="searchId" type="number">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            <button class="btn-search" (click)="lookup()">
              <mat-icon>person_search</mat-icon> Search
            </button>
          </div>

          <div *ngIf="loading" class="center">
            <mat-spinner diameter="40" color="accent"></mat-spinner>
          </div>

          <div *ngIf="citizen" class="citizen-card">
            <mat-tab-group>
              <mat-tab label="Profile">
                <div class="tab-content">
                  <div class="info-grid">
                    <div class="info-item"><span class="label">Full Name</span><span class="value">{{ citizen.name }}</span></div>
                    <div class="info-item"><span class="label">Date of Birth</span><span class="value">{{ citizen.dob }}</span></div>
                    <div class="info-item"><span class="label">Gender</span><span class="value">{{ citizen.gender }}</span></div>
                    <div class="info-item"><span class="label">Contact</span><span class="value">{{ citizen.contactInfo }}</span></div>
                    <div class="info-item full"><span class="label">Address</span><span class="value">{{ citizen.address }}</span></div>
                    <div class="info-item"><span class="label">Status</span><app-status-badge [status]="citizen.status"></app-status-badge></div>
                  </div>
                  <div class="action-bar" *ngIf="citizen.status === 'PENDING'">
                    <button class="btn-approve" (click)="verify('VERIFIED')"><mat-icon>check_circle</mat-icon> Verify Citizen</button>
                    <button class="btn-reject" (click)="verify('REJECTED')"><mat-icon>cancel</mat-icon> Reject</button>
                  </div>
                  <div class="already-verified" *ngIf="citizen.status === 'VERIFIED'">
                    <mat-icon>verified</mat-icon> Citizen is already verified
                  </div>
                </div>
              </mat-tab>
              <mat-tab label="Documents">
                <div class="tab-content">
                  <div *ngIf="docsLoading" class="center"><mat-spinner diameter="32" color="accent"></mat-spinner></div>
                  <table mat-table [dataSource]="documents" class="docs-table" *ngIf="!docsLoading && documents.length">
                    <ng-container matColumnDef="fileName"><th mat-header-cell *matHeaderCellDef>File Name</th><td mat-cell *matCellDef="let d">{{ d.fileName }}</td></ng-container>
                    <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let d"><app-status-badge [status]="d.status"></app-status-badge></td></ng-container>
                    <ng-container matColumnDef="actions">
                      <th mat-header-cell *matHeaderCellDef>Actions</th>
                      <td mat-cell *matCellDef="let d">
                        <button class="btn-verify-doc" (click)="verifyDoc(d.documentId, 'VERIFIED')">Verify</button>
                        <button class="btn-reject-doc" (click)="verifyDoc(d.documentId, 'REJECTED')">Reject</button>
                      </td>
                    </ng-container>
                    <tr mat-header-row *matHeaderRowDef="docCols"></tr>
                    <tr mat-row *matRowDef="let row; columns: docCols;"></tr>
                  </table>
                  <div class="empty-state" *ngIf="!docsLoading && !documents.length">
                    <mat-icon>folder_open</mat-icon><p>No documents uploaded</p>
                  </div>
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>

          <div class="not-found" *ngIf="notFound">
            <mat-icon>person_off</mat-icon><p>Citizen not found. Check the ID and try again.</p>
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
    .search-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .search-field { width: 300px; }
    .btn-search {
      display: inline-flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
      border: none; border-radius: 10px; padding: 12px 20px;
      font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    }
    .btn-search:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(99,102,241,0.5); }
    .btn-search mat-icon { font-size: 18px; height: 18px; width: 18px; }

    .center { display: flex; justify-content: center; padding: 48px; }

    .citizen-card {
      background: linear-gradient(145deg, #111827, #1a2235);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 14px;
      overflow: hidden;
    }
    .tab-content { padding: 20px; }

    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-item.full { grid-column: span 2; }
    .label { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 14px; color: rgba(255,255,255,0.85); font-weight: 500; }

    .action-bar { display: flex; gap: 10px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
    .btn-approve {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(52,211,153,0.15); color: #34d399;
      border: 1px solid rgba(52,211,153,0.3); border-radius: 8px;
      padding: 8px 18px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s;
    }
    .btn-approve:hover { background: rgba(52,211,153,0.25); }
    .btn-approve mat-icon { font-size: 16px; height: 16px; width: 16px; }
    .btn-reject {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(248,113,113,0.15); color: #f87171;
      border: 1px solid rgba(248,113,113,0.3); border-radius: 8px;
      padding: 8px 18px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s;
    }
    .btn-reject:hover { background: rgba(248,113,113,0.25); }
    .btn-reject mat-icon { font-size: 16px; height: 16px; width: 16px; }

    .already-verified {
      display: inline-flex; align-items: center; gap: 8px;
      color: #34d399; font-size: 13px; font-weight: 600;
      background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25);
      padding: 8px 16px; border-radius: 8px; margin-top: 16px;
    }
    .already-verified mat-icon { font-size: 16px; height: 16px; width: 16px; }

    .docs-table { width: 100%; }
    .btn-verify-doc {
      background: rgba(52,211,153,0.1); color: #34d399;
      border: 1px solid rgba(52,211,153,0.25); border-radius: 6px;
      padding: 4px 10px; font-size: 12px; font-weight: 600; cursor: pointer;
      margin-right: 6px; transition: all 0.15s;
    }
    .btn-verify-doc:hover { background: rgba(52,211,153,0.2); }
    .btn-reject-doc {
      background: rgba(248,113,113,0.1); color: #f87171;
      border: 1px solid rgba(248,113,113,0.25); border-radius: 6px;
      padding: 4px 10px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    }
    .btn-reject-doc:hover { background: rgba(248,113,113,0.2); }

    .empty-state { display: flex; align-items: center; gap: 8px; padding: 20px 0; color: rgba(255,255,255,0.3); }
    .empty-state mat-icon { font-size: 20px; }
    .empty-state p { margin: 0; font-size: 14px; }

    .not-found {
      display: flex; align-items: center; gap: 10px; justify-content: center;
      padding: 40px; color: rgba(255,255,255,0.3); font-size: 15px;
    }
    .not-found mat-icon { font-size: 22px; }
    .not-found p { margin: 0; }

    .pending-list { display: flex; flex-direction: column; gap: 12px; }
    .pending-card {
      display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
      background: linear-gradient(145deg, #111827, #1a2235);
      border: 1px solid rgba(245,158,11,0.25); border-radius: 12px; padding: 18px 20px;
    }
    .citizen-name { font-size: 15px; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; }
    .citizen-meta { font-size: 12px; color: rgba(255,255,255,0.45); margin-bottom: 2px; }
    .citizen-addr { font-size: 12px; color: rgba(255,255,255,0.35); }
    .pending-actions { display: flex; gap: 8px; flex-shrink: 0; }
    .pending-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .pending-count { color: rgba(255,255,255,0.45); font-size: 13px; }
    .btn-refresh {
      display: inline-flex; align-items: center; gap: 4px;
      background: rgba(99,102,241,0.15); color: #818cf8;
      border: 1px solid rgba(99,102,241,0.3); border-radius: 8px;
      padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .btn-refresh mat-icon { font-size: 15px; height: 15px; width: 15px; }
  `]
})
export class CitizenManagementComponent implements OnInit {
  searchId: number | null = null;
  citizen: any = null;
  documents: any[] = [];
  pendingCitizens: any[] = [];
  loading = false;
  docsLoading = false;
  pendingLoading = true;
  notFound = false;
  docCols = ['fileName', 'status', 'actions'];

  constructor(private citizenSvc: CitizenService, private toastr: ToastrService) {}

  ngOnInit() { this.loadPending(); }

  loadPending() {
    this.pendingLoading = true;
    this.pendingCitizens = [];
    this.citizenSvc.getAll().subscribe({
      next: r => {
        this.pendingLoading = false;
        if (r.data) this.pendingCitizens = r.data.filter((c: any) => c.status === 'PENDING');
      },
      error: () => {
        this.pendingLoading = false;
        this.toastr.error('Could not load pending citizens. Restart the citizen-service and click Refresh.');
      }
    });
  }

  lookup() {
    if (!this.searchId) return;
    this.loading = true; this.citizen = null; this.notFound = false;
    this.citizenSvc.getCitizen(this.searchId).subscribe({
      next: r => {
        this.loading = false;
        if (r.data) { this.citizen = r.data; this.loadDocs(); }
        else this.notFound = true;
      },
      error: () => { this.loading = false; this.notFound = true; }
    });
  }

  loadDocs() {
    this.docsLoading = true;
    this.citizenSvc.getDocuments(this.citizen.citizenId).subscribe({
      next: r => { this.docsLoading = false; if (r.data) this.documents = r.data; },
      error: () => { this.docsLoading = false; }
    });
  }

  verify(status: string) {
    this.citizenSvc.verifyCitizen(this.citizen.citizenId, status).subscribe({
      next: r => { this.citizen = r.data; this.toastr.success(`Citizen ${status.toLowerCase()}.`); }
    });
  }

  verifyFromList(c: any, status: string) {
    this.citizenSvc.verifyCitizen(c.citizenId, status).subscribe({
      next: r => {
        c.status = r.data.status;
        this.pendingCitizens = this.pendingCitizens.filter(x => x.citizenId !== c.citizenId);
        this.toastr.success(`Citizen ${status.toLowerCase()}.`);
      }
    });
  }

  verifyDoc(documentId: number, status: string) {
    this.citizenSvc.verifyDocument(documentId, status).subscribe({
      next: () => { this.toastr.success(`Document ${status.toLowerCase()}.`); this.loadDocs(); }
    });
  }
}
