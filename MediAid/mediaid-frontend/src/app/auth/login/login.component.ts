import { Component, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="auth-page" style="background:#0d1526;min-height:100vh">
      <!-- Left Branding Panel -->
      <div class="auth-left">
        <a routerLink="/" class="auth-brand">
          <div class="brand-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 2v18M2 11h18" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span>MediAid</span>
        </a>
        <div class="auth-left-content">
          <div class="left-illustration">
            <svg width="200" height="180" viewBox="0 0 200 180" fill="none">
              <!-- Shield -->
              <path d="M100 10 L170 38 L170 95 C170 135 100 170 100 170 C100 170 30 135 30 95 L30 38 Z"
                fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
              <!-- Plus in shield -->
              <rect x="88" y="60" width="24" height="8" rx="4" fill="rgba(255,255,255,0.7)"/>
              <rect x="96" y="52" width="8" height="24" rx="4" fill="rgba(255,255,255,0.7)"/>
              <!-- Orbiting dots -->
              <circle cx="100" cy="10" r="5" fill="#00e5ff" fill-opacity="0.6"/>
              <circle cx="170" cy="95" r="4" fill="#40c4ff" fill-opacity="0.5"/>
              <circle cx="30" cy="95" r="4" fill="#4fc3f7" fill-opacity="0.5"/>
              <circle cx="100" cy="170" r="5" fill="#00e5ff" fill-opacity="0.6"/>
            </svg>
          </div>
          <h2 class="left-title">Welcome Back</h2>
          <p class="left-subtitle">Sign in to access your healthcare benefits, track claims, and manage your enrollments.</p>
          <div class="left-features">
            <div class="left-feature" *ngFor="let f of features">
              <div class="left-feature-icon">
                <span class="material-icons">{{ f.icon }}</span>
              </div>
              <span>{{ f.text }}</span>
            </div>
          </div>
        </div>
        <p class="left-footer">&copy; 2025 MediAid · Government Healthcare Portal</p>
      </div>

      <div class="auth-right" style="background:#1a2235">
        <div class="form-container">
          <div class="form-header">
            <h1>Sign In</h1>
            <p>Enter your credentials to access the portal</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
            <div class="field-group">
              <label class="field-label">Email Address</label>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput formControlName="email" type="email" placeholder="your@email.com">
                <mat-icon matSuffix class="field-icon">email</mat-icon>
                <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
                <mat-error *ngIf="form.get('email')?.hasError('email')">Please enter a valid email</mat-error>
              </mat-form-field>
            </div>

            <div class="field-group">
              <div class="label-row">
                <label class="field-label">Password</label>
                <a routerLink="/auth/forgot-password" class="forgot-link">Forgot password?</a>
              </div>
              <mat-form-field appearance="outline" class="full-width">
                <input matInput formControlName="password" [type]="showPw ? 'text' : 'password'" placeholder="Enter your password">
                <button mat-icon-button matSuffix type="button" (click)="showPw=!showPw" class="eye-btn">
                  <mat-icon>{{ showPw ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
              </mat-form-field>
            </div>

            <button type="submit" class="submit-btn" [class.loading]="loading" [disabled]="loading">
              <mat-spinner *ngIf="loading" diameter="20" class="inline-spinner"></mat-spinner>
              <span *ngIf="!loading">
                Sign In
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="display:inline;vertical-align:middle;margin-left:4px">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </button>
          </form>

          <p class="switch-link">
            Don't have an account?
            <a routerLink="/auth/register">Create one free</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh; display: flex; font-family: 'Inter', 'Roboto', sans-serif;
      background: #0d1526 !important;
    }

    /* ── Left Panel ── */
    .auth-left {
      width: 420px; flex-shrink: 0;
      background: linear-gradient(160deg, #0a1940 0%, #0d2a6b 50%, #0a3d7a 100%);
      display: flex; flex-direction: column; padding: 32px;
      position: relative; overflow: hidden;
    }
    .auth-left::before {
      content: ''; position: absolute; top: -150px; right: -150px;
      width: 400px; height: 400px; border-radius: 50%;
      background: radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%);
    }
    .auth-brand {
      display: flex; align-items: center; gap: 10px; text-decoration: none;
      font-size: 1.3rem; font-weight: 800; color: white; margin-bottom: auto;
    }
    .brand-icon {
      width: 36px; height: 36px; background: rgba(255,255,255,0.15);
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.25);
    }
    .auth-left-content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 20px; position: relative; z-index: 1; }
    .left-illustration { display: flex; justify-content: center; margin-bottom: 8px; }
    .left-title { font-size: 1.8rem; font-weight: 800; color: white; margin: 0; }
    .left-subtitle { color: rgba(255,255,255,0.65); font-size: 14px; line-height: 1.7; margin: 0; }
    .left-features { display: flex; flex-direction: column; gap: 12px; }
    .left-feature { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.8); font-size: 14px; }
    .left-feature-icon {
      width: 30px; height: 30px; background: rgba(255,255,255,0.12); border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .left-feature-icon .material-icons { font-size: 16px; color: #7ecfff; }
    .left-footer { color: rgba(255,255,255,0.3); font-size: 12px; margin: 0; }

    /* ── Right Panel ── */
    .auth-right {
      flex: 1; display: flex; align-items: center; justify-content: center;
      background: #1a2235 !important; padding: 40px 24px;
    }
    .form-container { width: 100%; max-width: 420px; }
    .form-header { margin-bottom: 32px; }
    .form-header h1 {
      font-size: 1.9rem; font-weight: 800; color: #f1f5f9;
      margin: 0 0 8px; letter-spacing: -0.5px;
    }
    .form-header p { color: rgba(255,255,255,0.45); font-size: 15px; margin: 0; }

    .auth-form { display: flex; flex-direction: column; gap: 6px; }
    .field-group { display: flex; flex-direction: column; }
    .field-label { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.6); margin-bottom: 6px; }
    .label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .forgot-link { font-size: 13px; color: #818cf8; text-decoration: none; }
    .forgot-link:hover { text-decoration: underline; }
    .full-width { width: 100%; }
    .field-icon { color: rgba(255,255,255,0.3) !important; }
    .eye-btn { color: rgba(255,255,255,0.3) !important; }

    .submit-btn {
      width: 100%; height: 50px; margin-top: 12px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white; border: none; border-radius: 12px;
      font-size: 15px; font-weight: 700; cursor: pointer;
      transition: all 0.25s; display: flex; align-items: center; justify-content: center;
      font-family: 'Inter', 'Roboto', sans-serif;
      box-shadow: 0 4px 20px rgba(99,102,241,0.4);
    }
    .submit-btn:hover:not([disabled]) {
      background: linear-gradient(135deg, #818cf8, #6366f1);
      transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.55);
    }
    .submit-btn[disabled] { opacity: 0.7; cursor: not-allowed; }
    .submit-btn.loading { background: #374151; box-shadow: none; }
    .inline-spinner { display: inline-block; }

    .switch-link {
      text-align: center; margin-top: 20px; color: rgba(255,255,255,0.45); font-size: 14px;
    }
    .switch-link a { color: #818cf8; font-weight: 600; }
    .switch-link a:hover { text-decoration: underline; }

    @media (max-width: 768px) {
      .auth-left { display: none; }
      .auth-right { background: #0d1526; }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  loading = false;
  showPw = false;

  features = [
    { icon: 'shield',             text: 'Secure government-grade authentication' },
    { icon: 'receipt_long',       text: 'Real-time claims & disbursement tracking' },
    { icon: 'account_balance',    text: 'Direct bank benefit transfers' },
  ];

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: res => {
        this.loading = false;
        if (res.status === 'SUCCESS') {
          this.toastr.success('Welcome back!', 'Login Successful');
          this.router.navigate([this.auth.getDashboardRoute()]);
        } else {
          this.toastr.error(res.message || 'Login failed. Please check your credentials.');
        }
      },
      error: () => { this.loading = false; }
    });
  }
}
