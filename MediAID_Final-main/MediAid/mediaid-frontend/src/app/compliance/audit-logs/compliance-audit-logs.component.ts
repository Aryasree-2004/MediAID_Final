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
import { ToastrService } from 'ngx-toastr';
import { AuditManagementService } from '../../core/services/audit.service';

@Component({
  selector: 'app-compliance-audit-logs',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './compliance-audit-logs.component.html',
  styleUrl: './compliance-audit-logs.component.css'
})
export class ComplianceAuditLogsComponent implements OnInit {
  logs: any[] = [];
  loading = true;
  accessDenied = false;
  actionFilter = '';
  resourceFilter = '';
  cols = ['logId', 'userId', 'action', 'resource', 'details', 'timestamp'];

  constructor(private auditMgmtSvc: AuditManagementService, private toastr: ToastrService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.accessDenied = false;
    this.auditMgmtSvc.getLogs().subscribe({
      next: r => { this.loading = false; this.logs = r.data ?? []; },
      error: (err: any) => {
        this.loading = false;
        if (err?.status === 403 || err?.status === 401) {
          this.accessDenied = true;
        } else {
          this.toastr.error('Could not load audit logs.');
        }
      }
    });
  }

  applyFilter() {
    const a = this.actionFilter.trim();
    const r = this.resourceFilter.trim();
    if (!a && !r) { this.load(); return; }
    this.loading = true;
    const source$ = a ? this.auditMgmtSvc.getLogsByAction(a) : this.auditMgmtSvc.getLogsByResource(r);
    source$.subscribe({
      next: resp => {
        this.loading = false;
        let rows = resp.data ?? [];
        if (a && r) rows = rows.filter(l => (l.resource || '').toLowerCase().includes(r.toLowerCase()));
        this.logs = rows;
      },
      error: () => { this.loading = false; this.logs = []; }
    });
  }

  clear() { this.actionFilter = ''; this.resourceFilter = ''; this.load(); }

  exportCSV() {
    if (!this.logs.length) return;
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const headers = Object.keys(this.logs[0]).map(escape).join(',');
    const rows = this.logs.map(row => Object.values(row).map(escape).join(','));
    const csv = [headers, ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compliance-audit-logs.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
