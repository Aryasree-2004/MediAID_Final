import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { CitizenService } from '../../core/services/citizen.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-citizen-documents',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatProgressSpinnerModule, StatusBadgeComponent],
  template: `
    <h2 class="page-title">My Documents</h2>
    <mat-card class="page-card">
      <div class="toolbar">
        <p class="hint">Upload PDF, JPG, or PNG files (max 10MB each)</p>
        <label class="upload-btn">
          <mat-icon>upload_file</mat-icon> Upload Document
          <input type="file" (change)="onFileSelect($event)" accept=".pdf,.jpg,.jpeg,.png" hidden>
        </label>
      </div>
      <div class="center" *ngIf="loading"><mat-spinner diameter="40"></mat-spinner></div>
      <table mat-table [dataSource]="docs" class="full-width" *ngIf="!loading && docs.length">
        <ng-container matColumnDef="fileName">
          <th mat-header-cell *matHeaderCellDef>File Name</th>
          <td mat-cell *matCellDef="let d">{{ d.fileName }}</td>
        </ng-container>
        <ng-container matColumnDef="fileType">
          <th mat-header-cell *matHeaderCellDef>Type</th>
          <td mat-cell *matCellDef="let d">{{ d.fileType }}</td>
        </ng-container>
        <ng-container matColumnDef="uploadDate">
          <th mat-header-cell *matHeaderCellDef>Uploaded</th>
          <td mat-cell *matCellDef="let d">{{ d.uploadDate | date:'mediumDate' }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let d"><app-status-badge [status]="d.status"></app-status-badge></td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let d">
            <button mat-icon-button color="primary" (click)="download(d.fileName)" title="Download">
              <mat-icon>download</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>
      <p *ngIf="!loading && !docs.length" class="empty">No documents uploaded yet.</p>
    </mat-card>
  `,
  styles: [`
    .page-title { margin: 0 0 20px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-card { padding: 24px; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .hint { margin: 0; color: rgba(255,255,255,0.35); font-size: 13px; }
    .upload-btn {
      display: flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;
      padding: 10px 18px; border-radius: 10px; cursor: pointer;
      font-size: 13px; font-weight: 700; box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    }
    .upload-btn mat-icon { font-size: 18px; height: 18px; width: 18px; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .full-width { width: 100%; }
    .empty { color: rgba(255,255,255,0.3); padding: 20px 0; font-size: 14px; }
  `]
})
export class CitizenDocumentsComponent implements OnInit {
  docs: any[] = [];
  loading = true;
  cols = ['fileName', 'fileType', 'uploadDate', 'status', 'actions'];
  citizenId!: number;

  constructor(private citizenSvc: CitizenService, private auth: AuthService, private toastr: ToastrService) {}

  ngOnInit() {
    this.citizenId = Number(this.auth.getUserId());
    this.load();
  }

  load() {
    this.loading = true;
    this.citizenSvc.getDocuments(this.citizenId).subscribe({
      next: r => { this.loading = false; if (r.data) this.docs = r.data; },
      error: () => { this.loading = false; }
    });
  }

  onFileSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { this.toastr.error('File exceeds 10MB limit.'); return; }
    this.citizenSvc.uploadDocument(this.citizenId, file).subscribe({
      next: () => { this.toastr.success('Document uploaded!'); this.load(); },
    });
  }

  download(fileName: string) {
    this.citizenSvc.downloadDocument(fileName).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = fileName; a.click();
      URL.revokeObjectURL(url);
    });
  }
}
