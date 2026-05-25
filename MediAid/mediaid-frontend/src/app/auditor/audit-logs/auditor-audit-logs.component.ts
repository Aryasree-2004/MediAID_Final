import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuditManagementService } from '../../core/services/audit.service';

@Component({
  selector: 'app-auditor-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  templateUrl: './auditor-audit-logs.component.html',
  styleUrl: './auditor-audit-logs.component.css'
})
export class AuditorAuditLogsComponent implements OnInit {
  mgmtLogs: any[] = [];
  mgmtLoading = true;
  mgmtActionFilter = '';
  mgmtResourceFilter = '';
  mgmtCols = ['logId', 'userId', 'action', 'resource', 'details', 'timestamp'];

  constructor(private auditMgmtSvc: AuditManagementService) {}

  ngOnInit() { this.loadMgmt(); }

  loadMgmt() {
    this.mgmtLoading = true;
    this.auditMgmtSvc.getLogs().subscribe({
      next: r => { this.mgmtLoading = false; this.mgmtLogs = r.data ?? []; },
      error: () => { this.mgmtLoading = false; this.mgmtLogs = []; }
    });
  }

  // Backend exposes /logs/action/{action} and /logs/resource/{fragment}.
  // Prefer server-side when one filter is set; both filters → client-side AND on the action result.
  applyMgmtFilter() {
    const a = this.mgmtActionFilter.trim();
    const r = this.mgmtResourceFilter.trim();

    if (!a && !r) { this.loadMgmt(); return; }

    this.mgmtLoading = true;
    const source$ = a
      ? this.auditMgmtSvc.getLogsByAction(a)
      : this.auditMgmtSvc.getLogsByResource(r);

    source$.subscribe({
      next: resp => {
        this.mgmtLoading = false;
        let rows = resp.data ?? [];
        if (a && r) rows = rows.filter(l => (l.resource || '').toLowerCase().includes(r.toLowerCase()));
        this.mgmtLogs = rows;
      },
      error: () => { this.mgmtLoading = false; this.mgmtLogs = []; }
    });
  }

  clearMgmt() { this.mgmtActionFilter = ''; this.mgmtResourceFilter = ''; this.loadMgmt(); }

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
