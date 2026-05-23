import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- ═══════════ NAVBAR ═══════════ -->
    <nav class="home-nav">
      <div class="nav-inner">
        <a routerLink="/" class="nav-brand">
          <div class="brand-logo">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1v16M1 9h16" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
          <span>MediAid</span>
        </a>
        <div class="nav-links">
          <a href="#features" class="nav-link">Features</a>
          <a href="#how-it-works" class="nav-link">How It Works</a>
          <a href="#about" class="nav-link">About</a>
        </div>
        <div class="nav-actions">
          <a routerLink="/auth/login" class="btn-outline">Sign In</a>
          <a routerLink="/auth/register" class="btn-solid">Get Started &rarr;</a>
        </div>
      </div>
    </nav>

    <!-- ═══════════ HERO ═══════════ -->
    <section class="hero">
      <!-- Animated background grid -->
      <div class="hero-grid"></div>
      <!-- Glowing orbs -->
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
      <div class="orb orb3"></div>
      <!-- Floating particles -->
      <div class="particles">
        <span *ngFor="let p of particles" class="particle"
          [style.left]="p.x + '%'" [style.top]="p.y + '%'"
          [style.width]="p.size + 'px'" [style.height]="p.size + 'px'"
          [style.animation-delay]="p.delay + 's'" [style.animation-duration]="p.dur + 's'">
        </span>
      </div>

      <div class="hero-content">
        <div class="hero-text">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Government Healthcare Initiative &bull; Est. 2024
          </div>
          <h1 class="hero-title">
            Your Health,<br>
            <span class="gradient-text">Our Priority</span>
          </h1>
          <p class="hero-subtitle">
            MediAid bridges citizens with life-saving government healthcare schemes.
            Register once, enroll in programs, file claims &amp; track every benefit
            &mdash; securely, transparently, instantly.
          </p>
          <div class="hero-cta">
            <a routerLink="/auth/register" class="cta-primary">
              Register Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </a>
            <a routerLink="/auth/login" class="cta-ghost">Sign In to Portal</a>
          </div>
          <div class="hero-trust">
            <div class="trust-pill">
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1l1.8 3.9L13 5.7l-3 3 .7 4.3L7 11l-3.7 2 .7-4.3-3-3 4.2-.8z" fill="#ffd600"/></svg>
              50,000+ Citizens Enrolled
            </div>
            <div class="trust-pill">
              <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1l4 1.8v4C11 10 7 13 7 13S3 10 3 6.8v-4z" fill="none" stroke="#4ade80" stroke-width="1.5"/><path d="M5 7l1.5 1.5L9 5" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round"/></svg>
              ISO-Certified Security
            </div>
            <div class="trust-pill">
              <svg width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="none" stroke="#60a5fa" stroke-width="1.5"/><path d="M7 4v3l2 2" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/></svg>
              24/7 Support
            </div>
          </div>
        </div>

        <!-- Dashboard Mockup -->
        <div class="hero-visual">
          <div class="mockup-glow"></div>
          <div class="mockup-card">
            <div class="mockup-topbar">
              <div class="mockup-dots"><span></span><span></span><span></span></div>
              <div class="mockup-url">mediaid.gov.in/dashboard</div>
              <div class="mockup-status">
                <span class="status-dot-green"></span> Live
              </div>
            </div>
            <div class="mockup-body">
              <div class="mockup-heading">Welcome back, Priya</div>
              <div class="mockup-stats-row">
                <div class="m-stat blue">
                  <div class="m-stat-num">4</div>
                  <div class="m-stat-lbl">Enrollments</div>
                </div>
                <div class="m-stat green">
                  <div class="m-stat-num">₹1.2L</div>
                  <div class="m-stat-lbl">Disbursed</div>
                </div>
                <div class="m-stat amber">
                  <div class="m-stat-num">2</div>
                  <div class="m-stat-lbl">Pending</div>
                </div>
              </div>
              <div class="mockup-label">Active Schemes</div>
              <div class="mockup-scheme-list">
                <div class="mockup-scheme" *ngFor="let s of mockSchemes">
                  <div class="scheme-icon" [style.background]="s.color">
                    <span class="material-icons">{{ s.icon }}</span>
                  </div>
                  <div class="scheme-info">
                    <div class="scheme-name">{{ s.name }}</div>
                    <div class="scheme-bar-wrap">
                      <div class="scheme-bar" [style.width]="s.pct + '%'" [style.background]="s.color"></div>
                    </div>
                  </div>
                  <div class="scheme-badge" [style.color]="s.color">{{ s.status }}</div>
                </div>
              </div>
              <div class="mockup-notification">
                <span class="material-icons notif-icon">notifications_active</span>
                <div>
                  <div class="notif-title">Claim #1042 Approved</div>
                  <div class="notif-sub">₹24,500 will be disbursed within 48 hours</div>
                </div>
              </div>
            </div>
          </div>
          <!-- Floating badges -->
          <div class="float-badge f1">
            <span class="material-icons" style="color:#4ade80;font-size:18px">check_circle</span>
            <div><div class="fb-val">₹48,500</div><div class="fb-lbl">Approved Today</div></div>
          </div>
          <div class="float-badge f2">
            <span class="material-icons" style="color:#60a5fa;font-size:18px">people</span>
            <div><div class="fb-val">50K+</div><div class="fb-lbl">Citizens</div></div>
          </div>
        </div>
      </div>

      <div class="hero-wave">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,45 C240,90 480,0 720,45 C960,90 1200,0 1440,45 L1440,90 L0,90 Z" fill="#0f172a"/>
        </svg>
      </div>
    </section>

    <!-- ═══════════ STATS MARQUEE ═══════════ -->
    <section class="marquee-section">
      <div class="marquee-track">
        <div class="marquee-inner" *ngFor="let _ of [1,2]">
          <div class="marquee-item" *ngFor="let s of marqueeItems">
            <span class="material-icons" [style.color]="s.color">{{ s.icon }}</span>
            <strong>{{ s.val }}</strong>
            <span>{{ s.label }}</span>
            <span class="marquee-divider">✦</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ STATS CARDS ═══════════ -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card" *ngFor="let s of stats">
            <div class="stat-top">
              <div class="stat-icon-wrap" [style.background]="s.grad">
                <span class="material-icons">{{ s.icon }}</span>
              </div>
              <div class="stat-trend up">
                <span class="material-icons">trending_up</span> +{{ s.trend }}%
              </div>
            </div>
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
            <div class="stat-bar-bg">
              <div class="stat-bar-fill" [style.width]="s.fill + '%'" [style.background]="s.grad"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ FEATURES ═══════════ -->
    <section class="features-section" id="features">
      <!-- Background shapes -->
      <div class="bg-blob bl1"></div>
      <div class="bg-blob bl2"></div>
      <div class="container" style="position:relative;z-index:1">
        <div class="section-header">
          <div class="section-eyebrow">
            <span class="material-icons">star</span> Core Features
          </div>
          <h2>Everything You Need, <span class="hl">In One Place</span></h2>
          <p>From registration to disbursement, MediAid manages the complete healthcare aid lifecycle — securely and transparently.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" *ngFor="let f of features; let i = index" [attr.data-index]="i">
            <div class="fc-top">
              <div class="fc-icon" [style.background]="f.bg">
                <span class="material-icons" [style.color]="f.color">{{ f.icon }}</span>
              </div>
              <span class="fc-number">0{{ i+1 }}</span>
            </div>
            <h3>{{ f.title }}</h3>
            <p>{{ f.desc }}</p>
            <div class="fc-footer" [style.color]="f.color">
              Learn more <span class="material-icons" style="font-size:14px;vertical-align:middle">arrow_forward</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ HOW IT WORKS ═══════════ -->
    <section class="how-section" id="how-it-works">
      <div class="container">
        <div class="section-header">
          <div class="section-eyebrow">
            <span class="material-icons">route</span> Simple Process
          </div>
          <h2>Four Steps to <span class="hl">Healthcare Aid</span></h2>
          <p>Get enrolled and start receiving benefits in as little as 72 hours</p>
        </div>
        <div class="steps-wrap">
          <div class="steps-connector"></div>
          <div class="steps-grid">
            <div class="step-card" *ngFor="let step of steps; let i = index">
              <div class="step-badge">
                <div class="step-num-ring">
                  <svg width="64" height="64" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(99,102,241,0.25)" stroke-width="2" stroke-dasharray="175" [attr.stroke-dashoffset]="175 - (i+1)*40"/>
                    <circle cx="32" cy="32" r="28" fill="none" [attr.stroke]="stepColors[i]" stroke-width="2.5" stroke-dasharray="175" [attr.stroke-dashoffset]="175 - (i+1)*40" style="transition: all 1s"/>
                  </svg>
                  <span class="step-n">{{ i+1 }}</span>
                </div>
              </div>
              <div class="step-icon-wrap" [style.background]="stepColors[i] + '22'">
                <span class="material-icons" [style.color]="stepColors[i]">{{ step.icon }}</span>
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ ABOUT / MISSION ═══════════ -->
    <section class="about-section" id="about">
      <div class="about-bg-grid"></div>
      <div class="container about-grid" style="position:relative;z-index:1">
        <div class="about-visual">
          <div class="about-card-outer">
            <div class="about-ring about-ring-1"></div>
            <div class="about-ring about-ring-2"></div>
            <div class="about-main-card">
              <svg width="260" height="200" viewBox="0 0 260 200" fill="none">
                <!-- Hospital -->
                <rect x="50" y="70" width="160" height="115" rx="6" fill="#1e293b"/>
                <rect x="70" y="48" width="120" height="34" rx="6" fill="#1565c0"/>
                <!-- Cross -->
                <rect x="116" y="57" width="28" height="8" rx="4" fill="white" fill-opacity="0.9"/>
                <rect x="126" y="50" width="8" height="22" rx="4" fill="white" fill-opacity="0.9"/>
                <!-- Windows -->
                <rect x="68" y="90" width="32" height="28" rx="3" fill="#1565c0" fill-opacity="0.6"/>
                <rect x="114" y="90" width="32" height="28" rx="3" fill="#1565c0" fill-opacity="0.6"/>
                <rect x="160" y="90" width="32" height="28" rx="3" fill="#1565c0" fill-opacity="0.6"/>
                <rect x="68" y="133" width="32" height="28" rx="3" fill="#1565c0" fill-opacity="0.4"/>
                <rect x="160" y="133" width="32" height="28" rx="3" fill="#1565c0" fill-opacity="0.4"/>
                <!-- Door -->
                <rect x="108" y="148" width="44" height="37" rx="3" fill="#0d2a6b"/>
                <circle cx="144" cy="167" r="3" fill="#60a5fa"/>
                <!-- Ground line -->
                <rect x="30" y="185" width="200" height="3" rx="1.5" fill="#1565c0" fill-opacity="0.3"/>
                <!-- People -->
                <circle cx="30" cy="158" r="9" fill="#1e3a5f"/>
                <circle cx="30" cy="151" r="5" fill="#60a5fa"/>
                <path d="M23 168 Q30 161 37 168" fill="#60a5fa" fill-opacity="0.5"/>
                <circle cx="230" cy="158" r="9" fill="#1e3a5f"/>
                <circle cx="230" cy="151" r="5" fill="#4ade80"/>
                <path d="M223 168 Q230 161 237 168" fill="#4ade80" fill-opacity="0.5"/>
                <!-- Stars -->
                <circle cx="20" cy="40" r="2" fill="#fbbf24"/>
                <circle cx="240" cy="30" r="2" fill="#60a5fa"/>
                <circle cx="245" cy="100" r="1.5" fill="#a78bfa"/>
                <circle cx="15" cy="120" r="1.5" fill="#34d399"/>
              </svg>
              <div class="about-card-stats">
                <div class="acs-item">
                  <div class="acs-val">50K+</div>
                  <div class="acs-lbl">Citizens</div>
                </div>
                <div class="acs-divider"></div>
                <div class="acs-item">
                  <div class="acs-val">120+</div>
                  <div class="acs-lbl">Schemes</div>
                </div>
                <div class="acs-divider"></div>
                <div class="acs-item">
                  <div class="acs-val">₹2.4Cr</div>
                  <div class="acs-lbl">Disbursed</div>
                </div>
              </div>
            </div>
            <div class="about-float-badge">
              <span class="material-icons" style="color:#fbbf24">star</span>
              <div>
                <div class="fb-val2">98.6%</div>
                <div class="fb-lbl2">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        <div class="about-text">
          <div class="section-eyebrow">
            <span class="material-icons">info</span> Our Mission
          </div>
          <h2>Bridging Citizens with <span class="hl">Healthcare Benefits</span></h2>
          <p class="about-lead">MediAid is a government-backed digital platform that eliminates complexity around healthcare scheme enrollment, claim processing, and disbursement.</p>
          <p class="about-body">We believe every citizen deserves transparent, efficient, and dignified access to healthcare support. Our system cuts paperwork, removes middlemen, and puts control in your hands.</p>
          <div class="about-pillars">
            <div class="pillar" *ngFor="let p of pillars">
              <div class="pillar-icon" [style.background]="p.bg">
                <span class="material-icons" [style.color]="p.color">{{ p.icon }}</span>
              </div>
              <div>
                <div class="pillar-title">{{ p.title }}</div>
                <div class="pillar-desc">{{ p.desc }}</div>
              </div>
            </div>
          </div>
          <a routerLink="/auth/register" class="about-cta">
            Get Started Today
            <span class="material-icons">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ═══════════ TESTIMONIALS ═══════════ -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header">
          <div class="section-eyebrow">
            <span class="material-icons">forum</span> Citizens Speak
          </div>
          <h2>Trusted Across <span class="hl">India</span></h2>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card" *ngFor="let t of testimonials">
            <div class="tc-stars">
              <span *ngFor="let s of [1,2,3,4,5]" class="material-icons star">star</span>
            </div>
            <p class="tc-text">"{{ t.text }}"</p>
            <div class="tc-author">
              <div class="tc-avatar" [style.background]="t.color">{{ t.name[0] }}</div>
              <div>
                <div class="tc-name">{{ t.name }}</div>
                <div class="tc-loc">{{ t.loc }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ CTA ═══════════ -->
    <section class="cta-section">
      <div class="cta-orb cta-orb1"></div>
      <div class="cta-orb cta-orb2"></div>
      <div class="container cta-inner" style="position:relative;z-index:1">
        <div class="cta-icon-ring">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2v24M2 14h24" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h2>Ready to Access Your Benefits?</h2>
        <p>Join 50,000+ citizens already using MediAid to manage their healthcare aid online.</p>
        <div class="cta-buttons">
          <a routerLink="/auth/register" class="cta-btn-primary">
            Create Free Account &rarr;
          </a>
          <a routerLink="/auth/login" class="cta-btn-outline">Sign In</a>
        </div>
        <div class="cta-badges">
          <div class="cta-badge" *ngFor="let b of ctaBadges">
            <span class="material-icons">{{ b.icon }}</span> {{ b.text }}
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════ FOOTER ═══════════ -->
    <footer class="footer">
      <div class="footer-top">
        <div class="container footer-grid">
          <div class="footer-brand-col">
            <div class="footer-brand">
              <div class="f-logo">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1v14M1 8h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
                </svg>
              </div>
              MediAid
            </div>
            <p class="footer-tagline">Bridging citizens with government healthcare — securely, transparently, instantly.</p>
            <div class="footer-socials">
              <a class="social-btn" href="#"><span class="material-icons">language</span></a>
              <a class="social-btn" href="#"><span class="material-icons">email</span></a>
              <a class="social-btn" href="#"><span class="material-icons">phone</span></a>
            </div>
          </div>
          <div class="footer-links-col" *ngFor="let col of footerLinks">
            <div class="footer-col-title">{{ col.title }}</div>
            <a class="footer-link" *ngFor="let l of col.links" [routerLink]="l['route'] || null" [href]="l['href'] || null">{{ l.label }}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <span>&copy; 2025 MediAid. Government Healthcare Aid Portal. All rights reserved.</span>
          <div class="footer-badges">
            <span class="f-badge">🔒 SSL Secured</span>
            <span class="f-badge">🇮🇳 Made in India</span>
            <span class="f-badge">✅ CERT-In Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    :host { display: block; font-family: 'Inter', 'Roboto', sans-serif; background: #0f172a; }
    .container { max-width: 1160px; margin: 0 auto; padding: 0 24px; }

    /* ══════ NAVBAR ══════ */
    .home-nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      background: rgba(8, 16, 40, 0.92); backdrop-filter: blur(16px) saturate(180%);
      border-bottom: 1px solid rgba(99,102,241,0.15);
    }
    .nav-inner {
      max-width: 1160px; margin: 0 auto; padding: 0 24px;
      height: 68px; display: flex; align-items: center; gap: 32px;
    }
    .nav-brand {
      display: flex; align-items: center; gap: 10px; text-decoration: none;
      font-size: 1.3rem; font-weight: 800; color: white; letter-spacing: -0.3px;
      flex-shrink: 0;
    }
    .brand-logo {
      width: 34px; height: 34px; background: linear-gradient(135deg, #6366f1, #818cf8);
      border-radius: 9px; display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 14px rgba(99,102,241,0.5);
    }
    .nav-links { display: flex; gap: 2px; flex: 1; }
    .nav-link {
      color: rgba(255,255,255,0.65); text-decoration: none; padding: 7px 14px;
      border-radius: 8px; font-size: 14px; font-weight: 500; transition: all 0.18s;
    }
    .nav-link:hover { color: white; background: rgba(99,102,241,0.15); }
    .nav-actions { display: flex; gap: 10px; align-items: center; flex-shrink: 0; }
    .btn-outline {
      color: rgba(255,255,255,0.8); text-decoration: none; padding: 8px 18px;
      border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; font-size: 14px;
      font-weight: 500; transition: all 0.18s;
    }
    .btn-outline:hover { color: white; border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.1); }
    .btn-solid {
      color: white; text-decoration: none; padding: 9px 20px;
      background: linear-gradient(135deg, #6366f1, #4f46e5); border-radius: 8px;
      font-size: 14px; font-weight: 700; transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(99,102,241,0.4);
    }
    .btn-solid:hover { background: linear-gradient(135deg, #818cf8, #6366f1); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.5); }

    /* ══════ HERO ══════ */
    .hero {
      min-height: 100vh; padding-top: 68px;
      background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.25) 0%, transparent 70%),
                  radial-gradient(ellipse 60% 50% at 80% 60%, rgba(14,165,233,0.12) 0%, transparent 70%),
                  linear-gradient(180deg, #060d1f 0%, #0a1428 50%, #0f172a 100%);
      position: relative; overflow: hidden; display: flex; flex-direction: column;
    }
    /* Grid overlay */
    .hero-grid {
      position: absolute; inset: 0; z-index: 0;
      background-image:
        linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.5) 80%, transparent 100%);
    }
    /* Glowing orbs */
    .orb {
      position: absolute; border-radius: 50%; filter: blur(80px); z-index: 0;
      animation: orb-drift 8s ease-in-out infinite;
    }
    .orb1 { width: 500px; height: 500px; background: rgba(99,102,241,0.15); top: -200px; left: -100px; animation-delay: 0s; }
    .orb2 { width: 400px; height: 400px; background: rgba(14,165,233,0.1); top: 100px; right: -100px; animation-delay: -3s; }
    .orb3 { width: 300px; height: 300px; background: rgba(139,92,246,0.1); bottom: 0; left: 40%; animation-delay: -6s; }
    @keyframes orb-drift { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-30px); } }
    /* Particles */
    .particles { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
    .particle {
      position: absolute; border-radius: 50%;
      background: rgba(148,163,184,0.4);
      animation: particle-float linear infinite;
    }
    @keyframes particle-float {
      0%   { transform: translateY(0) scale(1);   opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.3; }
      100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
    }

    .hero-content {
      flex: 1; position: relative; z-index: 1;
      max-width: 1160px; margin: 0 auto; padding: 80px 24px 60px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
    }
    .hero-text { display: flex; flex-direction: column; gap: 22px; }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3);
      color: #a5b4fc; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;
      padding: 6px 14px; border-radius: 20px; width: fit-content;
    }
    .badge-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #6366f1;
      box-shadow: 0 0 6px rgba(99,102,241,0.8);
      animation: pulse-dot 2s ease-in-out infinite;
    }
    @keyframes pulse-dot { 0%,100% { box-shadow: 0 0 6px rgba(99,102,241,0.8); } 50% { box-shadow: 0 0 14px rgba(99,102,241,1), 0 0 24px rgba(99,102,241,0.5); } }
    .hero-title {
      font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 800; color: white;
      line-height: 1.1; letter-spacing: -1.5px;
    }
    .gradient-text {
      background: linear-gradient(135deg, #818cf8, #38bdf8, #34d399);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .hl {
      background: linear-gradient(135deg, #818cf8, #38bdf8);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .hero-subtitle { font-size: 1.05rem; color: rgba(255,255,255,0.6); line-height: 1.75; max-width: 480px; }
    .hero-cta { display: flex; gap: 12px; flex-wrap: wrap; }
    .cta-primary {
      display: inline-flex; align-items: center; gap: 8px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px;
      font-size: 15px; font-weight: 700; transition: all 0.25s;
      box-shadow: 0 4px 24px rgba(99,102,241,0.5);
    }
    .cta-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(99,102,241,0.65); }
    .cta-ghost {
      display: inline-flex; align-items: center; color: rgba(255,255,255,0.75);
      text-decoration: none; padding: 14px 28px; border-radius: 12px;
      font-size: 15px; font-weight: 600;
      border: 1px solid rgba(255,255,255,0.2); transition: all 0.25s;
    }
    .cta-ghost:hover { color: white; border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }
    .hero-trust { display: flex; gap: 10px; flex-wrap: wrap; }
    .trust-pill {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.6); padding: 5px 12px; border-radius: 20px;
      font-size: 12px; font-weight: 500;
    }

    /* Mockup */
    .hero-visual { position: relative; display: flex; justify-content: center; align-items: center; }
    .mockup-glow {
      position: absolute; inset: -40px; z-index: 0; border-radius: 24px;
      background: radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%);
    }
    .mockup-card {
      background: linear-gradient(145deg, #0f1a2e, #162034);
      border: 1px solid rgba(99,102,241,0.25); border-radius: 18px;
      width: 340px; box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset;
      position: relative; z-index: 1; overflow: hidden;
    }
    .mockup-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent);
    }
    .mockup-topbar {
      display: flex; align-items: center; gap: 8px; padding: 12px 16px;
      background: rgba(99,102,241,0.08); border-bottom: 1px solid rgba(99,102,241,0.12);
    }
    .mockup-dots { display: flex; gap: 5px; }
    .mockup-dots span { width: 9px; height: 9px; border-radius: 50%; }
    .mockup-dots span:nth-child(1) { background: #ff5f56; }
    .mockup-dots span:nth-child(2) { background: #ffbd2e; }
    .mockup-dots span:nth-child(3) { background: #27c93f; }
    .mockup-url { flex: 1; text-align: center; font-size: 10px; color: rgba(255,255,255,0.35); }
    .mockup-status { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #4ade80; }
    .status-dot-green { width: 6px; height: 6px; border-radius: 50%; background: #4ade80; animation: blink 2s infinite; }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
    .mockup-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
    .mockup-heading { color: white; font-size: 13px; font-weight: 600; }
    .mockup-stats-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .m-stat {
      background: rgba(255,255,255,0.05); border-radius: 10px; padding: 10px 8px;
      text-align: center; border: 1px solid rgba(255,255,255,0.07);
    }
    .m-stat.blue  { border-color: rgba(96,165,250,0.2); }
    .m-stat.green { border-color: rgba(74,222,128,0.2); }
    .m-stat.amber { border-color: rgba(251,191,36,0.2); }
    .m-stat-num { font-weight: 800; font-size: 1rem; color: white; }
    .m-stat.blue  .m-stat-num { color: #60a5fa; }
    .m-stat.green .m-stat-num { color: #4ade80; }
    .m-stat.amber .m-stat-num { color: #fbbf24; }
    .m-stat-lbl { font-size: 10px; color: rgba(255,255,255,0.4); margin-top: 3px; }
    .mockup-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.35); letter-spacing: 0.8px; text-transform: uppercase; }
    .mockup-scheme-list { display: flex; flex-direction: column; gap: 8px; }
    .mockup-scheme { display: flex; align-items: center; gap: 8px; }
    .scheme-icon {
      width: 26px; height: 26px; border-radius: 7px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .scheme-icon .material-icons { font-size: 14px; color: white; }
    .scheme-info { flex: 1; }
    .scheme-name { font-size: 11px; color: rgba(255,255,255,0.7); margin-bottom: 4px; }
    .scheme-bar-wrap { background: rgba(255,255,255,0.08); border-radius: 3px; height: 4px; overflow: hidden; }
    .scheme-bar { height: 100%; border-radius: 3px; transition: width 1s ease; }
    .scheme-badge { font-size: 10px; font-weight: 700; }
    .mockup-notification {
      display: flex; align-items: flex-start; gap: 8px;
      background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.2);
      border-radius: 10px; padding: 10px 12px;
    }
    .notif-icon { font-size: 16px; color: #4ade80; flex-shrink: 0; margin-top: 1px; }
    .notif-title { font-size: 11px; font-weight: 700; color: #4ade80; }
    .notif-sub { font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 2px; }

    /* Floating badges */
    .float-badge {
      position: absolute; background: linear-gradient(135deg, #0f1a2e, #1a2744);
      border: 1px solid rgba(99,102,241,0.3); border-radius: 14px;
      padding: 10px 16px; display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5); z-index: 2;
    }
    .f1 { top: -16px; right: -32px; animation: floatY 3s ease-in-out infinite; }
    .f2 { bottom: -16px; left: -32px; animation: floatY 3.5s ease-in-out infinite reverse; }
    @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    .fb-val { font-size: 15px; font-weight: 800; color: white; }
    .fb-lbl { font-size: 11px; color: rgba(255,255,255,0.45); }

    .hero-wave { line-height: 0; position: relative; z-index: 1; }
    .hero-wave svg { width: 100%; display: block; }

    /* ══════ MARQUEE ══════ */
    .marquee-section {
      background: #0f172a; padding: 0; overflow: hidden;
      border-top: 1px solid rgba(99,102,241,0.1);
      border-bottom: 1px solid rgba(99,102,241,0.1);
    }
    .marquee-track {
      display: flex; overflow: hidden;
      mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
    }
    .marquee-inner {
      display: flex; flex-shrink: 0; gap: 0;
      animation: marquee-scroll 30s linear infinite;
    }
    @keyframes marquee-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .marquee-item {
      display: flex; align-items: center; gap: 10px;
      padding: 18px 32px; white-space: nowrap;
      color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500;
    }
    .marquee-item strong { color: white; font-weight: 700; }
    .marquee-item .material-icons { font-size: 18px; }
    .marquee-divider { color: rgba(99,102,241,0.4); margin-left: 8px; }

    /* ══════ STATS SECTION ══════ */
    .stats-section {
      background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
      padding: 80px 0;
    }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .stat-card {
      background: linear-gradient(145deg, #141d30, #1a2540);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 16px;
      padding: 24px; transition: all 0.3s;
      position: relative; overflow: hidden;
    }
    .stat-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: var(--card-top-color, linear-gradient(90deg, #6366f1, #818cf8));
    }
    .stat-card:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.35); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
    .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .stat-icon-wrap {
      width: 46px; height: 46px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon-wrap .material-icons { color: white; font-size: 22px; }
    .stat-trend { display: flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 600; }
    .stat-trend.up { color: #4ade80; }
    .stat-trend .material-icons { font-size: 14px; }
    .stat-value { font-size: 2rem; font-weight: 800; color: white; line-height: 1; margin-bottom: 6px; }
    .stat-label { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 16px; }
    .stat-bar-bg { background: rgba(255,255,255,0.08); border-radius: 4px; height: 5px; overflow: hidden; }
    .stat-bar-fill { height: 100%; border-radius: 4px; transition: width 1.5s ease; }

    /* ══════ FEATURES ══════ */
    .features-section {
      background:
        radial-gradient(ellipse 60% 40% at 10% 30%, rgba(99,102,241,0.07) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 90% 70%, rgba(14,165,233,0.06) 0%, transparent 60%),
        linear-gradient(180deg, #111827 0%, #0f172a 100%);
      padding: 100px 0; position: relative; overflow: hidden;
    }
    .bg-blob {
      position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none;
    }
    .bl1 { width: 400px; height: 400px; background: rgba(99,102,241,0.08); top: -100px; left: -100px; }
    .bl2 { width: 350px; height: 350px; background: rgba(14,165,233,0.07); bottom: -100px; right: -50px; }
    .section-header { text-align: center; margin-bottom: 60px; }
    .section-eyebrow {
      display: inline-flex; align-items: center; gap: 7px;
      background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
      color: #a5b4fc; font-size: 12px; font-weight: 700; letter-spacing: 0.8px;
      text-transform: uppercase; padding: 6px 16px; border-radius: 20px; margin-bottom: 16px;
    }
    .section-eyebrow .material-icons { font-size: 14px; }
    .section-header h2 {
      font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 800; color: white;
      margin-bottom: 14px; letter-spacing: -0.8px; line-height: 1.2;
    }
    .section-header p { font-size: 1rem; color: rgba(255,255,255,0.5); max-width: 520px; margin: 0 auto; line-height: 1.75; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .feature-card {
      background: linear-gradient(145deg, #141d30, #1a2540);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 18px;
      padding: 28px; transition: all 0.3s; cursor: default;
      position: relative; overflow: hidden;
    }
    .feature-card::after {
      content: ''; position: absolute; inset: 0; border-radius: 18px;
      background: linear-gradient(135deg, rgba(99,102,241,0.05), transparent);
      opacity: 0; transition: opacity 0.3s;
    }
    .feature-card:hover { transform: translateY(-5px); border-color: rgba(99,102,241,0.35); box-shadow: 0 16px 50px rgba(0,0,0,0.4); }
    .feature-card:hover::after { opacity: 1; }
    .fc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
    .fc-icon {
      width: 50px; height: 50px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .fc-icon .material-icons { font-size: 24px; }
    .fc-number { font-size: 12px; font-weight: 800; color: rgba(255,255,255,0.15); letter-spacing: 1px; }
    .feature-card h3 { font-size: 1.05rem; font-weight: 700; color: white; margin-bottom: 10px; }
    .feature-card p { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.7; margin-bottom: 16px; }
    .fc-footer { font-size: 13px; font-weight: 600; cursor: pointer; }

    /* ══════ HOW IT WORKS ══════ */
    .how-section {
      background:
        radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14,165,233,0.08) 0%, transparent 60%),
        linear-gradient(180deg, #0f172a 0%, #0a1128 100%);
      padding: 100px 0; overflow: hidden;
    }
    .steps-wrap { position: relative; }
    .steps-connector {
      position: absolute; top: 52px; left: calc(12.5% + 32px); right: calc(12.5% + 32px);
      height: 2px;
      background: linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #34d399 100%);
      opacity: 0.25; z-index: 0;
    }
    .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; position: relative; z-index: 1; }
    .step-card {
      display: flex; flex-direction: column; align-items: center; text-align: center;
      padding: 32px 20px 28px;
      background: linear-gradient(145deg, #141d30, #1a2540);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 18px;
      transition: all 0.3s;
    }
    .step-card:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.35); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
    .step-badge { position: relative; width: 64px; height: 64px; margin-bottom: 16px; }
    .step-num-ring { position: relative; width: 64px; height: 64px; }
    .step-num-ring svg { position: absolute; top: 0; left: 0; transform: rotate(-90deg); }
    .step-n {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      font-size: 20px; font-weight: 800; color: white;
    }
    .step-icon-wrap {
      width: 52px; height: 52px; border-radius: 16px;
      display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
    }
    .step-icon-wrap .material-icons { font-size: 26px; }
    .step-card h3 { font-size: 1rem; font-weight: 700; color: white; margin-bottom: 10px; }
    .step-card p { font-size: 13px; color: rgba(255,255,255,0.5); line-height: 1.65; }

    /* ══════ ABOUT ══════ */
    .about-section {
      background:
        radial-gradient(ellipse 80% 60% at 0% 50%, rgba(99,102,241,0.08) 0%, transparent 60%),
        linear-gradient(180deg, #0a1128 0%, #0f172a 100%);
      padding: 100px 0; position: relative; overflow: hidden;
    }
    .about-bg-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
      background-size: 60px 60px;
    }
    .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
    .about-visual { display: flex; justify-content: center; }
    .about-card-outer { position: relative; }
    .about-ring {
      position: absolute; border-radius: 50%;
      border: 1px solid rgba(99,102,241,0.1); pointer-events: none;
    }
    .about-ring-1 { width: 380px; height: 380px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: ring-spin 20s linear infinite; }
    .about-ring-2 { width: 440px; height: 440px; top: 50%; left: 50%; transform: translate(-50%,-50%); border-style: dashed; animation: ring-spin 30s linear infinite reverse; }
    @keyframes ring-spin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
    .about-main-card {
      background: linear-gradient(145deg, #141d30, #1a2540);
      border: 1px solid rgba(99,102,241,0.2); border-radius: 20px;
      padding: 28px; position: relative; z-index: 1;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .about-card-stats { display: flex; justify-content: space-around; align-items: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.07); }
    .acs-item { text-align: center; }
    .acs-val { font-size: 1.3rem; font-weight: 800; color: white; }
    .acs-lbl { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 3px; }
    .acs-divider { width: 1px; height: 36px; background: rgba(255,255,255,0.07); }
    .about-float-badge {
      position: absolute; bottom: -20px; right: -20px; z-index: 2;
      background: linear-gradient(135deg, #1a2744, #0f1a2e);
      border: 1px solid rgba(251,191,36,0.3); border-radius: 14px;
      padding: 12px 16px; display: flex; align-items: center; gap: 10px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.5);
    }
    .fb-val2 { font-size: 16px; font-weight: 800; color: white; }
    .fb-lbl2 { font-size: 11px; color: rgba(255,255,255,0.4); }
    .about-text { display: flex; flex-direction: column; gap: 16px; }
    .about-text h2 {
      font-size: clamp(1.7rem, 2.5vw, 2.3rem); font-weight: 800; color: white; line-height: 1.25; letter-spacing: -0.5px;
    }
    .about-lead { font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.75; }
    .about-body { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.8; }
    .about-pillars { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
    .pillar { display: flex; align-items: flex-start; gap: 14px; }
    .pillar-icon {
      width: 38px; height: 38px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .pillar-icon .material-icons { font-size: 18px; }
    .pillar-title { font-size: 14px; font-weight: 700; color: white; }
    .pillar-desc { font-size: 13px; color: rgba(255,255,255,0.45); margin-top: 2px; }
    .about-cta {
      display: inline-flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white; text-decoration: none; padding: 13px 26px;
      border-radius: 10px; font-size: 15px; font-weight: 700;
      transition: all 0.25s; box-shadow: 0 4px 20px rgba(99,102,241,0.4);
      width: fit-content; margin-top: 8px;
    }
    .about-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(99,102,241,0.55); }
    .about-cta .material-icons { font-size: 18px; }

    /* ══════ TESTIMONIALS ══════ */
    .testimonials-section {
      background:
        radial-gradient(ellipse 60% 50% at 80% 50%, rgba(14,165,233,0.07) 0%, transparent 60%),
        linear-gradient(180deg, #0f172a 0%, #111827 100%);
      padding: 100px 0;
    }
    .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .testimonial-card {
      background: linear-gradient(145deg, #141d30, #1a2540);
      border: 1px solid rgba(99,102,241,0.15); border-radius: 18px;
      padding: 28px; transition: all 0.3s;
    }
    .testimonial-card:hover { transform: translateY(-4px); border-color: rgba(99,102,241,0.3); }
    .tc-stars { display: flex; gap: 3px; margin-bottom: 14px; }
    .tc-stars .star { font-size: 16px; color: #fbbf24; }
    .tc-text { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.75; margin-bottom: 20px; font-style: italic; }
    .tc-author { display: flex; align-items: center; gap: 12px; }
    .tc-avatar {
      width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 16px; font-weight: 700; color: white; flex-shrink: 0;
    }
    .tc-name { font-size: 14px; font-weight: 700; color: white; }
    .tc-loc { font-size: 12px; color: rgba(255,255,255,0.35); margin-top: 2px; }

    /* ══════ CTA SECTION ══════ */
    .cta-section {
      background: linear-gradient(135deg, #0e0c2e 0%, #1a1060 50%, #0d1a4e 100%);
      padding: 100px 0; text-align: center; position: relative; overflow: hidden;
      border-top: 1px solid rgba(99,102,241,0.2);
    }
    .cta-orb {
      position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none;
    }
    .cta-orb1 { width: 500px; height: 500px; background: rgba(99,102,241,0.2); top: -200px; left: 50%; transform: translateX(-50%); }
    .cta-orb2 { width: 300px; height: 300px; background: rgba(139,92,246,0.15); bottom: -100px; right: 10%; }
    .cta-icon-ring {
      width: 64px; height: 64px; background: linear-gradient(135deg, #6366f1, #4f46e5);
      border-radius: 18px; display: inline-flex; align-items: center; justify-content: center;
      margin-bottom: 24px; box-shadow: 0 0 40px rgba(99,102,241,0.5);
    }
    .cta-inner h2 { font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 800; color: white; margin-bottom: 14px; letter-spacing: -0.5px; }
    .cta-inner p { font-size: 1.05rem; color: rgba(255,255,255,0.55); margin-bottom: 36px; }
    .cta-buttons { display: flex; gap: 14px; justify-content: center; margin-bottom: 36px; flex-wrap: wrap; }
    .cta-btn-primary {
      display: inline-block; background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white; text-decoration: none; padding: 15px 32px; border-radius: 12px;
      font-size: 16px; font-weight: 700; transition: all 0.25s;
      box-shadow: 0 4px 24px rgba(99,102,241,0.5);
    }
    .cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.65); }
    .cta-btn-outline {
      display: inline-block; color: rgba(255,255,255,0.8); text-decoration: none;
      padding: 15px 32px; border-radius: 12px; font-size: 16px; font-weight: 600;
      border: 1.5px solid rgba(255,255,255,0.2); transition: all 0.25s;
    }
    .cta-btn-outline:hover { color: white; border-color: rgba(99,102,241,0.6); background: rgba(99,102,241,0.1); }
    .cta-badges { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .cta-badge {
      display: inline-flex; align-items: center; gap: 6px;
      color: rgba(255,255,255,0.45); font-size: 13px;
    }
    .cta-badge .material-icons { font-size: 16px; color: #6366f1; }

    /* ══════ FOOTER ══════ */
    .footer { background: #060d1f; }
    .footer-top { border-bottom: 1px solid rgba(255,255,255,0.06); }
    .footer-grid { padding: 60px 24px; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; }
    .footer-brand {
      display: flex; align-items: center; gap: 10px;
      font-size: 1.25rem; font-weight: 800; color: white; margin-bottom: 12px;
    }
    .f-logo {
      width: 32px; height: 32px; background: linear-gradient(135deg, #6366f1, #4f46e5);
      border-radius: 9px; display: flex; align-items: center; justify-content: center;
    }
    .footer-tagline { font-size: 14px; color: rgba(255,255,255,0.35); line-height: 1.65; margin-bottom: 20px; }
    .footer-socials { display: flex; gap: 8px; }
    .social-btn {
      width: 34px; height: 34px; background: rgba(255,255,255,0.07); border-radius: 8px;
      display: flex; align-items: center; justify-content: center; text-decoration: none;
      transition: all 0.2s;
    }
    .social-btn:hover { background: rgba(99,102,241,0.25); }
    .social-btn .material-icons { font-size: 16px; color: rgba(255,255,255,0.6); }
    .footer-col-title { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 16px; letter-spacing: 0.5px; text-transform: uppercase; }
    .footer-link {
      display: block; color: rgba(255,255,255,0.35); font-size: 14px;
      text-decoration: none; margin-bottom: 10px; transition: color 0.2s;
    }
    .footer-link:hover { color: rgba(255,255,255,0.8); }
    .footer-bottom { padding: 20px 24px; }
    .footer-bottom-inner {
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
      font-size: 13px; color: rgba(255,255,255,0.2);
    }
    .footer-badges { display: flex; gap: 16px; }
    .f-badge { font-size: 12px; color: rgba(255,255,255,0.2); }

    /* ══════ RESPONSIVE ══════ */
    @media (max-width: 1024px) {
      .hero-content { grid-template-columns: 1fr; }
      .hero-visual { display: none; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .features-grid { grid-template-columns: repeat(2, 1fr); }
      .steps-grid { grid-template-columns: repeat(2, 1fr); }
      .steps-connector { display: none; }
      .about-grid { grid-template-columns: 1fr; }
      .about-visual { display: none; }
      .testimonials-grid { grid-template-columns: 1fr 1fr; }
      .footer-grid { grid-template-columns: 1fr 1fr; }
      .hero-cta { justify-content: center; }
      .hero-trust { justify-content: center; }
      .hero-text { align-items: center; text-align: center; }
    }
    @media (max-width: 640px) {
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .features-grid { grid-template-columns: 1fr; }
      .steps-grid { grid-template-columns: 1fr; }
      .testimonials-grid { grid-template-columns: 1fr; }
      .footer-grid { grid-template-columns: 1fr; }
      .nav-links { display: none; }
      .footer-bottom-inner { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class HomeComponent {
  particles = Array.from({ length: 18 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    delay: Math.random() * 8,
    dur: Math.random() * 6 + 6,
  }));

  mockSchemes = [
    { name: 'PM-JAY Health Cover', icon: 'favorite', color: 'rgba(99,102,241,0.8)', pct: 80, status: 'Active' },
    { name: 'Ayushman Bharat',     icon: 'medical_services', color: 'rgba(74,222,128,0.8)', pct: 60, status: 'Enrolled' },
    { name: 'State Health Scheme', icon: 'local_hospital', color: 'rgba(251,191,36,0.8)', pct: 45, status: 'Pending' },
  ];

  marqueeItems = [
    { icon: 'people',             val: '50,000+',  label: 'Registered Citizens', color: '#818cf8' },
    { icon: 'local_offer',        val: '120+',     label: 'Active Schemes',       color: '#4ade80' },
    { icon: 'account_balance',    val: '₹2.4 Cr',  label: 'Total Disbursed',      color: '#fbbf24' },
    { icon: 'verified',           val: '98.6%',    label: 'Claim Approval Rate',  color: '#38bdf8' },
    { icon: 'speed',              val: '< 72 hrs', label: 'Average Processing',   color: '#f472b6' },
    { icon: 'security',           val: '100%',     label: 'Secure & Encrypted',   color: '#a78bfa' },
  ];

  stats = [
    { value: '50,000+', label: 'Registered Citizens',  icon: 'people',             grad: 'linear-gradient(135deg,#6366f1,#818cf8)', fill: 85, trend: 24 },
    { value: '120+',    label: 'Active Schemes',        icon: 'local_offer',        grad: 'linear-gradient(135deg,#059669,#34d399)', fill: 72, trend: 15 },
    { value: '₹2.4Cr',  label: 'Benefits Disbursed',    icon: 'account_balance',    grad: 'linear-gradient(135deg,#d97706,#fbbf24)', fill: 90, trend: 38 },
    { value: '98.6%',   label: 'Claim Approval Rate',   icon: 'task_alt',           grad: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', fill: 98, trend: 6 },
  ];

  features = [
    { title: 'Easy Registration',       desc: 'Sign up in minutes. Create your citizen profile and upload documents digitally — no physical visits needed.',          icon: 'person_add',           bg: 'rgba(99,102,241,0.15)',   color: '#818cf8' },
    { title: 'Scheme Discovery',        desc: 'Browse all available government healthcare schemes and instantly check your eligibility criteria.',                     icon: 'manage_search',        bg: 'rgba(52,211,153,0.12)',   color: '#34d399' },
    { title: 'One-Click Enrollment',    desc: 'Enroll in multiple healthcare programs simultaneously with a streamlined single application process.',                  icon: 'assignment_turned_in', bg: 'rgba(251,191,36,0.12)',   color: '#fbbf24' },
    { title: 'Digital Claim Filing',    desc: 'Submit healthcare claims online, attach supporting documents securely, and track approval status in real time.',        icon: 'receipt_long',         bg: 'rgba(239,68,68,0.12)',    color: '#f87171' },
    { title: 'Disbursement Tracking',   desc: 'Monitor approved benefits and direct bank account disbursements with full transaction history.',                        icon: 'account_balance',      bg: 'rgba(56,189,248,0.12)',   color: '#38bdf8' },
    { title: 'Audit & Compliance',      desc: 'Full audit trail for every action. Our compliance engine ensures complete transparency and accountability.',             icon: 'verified_user',        bg: 'rgba(167,139,250,0.12)',  color: '#a78bfa' },
  ];

  steps = [
    { title: 'Register & Verify',     desc: 'Create your account and complete identity verification through our secure KYC process.',              icon: 'how_to_reg'  },
    { title: 'Explore Schemes',       desc: 'Browse and find government healthcare schemes that match your profile and medical needs.',             icon: 'search'       },
    { title: 'Enroll & File Claims',  desc: 'Enroll in eligible schemes and submit medical claims with supporting documentation easily.',          icon: 'post_add'     },
    { title: 'Receive Benefits',      desc: 'Approved disbursements are transferred directly to your bank account, tracked and verified on-platform.', icon: 'payments'  },
  ];

  stepColors = ['#6366f1', '#38bdf8', '#34d399', '#fbbf24'];

  pillars = [
    { title: 'Fully Paperless',         desc: 'End-to-end digital process — no physical forms or office visits',     icon: 'eco',         bg: 'rgba(52,211,153,0.12)',  color: '#34d399' },
    { title: 'Real-Time Tracking',      desc: 'Live application status and instant push notifications',               icon: 'timeline',    bg: 'rgba(56,189,248,0.12)',  color: '#38bdf8' },
    { title: 'Direct Bank Transfer',    desc: 'Disbursements go straight to your bank — zero middlemen',              icon: 'payments',    bg: 'rgba(251,191,36,0.12)',  color: '#fbbf24' },
    { title: 'Multilingual Support',    desc: 'Available in 12 Indian languages for maximum accessibility',           icon: 'translate',   bg: 'rgba(167,139,250,0.12)', color: '#a78bfa' },
  ];

  testimonials = [
    {
      text: 'MediAid made it so easy to enroll in PM-JAY. My claim was approved within 3 days and the money came directly to my account. Incredible service.',
      name: 'Priya Sharma', loc: 'Mumbai, Maharashtra', color: 'linear-gradient(135deg,#6366f1,#818cf8)'
    },
    {
      text: 'I was struggling to find the right scheme for my family. MediAid\'s search helped me discover three programs I qualified for. Life-changing.',
      name: 'Ramesh Kumar', loc: 'Hyderabad, Telangana', color: 'linear-gradient(135deg,#059669,#34d399)'
    },
    {
      text: 'The transparency is what I love most. I can track every rupee from claim submission to disbursement. This is how government portals should work.',
      name: 'Aisha Patel', loc: 'Ahmedabad, Gujarat', color: 'linear-gradient(135deg,#d97706,#fbbf24)'
    },
  ];

  ctaBadges = [
    { icon: 'lock',           text: 'Bank-grade Security' },
    { icon: 'speed',          text: '72-hour Processing' },
    { icon: 'support_agent',  text: '24/7 Citizen Support' },
  ];

  footerLinks: { title: string; links: { label: string; route?: string; href?: string }[] }[] = [
    {
      title: 'Portal',
      links: [
        { label: 'Home',     route: '/' },
        { label: 'Sign In',  route: '/auth/login' },
        { label: 'Register', route: '/auth/register' },
      ]
    },
    {
      title: 'Features',
      links: [
        { label: 'Scheme Enrollment', href: '#features' },
        { label: 'Claim Filing',      href: '#features' },
        { label: 'Disbursements',     href: '#features' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center',    href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Use',   href: '#' },
      ]
    },
  ];
}
