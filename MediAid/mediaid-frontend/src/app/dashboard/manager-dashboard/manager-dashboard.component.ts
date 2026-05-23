import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SchemeService } from '../../core/services/scheme.service';
import { ComplianceService } from '../../core/services/compliance.service';
import { AuditManagementService } from '../../core/services/audit.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  template: `
    <div class="dashboard">
      <div class="dash-header">
        <div>
          <div class="dash-eyebrow"><span class="eyebrow-dot"></span> Overview</div>
          <h1 class="dash-title">Manager Dashboard</h1>
          <p class="dash-subtitle">Monitor schemes, compliance, and formal audits</p>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card" *ngFor="let card of summaryCards">
          <div class="card-glow" [style.background]="card.glow"></div>
          <div class="card-icon-wrap" [style.background]="card.grad">
            <mat-icon>{{ card.icon }}</mat-icon>
          </div>
          <div class="card-content">
            <div class="card-value">{{ card.value }}</div>
            <div class="card-label">{{ card.label }}</div>
          </div>
        </div>
      </div>

      <div class="quick-actions-card">
        <h3 class="qa-title">Quick Actions</h3>
        <div class="qa-grid">
          <a routerLink="/manager/schemes" class="qa-item">
            <div class="qa-icon blue"><mat-icon>local_offer</mat-icon></div>
            <span>Manage Schemes</span>
          </a>
          <a routerLink="/manager/compliance" class="qa-item">
            <div class="qa-icon red"><mat-icon>rule</mat-icon></div>
            <span>Compliance Review</span>
          </a>
          <a routerLink="/manager/audits" class="qa-item">
            <div class="qa-icon amber"><mat-icon>fact_check</mat-icon></div>
            <span>Formal Audits</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { font-family: 'Inter', 'Roboto', sans-serif; }
    .dash-header { margin-bottom: 28px; }
    .dash-eyebrow {
      display: flex; align-items: center; gap: 7px;
      font-size: 12px; font-weight: 600; color: #818cf8;
      text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;
    }
    .eyebrow-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #6366f1;
      box-shadow: 0 0 8px rgba(99,102,241,0.8);
      animation: pulse-glow 2s ease-in-out infinite;
    }
    @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 8px rgba(99,102,241,0.8); } 50% { box-shadow: 0 0 18px rgba(99,102,241,1); } }
    .dash-title { margin: 0 0 6px; font-size: 1.8rem; font-weight: 800; color: white; letter-spacing: -0.8px; }
    .dash-subtitle { margin: 0; font-size: 14px; color: rgba(255,255,255,0.4); }

    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 28px; }
    .summary-card {
      background: linear-gradient(145deg, #111827, #1a2235);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 16px;
      padding: 22px; display: flex; align-items: center; gap: 16px;
      position: relative; overflow: hidden; transition: all 0.25s;
    }
    .summary-card:hover { transform: translateY(-3px); border-color: rgba(99,102,241,0.3); box-shadow: 0 12px 36px rgba(0,0,0,0.4); }
    .card-glow { position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%; opacity: 0.12; filter: blur(18px); pointer-events: none; }
    .card-icon-wrap { width: 50px; height: 50px; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 1; }
    .card-icon-wrap mat-icon { color: white; font-size: 24px; height: 24px; width: 24px; }
    .card-content { flex: 1; z-index: 1; }
    .card-value { font-size: 1.75rem; font-weight: 800; color: white; line-height: 1; }
    .card-label { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 6px; font-weight: 500; }

    .quick-actions-card { background: linear-gradient(145deg, #111827, #1a2235); border: 1px solid rgba(99,102,241,0.15); border-radius: 16px; padding: 24px; }
    .qa-title { margin: 0 0 20px; font-size: 15px; font-weight: 700; color: white; }
    .qa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .qa-item {
      display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-radius: 12px;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
      text-decoration: none; color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 600; transition: all 0.2s;
    }
    .qa-item:hover { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.25); color: white; }
    .qa-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .qa-icon mat-icon { font-size: 18px; height: 18px; width: 18px; color: white; }
    .qa-icon.blue { background: rgba(99,102,241,0.25); }
    .qa-icon.red { background: rgba(248,113,113,0.2); }
    .qa-icon.amber { background: rgba(251,191,36,0.2); }

    @media (max-width: 1200px) { .summary-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .qa-grid { grid-template-columns: 1fr; } }
  `]
})
export class ManagerDashboardComponent implements OnInit {
  totalSchemes = 0; activeSchemes = 0; violations = 0; totalAudits = 0;
  summaryCards: any[] = [];

  constructor(
    private schemeSvc: SchemeService,
    private complianceSvc: ComplianceService,
    private auditMgmtSvc: AuditManagementService
  ) {}

  ngOnInit() {
    this.refreshCards();
    this.schemeSvc.getAll().subscribe(r => {
      if (r.data) {
        this.totalSchemes = r.data.length;
        this.activeSchemes = r.data.filter((s: any) => s.status === 'ACTIVE').length;
        this.refreshCards();
      }
    });
    this.complianceSvc.getViolations().subscribe(r => { if (r.data) { this.violations = r.data.length; this.refreshCards(); } });
    this.auditMgmtSvc.getAllAudits().subscribe(r => { if (r.data) { this.totalAudits = r.data.length; this.refreshCards(); } });
  }

  refreshCards() {
    this.summaryCards = [
      { label: 'Total Schemes', value: this.totalSchemes, icon: 'local_offer', grad: 'linear-gradient(135deg,#6366f1,#4f46e5)', glow: '#6366f1' },
      { label: 'Active Schemes', value: this.activeSchemes, icon: 'check_circle', grad: 'linear-gradient(135deg,#059669,#10b981)', glow: '#10b981' },
      { label: 'Compliance Violations', value: this.violations, icon: 'warning', grad: 'linear-gradient(135deg,#ef4444,#dc2626)', glow: '#ef4444' },
      { label: 'Formal Audits', value: this.totalAudits, icon: 'fact_check', grad: 'linear-gradient(135deg,#f59e0b,#d97706)', glow: '#f59e0b' },
    ];
  }
}
