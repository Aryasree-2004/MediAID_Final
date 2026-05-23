import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { ToastrService } from 'ngx-toastr';
import { ClaimService } from '../../core/services/claim.service';
import { SchemeService } from '../../core/services/scheme.service';
import { CitizenService } from '../../core/services/citizen.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-citizen-claims',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatProgressSpinnerModule, MatExpansionModule, StatusBadgeComponent],
  template: `
    <h2 class="page-title">My Claims</h2>

    <!-- No Profile Banner -->
    <div class="no-profile-banner" *ngIf="!profileLoading && !hasProfile">
      <mat-icon>account_circle</mat-icon>
      <div>
        <strong>Profile Required</strong>
        <p>You need to create your citizen profile before you can submit claims.</p>
      </div>
      <a mat-flat-button color="primary" routerLink="/citizen/profile">Create Profile</a>
    </div>

    <!-- Pending Approval Banner -->
    <div class="pending-banner" *ngIf="!profileLoading && hasProfile && citizenStatus === 'PENDING'">
      <mat-icon>hourglass_top</mat-icon>
      <div>
        <strong>Profile Pending Approval</strong>
        <p>Your citizen profile is awaiting officer verification. You can submit claims once your profile is approved.</p>
      </div>
    </div>

    <!-- Rejected Banner -->
    <div class="rejected-banner" *ngIf="!profileLoading && hasProfile && citizenStatus === 'REJECTED'">
      <mat-icon>cancel</mat-icon>
      <div>
        <strong>Profile Rejected</strong>
        <p>Your citizen profile was rejected. Please update your profile and contact support.</p>
      </div>
      <a mat-flat-button color="warn" routerLink="/citizen/profile">Update Profile</a>
    </div>

    <mat-card class="page-card" style="background:#1a2235;color:#f1f5f9" *ngIf="!profileLoading && hasProfile && citizenStatus === 'VERIFIED'">
      <div class="toolbar">
        <span>{{ claims.length }} claim(s)</span>
        <button mat-flat-button color="primary" (click)="showDialog=true; claimForm.reset()">
          <mat-icon>add</mat-icon> Submit Claim
        </button>
      </div>
      <div class="center" *ngIf="loading"><mat-spinner diameter="40"></mat-spinner></div>
      <mat-accordion *ngIf="!loading && claims.length">
          <mat-expansion-panel *ngFor="let c of claims" class="claim-panel" style="background:#1f2a42">
          <mat-expansion-panel-header>
            <mat-panel-title>Claim #{{ c.claimId }} — ₹{{ c.claimAmount | number:'1.0-0' }}</mat-panel-title>
            <mat-panel-description>
              <app-status-badge [status]="c.status"></app-status-badge>
            </mat-panel-description>
          </mat-expansion-panel-header>
          <div class="claim-detail">
            <div class="detail-row"><span class="label">Scheme</span><span>{{ schemeName(c.schemeId) }}</span></div>
            <div class="detail-row"><span class="label">Date</span><span>{{ c.claimDate | date:'mediumDate' }}</span></div>
            <div class="detail-row"><span class="label">Description</span><span>{{ c.description || '—' }}</span></div>
          </div>
          <div class="upload-section">
            <b>Documents</b>
            <label class="upload-btn">
              <mat-icon>attach_file</mat-icon> Attach Document
              <input type="file" (change)="uploadDoc($event, c.claimId)" hidden>
            </label>
            <div *ngIf="claimDocs[c.claimId]" class="docs-list">
              <div *ngFor="let d of claimDocs[c.claimId]" class="doc-item">{{ d.fileName }}</div>
            </div>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
      <p *ngIf="!loading && !claims.length" class="empty">No claims submitted yet.</p>
    </mat-card>
    <div class="center" *ngIf="profileLoading"><mat-spinner diameter="40"></mat-spinner></div>

    <div class="dialog-overlay" *ngIf="showDialog">
        <mat-card class="dialog-card" style="background:#1f2a42;color:#f1f5f9">
        <h3>Submit a Claim</h3>
        <form [formGroup]="claimForm" (ngSubmit)="submitClaim()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Scheme</mat-label>
            <mat-select formControlName="schemeId">
              <mat-option *ngFor="let s of schemes" [value]="s.schemeId">{{ s.name }}</mat-option>
            </mat-select>
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Claim Amount (₹)</mat-label>
            <input matInput formControlName="claimAmount" type="number" min="1">
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description (optional)</mat-label>
            <textarea matInput formControlName="description" rows="3" maxlength="500"></textarea>
          </mat-form-field>
          <div class="dialog-actions">
            <button mat-button type="button" (click)="showDialog=false">Cancel</button>
            <button mat-flat-button color="primary" type="submit">Submit</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-title { margin: 0 0 20px; font-size: 1.6rem; font-weight: 800; color: #f1f5f9; }
    .page-card { padding: 24px; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .toolbar span { color: rgba(255,255,255,0.5); font-size: 13px; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .full-width { width: 100%; }
    .empty { color: rgba(255,255,255,0.3); padding: 20px 0; font-size: 14px; }
    .claim-panel { margin-bottom: 8px; }
    .claim-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
    .detail-row { display: flex; flex-direction: column; gap: 2px; }
    .label { font-size: 11px; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
    .upload-section { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .upload-btn {
      display: flex; align-items: center; gap: 6px;
      background: rgba(99,102,241,0.15); color: #818cf8;
      border: 1px solid rgba(99,102,241,0.3); padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600;
    }
    .docs-list { display: flex; gap: 8px; flex-wrap: wrap; }
    .doc-item { background: rgba(99,102,241,0.1); color: rgba(255,255,255,0.6); padding: 3px 10px; border-radius: 20px; font-size: 12px; border: 1px solid rgba(99,102,241,0.2); }
    .dialog-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 200;
      backdrop-filter: blur(4px);
    }
    .dialog-card { width: 460px; padding: 28px; }
    .dialog-card h3 { margin: 0 0 20px; color: #f1f5f9; font-size: 1.1rem; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .no-profile-banner {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
      background: linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.08));
      border: 1px solid rgba(245,158,11,0.35); border-radius: 14px;
      padding: 24px 28px; margin-bottom: 24px;
    }
    .no-profile-banner mat-icon { font-size: 42px; height: 42px; width: 42px; color: #f59e0b; flex-shrink: 0; }
    .no-profile-banner strong { display: block; color: #fbbf24; font-size: 16px; margin-bottom: 4px; }
    .no-profile-banner p { margin: 0; color: rgba(255,255,255,0.55); font-size: 13px; }
    .no-profile-banner a { margin-left: auto; flex-shrink: 0; }
    .pending-banner {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
      background: linear-gradient(135deg, rgba(99,102,241,0.12), rgba(79,70,229,0.08));
      border: 1px solid rgba(99,102,241,0.35); border-radius: 14px;
      padding: 24px 28px; margin-bottom: 24px;
    }
    .pending-banner mat-icon { font-size: 42px; height: 42px; width: 42px; color: #818cf8; flex-shrink: 0; }
    .pending-banner strong { display: block; color: #a5b4fc; font-size: 16px; margin-bottom: 4px; }
    .pending-banner p { margin: 0; color: rgba(255,255,255,0.55); font-size: 13px; }
    .rejected-banner {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
      background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.08));
      border: 1px solid rgba(239,68,68,0.35); border-radius: 14px;
      padding: 24px 28px; margin-bottom: 24px;
    }
    .rejected-banner mat-icon { font-size: 42px; height: 42px; width: 42px; color: #f87171; flex-shrink: 0; }
    .rejected-banner strong { display: block; color: #fca5a5; font-size: 16px; margin-bottom: 4px; }
    .rejected-banner p { margin: 0; color: rgba(255,255,255,0.55); font-size: 13px; }
    .rejected-banner a { margin-left: auto; flex-shrink: 0; }
  `]
})
export class CitizenClaimsComponent implements OnInit {
  claims: any[] = [];
  schemes: any[] = [];
  claimDocs: Record<number, any[]> = {};
  loading = true;
  profileLoading = true;
  hasProfile = false;
  citizenStatus = '';
  showDialog = false;

  private fb = inject(FormBuilder);
  claimForm = this.fb.group({
    schemeId: [null, Validators.required],
    claimAmount: [null, [Validators.required, Validators.min(1)]],
    description: ['']
  });

  constructor(
    private claimSvc: ClaimService,
    private schemeSvc: SchemeService,
    private citizenSvc: CitizenService,
    private auth: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const userId = Number(this.auth.getUserId());
    this.citizenSvc.getCitizen(userId).subscribe({
      next: r => {
        this.profileLoading = false;
        this.hasProfile = !!(r.data);
        this.citizenStatus = r.data?.status || '';
        if (this.citizenStatus === 'VERIFIED') {
          this.load();
          this.schemeSvc.getAll().subscribe(r2 => { if (r2.data) this.schemes = r2.data; });
        }
      },
      error: () => {
        this.profileLoading = false;
        this.hasProfile = false;
      }
    });
  }

  load() {
    this.loading = true;
    this.claimSvc.getMy().subscribe({
      next: r => { this.loading = false; if (r.data) this.claims = r.data; },
      error: () => { this.loading = false; }
    });
  }

  schemeName(id: number) { return this.schemes.find(s => s.schemeId === id)?.name || `Scheme #${id}`; }

  submitClaim() {
    if (this.claimForm.invalid) { this.claimForm.markAllAsTouched(); return; }
    this.claimSvc.create(this.claimForm.value as any).subscribe({
      next: () => { this.toastr.success('Claim submitted!'); this.showDialog = false; this.load(); }
    });
  }

  uploadDoc(event: Event, claimId: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.claimSvc.uploadDocument(claimId, file).subscribe({
      next: () => {
        this.toastr.success('Document uploaded!');
        this.claimSvc.getDocuments(claimId).subscribe(r => { if (r.data) this.claimDocs[claimId] = r.data; });
      }
    });
  }
}
