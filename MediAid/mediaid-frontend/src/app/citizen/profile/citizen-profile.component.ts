import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
import { CitizenService } from '../../core/services/citizen.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-citizen-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatProgressSpinnerModule, StatusBadgeComponent],
  template: `
    <h2 class="page-title">My Profile</h2>
    <mat-card class="profile-card">
      <ng-container *ngIf="loading">
        <div class="center"><mat-spinner diameter="40"></mat-spinner></div>
      </ng-container>
      <ng-container *ngIf="!loading && citizen && !editing">
        <div class="profile-view">
          <div class="profile-header">
            <mat-icon class="avatar">account_circle</mat-icon>
            <div>
              <h3>{{ citizen.name }}</h3>
              <app-status-badge [status]="citizen.status"></app-status-badge>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item"><span class="label">Date of Birth</span><span>{{ citizen.dob }}</span></div>
            <div class="info-item"><span class="label">Gender</span><span>{{ citizen.gender }}</span></div>
            <div class="info-item"><span class="label">Contact</span><span>{{ citizen.contactInfo }}</span></div>
            <div class="info-item full"><span class="label">Address</span><span>{{ citizen.address }}</span></div>
          </div>
          <button mat-flat-button color="primary" (click)="startEdit()"><mat-icon>edit</mat-icon> Edit Profile</button>
        </div>
      </ng-container>
      <ng-container *ngIf="!loading && !citizen">
        <h3>Create Your Profile</h3>
        <p style="color:#666;">Complete your profile to access MediAid services.</p>
        <ng-container *ngTemplateOutlet="profileForm"></ng-container>
      </ng-container>
      <ng-container *ngIf="!loading && citizen && editing">
        <h3>Edit Profile</h3>
        <ng-container *ngTemplateOutlet="profileForm"></ng-container>
        <button mat-button (click)="editing=false" style="margin-top:8px;">Cancel</button>
      </ng-container>
    </mat-card>

    <ng-template #profileForm>
      <form [formGroup]="form" (ngSubmit)="submit()" class="profile-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Full Name</mat-label>
          <input matInput formControlName="name">
          <mat-error>Required</mat-error>
        </mat-form-field>
        <div class="two-col">
          <mat-form-field appearance="outline">
            <mat-label>Date of Birth</mat-label>
            <input matNativeControl type="date" formControlName="dob">
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Gender</mat-label>
            <mat-select formControlName="gender">
              <mat-option value="MALE">Male</mat-option>
              <mat-option value="FEMALE">Female</mat-option>
              <mat-option value="OTHER">Other</mat-option>
            </mat-select>
            <mat-error>Required</mat-error>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Contact (10-digit phone)</mat-label>
          <input matInput formControlName="contactInfo" maxlength="10">
          <mat-error>Valid 10-digit number required</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Address</mat-label>
          <textarea matInput formControlName="address" rows="3" maxlength="500"></textarea>
          <mat-error>Required</mat-error>
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit" [disabled]="saving">
          {{ saving ? 'Saving...' : (citizen ? 'Update Profile' : 'Create Profile') }}
        </button>
      </form>
    </ng-template>
  `,
  styles: [`
    .page-title { margin: 0 0 20px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .profile-card { padding: 28px; max-width: 700px; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .profile-header { display: flex; align-items: center; gap: 18px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .avatar { font-size: 64px; height: 64px; width: 64px; color: #818cf8; }
    .profile-header h3 { margin: 0 0 8px; font-size: 1.3rem; color: #f1f5f9; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .info-item { display: flex; flex-direction: column; gap: 4px; }
    .info-item.full { grid-column: span 2; }
    .label { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .profile-form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .two-col mat-form-field { width: 100%; }
    h3 { color: #f1f5f9 !important; margin: 0 0 16px; }
    p { color: rgba(255,255,255,0.45) !important; }
    input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.6); cursor: pointer; }
    textarea { color: #f1f5f9 !important; }
  `]
})
export class CitizenProfileComponent implements OnInit {
  citizen: any = null;
  loading = true;
  saving = false;
  editing = false;

  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', Validators.required],
    dob: ['', Validators.required],
    gender: ['', Validators.required],
    contactInfo: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    address: ['', Validators.required]
  });

  constructor(private citizenSvc: CitizenService, private auth: AuthService, private toastr: ToastrService) {}

  ngOnInit() {
    const userId = Number(this.auth.getUserId());
    this.citizenSvc.getCitizen(userId).subscribe({
      next: r => { this.loading = false; if (r.data) this.citizen = r.data; },
      error: () => { this.loading = false; }
    });
  }

  startEdit() {
    this.editing = true;
    const patch = { ...this.citizen };
    // Convert dob from dd-MM-yyyy (stored) back to YYYY-MM-DD (date input)
    if (patch.dob && patch.dob.includes('-') && patch.dob.indexOf('-') === 2) {
      const [d, m, y] = patch.dob.split('-');
      patch.dob = `${y}-${m}-${d}`;
    }
    this.form.patchValue(patch);
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const userId = Number(this.auth.getUserId());
    const raw = this.form.value as any;
    // Convert dob from YYYY-MM-DD (HTML date input) to dd-MM-yyyy (backend format)
    if (raw.dob && raw.dob.includes('-') && raw.dob.indexOf('-') === 4) {
      const [y, m, d] = raw.dob.split('-');
      raw.dob = `${d}-${m}-${y}`;
    }
    const isUpdate = !!this.citizen;
    const obs = this.citizen
      ? this.citizenSvc.updateCitizen(userId, raw)
      : this.citizenSvc.createCitizen(raw);
    obs.subscribe({
      next: r => {
        this.saving = false;
        this.citizen = r.data;
        this.editing = false;
        this.toastr.success(isUpdate ? 'Profile updated!' : 'Profile created!');
      },
      error: () => { this.saving = false; }
    });
  }
}
