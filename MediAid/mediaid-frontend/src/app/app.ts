import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent, SidebarComponent],
  template: `
    <ng-container *ngIf="auth.isLoggedIn(); else publicLayout">
      <app-navbar></app-navbar>
      <div class="app-shell">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </ng-container>
    <ng-template #publicLayout>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .app-shell {
      display: flex;
      margin-top: 64px;
      min-height: calc(100vh - 64px);
    }
    .main-content {
      flex: 1;
      padding: 28px 32px;
      min-height: calc(100vh - 64px);
      overflow-y: auto;
      max-width: calc(100vw - 230px);

      /* Deep navy with subtle dot-grid pattern */
      background-color: #0d1526;
      background-image:
        radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px);
      background-size: 28px 28px;
      /* Gradient overlay so dots fade near edges */
      background-attachment: local;
    }
    @media (max-width: 768px) {
      .main-content { padding: 16px; max-width: 100vw; }
    }
  `]
})
export class App {
  constructor(public auth: AuthService) {}
}
