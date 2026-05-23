import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <div class="brand">
          <mat-icon>lock_reset</mat-icon>
          <h2>Forgot Password</h2>
          <p>Enter your email to receive an OTP</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email">
            <mat-icon matSuffix>email</mat-icon>
            <mat-error>Valid email is required</mat-error>
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" class="full-width submit-btn" [disabled]="loading">
            {{ loading ? 'Sending...' : 'Send OTP' }}
          </button>
        </form>
        <p class="back-link"><a routerLink="/auth/login">← Back to Login</a></p>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1565c0 0%, #0288d1 100%); }
    .auth-card { width: 100%; max-width: 420px; padding: 32px; border-radius: 12px; }
    .brand { text-align: center; margin-bottom: 24px; color: #1565c0; }
    .brand mat-icon { font-size: 48px; height: 48px; width: 48px; }
    .brand h2 { margin: 8px 0 4px; }
    .brand p { margin: 0; color: #666; }
    .full-width { width: 100%; }
    .submit-btn { height: 48px; font-size: 16px; margin-top: 8px; }
    .back-link { text-align: center; margin-top: 16px; }
    .back-link a { color: #1565c0; text-decoration: none; }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  loading = false;

  constructor(private auth: AuthService, private router: Router, private toastr: ToastrService) {}

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.forgotPassword(this.form.value as any).subscribe({
      next: res => {
        this.loading = false;
        this.toastr.success('OTP sent to your email!');
        this.router.navigate(['/auth/reset-password'], { queryParams: { email: this.form.value.email } });
      },
      error: () => { this.loading = false; }
    });
  }
}
