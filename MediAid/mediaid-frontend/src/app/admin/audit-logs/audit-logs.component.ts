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
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.css'
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
      next: r => { this.basicLoading = false; this.basicLogs = r.data ?? []; },
      error: () => { this.basicLoading = false; this.basicLogs = []; }
    });
  }

  loadMgmtLogs() {
    this.mgmtLoading = true;
    this.auditMgmtSvc.getLogs().subscribe({
      next: r => { this.mgmtLoading = false; this.mgmtLogs = r.data ?? []; },
      error: () => { this.mgmtLoading = false; this.mgmtLogs = []; }
    });
  }

  filterByUser() {
    if (!this.userIdFilter) { this.loadAll(); return; }
    this.basicLoading = true;
    this.auditSvc.getByUser(this.userIdFilter).subscribe({
      next: r => { this.basicLoading = false; this.basicLogs = r.data ?? []; },
      error: () => { this.basicLoading = false; this.basicLogs = []; }
    });
  }

  filterByAction() {
    if (!this.actionFilter) { this.loadMgmtLogs(); return; }
    this.mgmtLoading = true;
    this.auditMgmtSvc.getLogsByAction(this.actionFilter).subscribe({
      next: r => { this.mgmtLoading = false; this.mgmtLogs = r.data ?? []; },
      error: () => { this.mgmtLoading = false; this.mgmtLogs = []; }
    });
  }

  exportCSV(data: any[], filename: string) {
    if (!data.length) return;
    const escape = (v: any) => {
      const s = v === null || v === undefined ? '' : String(v);
      return `"${s.replace(/"/g, '""')}"`;
    };
    const headers = Object.keys(data[0]).map(escape).join(',');
    const rows = data.map(row => Object.values(row).map(escape).join(','));
    const csv = [headers, ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
}
