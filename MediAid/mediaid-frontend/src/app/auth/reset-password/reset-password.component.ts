import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="auth-page">
      <mat-card class="auth-card">
        <div class="brand">
          <mat-icon>lock</mat-icon>
          <h2>Reset Password</h2>
          <p>Enter the OTP sent to your email</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email">
            <mat-error>Email is required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>OTP</mat-label>
            <input matInput formControlName="otp" placeholder="Enter OTP">
            <mat-error>OTP is required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>New Password</mat-label>
            <input matInput formControlName="newPassword" [type]="showPw ? 'text' : 'password'">
            <button mat-icon-button matSuffix type="button" (click)="showPw=!showPw">
              <mat-icon>{{ showPw ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error>Minimum 8 characters</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirm Password</mat-label>
            <input matInput formControlName="confirmPassword" type="password">
            <mat-error *ngIf="form.get('confirmPassword')?.hasError('mismatch')">Passwords do not match</mat-error>
          </mat-form-field>
          <button mat-flat-button color="primary" type="submit" class="full-width submit-btn" [disabled]="loading">
            {{ loading ? 'Resetting...' : 'Reset Password' }}
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
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.matchPasswords });
  loading = false;
  showPw = false;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private toastr: ToastrService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(p => { if (p['email']) this.form.patchValue({ email: p['email'] }); });
  }

  matchPasswords(g: AbstractControl) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    const { email, otp, newPassword } = this.form.value;
    this.auth.resetPassword({ email: email!, otp: otp!, newPassword: newPassword! }).subscribe({
      next: res => {
        this.loading = false;
        this.toastr.success('Password reset successful!');
        this.router.navigate(['/auth/login']);
      },
      error: () => { this.loading = false; }
    });
  }
}
