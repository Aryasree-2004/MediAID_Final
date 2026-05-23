import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule],
  template: `
    <nav class="sidebar">
      <div class="sidebar-inner">
        <div class="nav-section-label">Navigation</div>
        <div class="nav-section">
          <a
            *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item"
            [matTooltip]="item.label"
            matTooltipPosition="right"
          >
            <div class="nav-icon-wrap">
              <mat-icon>{{ item.icon }}</mat-icon>
            </div>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="user-footer-info">
          <div class="user-footer-avatar">
            <mat-icon>person</mat-icon>
          </div>
          <div class="user-footer-text">
            <div class="user-footer-name">{{ auth.getUserName() }}</div>
            <div class="user-footer-role">{{ auth.getRole() }}</div>
          </div>
        </div>
        <button class="logout-btn" (click)="auth.logout()" matTooltip="Sign Out" matTooltipPosition="right">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: 230px;
      min-height: calc(100vh - 64px);
      background: linear-gradient(180deg, #0a1020 0%, #0d1628 100%);
      border-right: 1px solid rgba(99,102,241,0.12);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 64px;
      flex-shrink: 0;
    }
    .sidebar-inner { flex: 1; padding: 20px 12px 12px; overflow-y: auto; }
    .nav-section-label {
      font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.2);
      letter-spacing: 1.2px; text-transform: uppercase;
      padding: 0 10px; margin-bottom: 10px;
    }
    .nav-section { display: flex; flex-direction: column; gap: 3px; }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 9px 12px;
      border-radius: 10px;
      text-decoration: none;
      color: rgba(255,255,255,0.45);
      font-size: 13.5px;
      font-weight: 500;
      transition: all 0.18s ease;
      cursor: pointer;
      position: relative;
    }
    .nav-item:hover {
      background: rgba(99,102,241,0.12);
      color: rgba(255,255,255,0.85);
    }
    .nav-item:hover .nav-icon-wrap {
      background: rgba(99,102,241,0.2);
    }
    .nav-item:hover mat-icon {
      color: #818cf8;
    }
    .nav-item.active {
      background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.15));
      color: white;
      font-weight: 600;
      border: 1px solid rgba(99,102,241,0.25);
    }
    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0; top: 25%; bottom: 25%;
      width: 3px;
      background: linear-gradient(180deg, #818cf8, #6366f1);
      border-radius: 0 3px 3px 0;
    }
    .nav-item.active .nav-icon-wrap {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      box-shadow: 0 4px 12px rgba(99,102,241,0.4);
    }
    .nav-item.active mat-icon {
      color: white;
    }

    .nav-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.18s ease;
    }
    .nav-icon-wrap mat-icon {
      font-size: 17px;
      height: 17px;
      width: 17px;
      color: rgba(255,255,255,0.4);
      transition: color 0.18s ease;
    }
    .nav-label { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Footer */
    .sidebar-footer {
      padding: 12px;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex; align-items: center; gap: 10px;
    }
    .user-footer-info {
      display: flex; align-items: center; gap: 8px; flex: 1; overflow: hidden;
    }
    .user-footer-avatar {
      width: 30px; height: 30px; border-radius: 8px;
      background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.3);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .user-footer-avatar mat-icon { font-size: 16px; height: 16px; width: 16px; color: #818cf8; }
    .user-footer-name { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-footer-role { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 1px; }

    .logout-btn {
      width: 32px; height: 32px; flex-shrink: 0;
      border: none; background: rgba(255,255,255,0.05); border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.18s; color: rgba(255,255,255,0.35);
    }
    .logout-btn:hover { background: rgba(239,68,68,0.15); color: #f87171; }
    .logout-btn mat-icon { font-size: 16px; height: 16px; width: 16px; }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [];

  constructor(public auth: AuthService) {
    const role = auth.getRole();
    const map: Record<string, NavItem[]> = {
      CITIZEN: [
        { label: 'Dashboard',     icon: 'dashboard',              route: '/citizen/dashboard'     },
        { label: 'My Profile',    icon: 'person',                 route: '/citizen/profile'       },
        { label: 'Documents',     icon: 'folder_open',            route: '/citizen/documents'     },
        { label: 'Enrollments',   icon: 'assignment',             route: '/citizen/enrollments'   },
        { label: 'Claims',        icon: 'receipt_long',           route: '/citizen/claims'        },
        { label: 'Disbursements', icon: 'account_balance_wallet', route: '/citizen/disbursements' },
        { label: 'Payments',      icon: 'payments',               route: '/citizen/payments'      },
      ],
      OFFICER: [
        { label: 'Dashboard',     icon: 'dashboard',              route: '/officer/dashboard'     },
        { label: 'Citizens',      icon: 'people',                 route: '/officer/citizens'      },
        { label: 'Enrollments',   icon: 'assignment',             route: '/officer/enrollments'   },
        { label: 'Claims',        icon: 'receipt_long',           route: '/officer/claims'        },
        { label: 'Disbursements', icon: 'account_balance_wallet', route: '/officer/disbursements' },
        { label: 'Compliance',    icon: 'verified_user',          route: '/officer/compliance'    },
      ],
      MANAGER: [
        { label: 'Dashboard',     icon: 'dashboard',     route: '/manager/dashboard'   },
        { label: 'Schemes',       icon: 'local_offer',   route: '/manager/schemes'     },
        { label: 'Compliance',    icon: 'verified_user', route: '/manager/compliance'  },
        { label: 'Formal Audits', icon: 'fact_check',    route: '/manager/audits'      },
      ],
      ADMIN: [
        { label: 'Dashboard',       icon: 'dashboard',       route: '/admin/dashboard'   },
        { label: 'User Management', icon: 'manage_accounts', route: '/admin/users'       },
        { label: 'Audit Logs',      icon: 'manage_search',   route: '/admin/audit-logs'  },
      ],
    };
    this.navItems = map[role ?? ''] ?? [];
  }
}
