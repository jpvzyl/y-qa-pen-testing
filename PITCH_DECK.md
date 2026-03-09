# Y-QA: AI-Powered Quality & Security Platform

## Pitch Deck | March 2026

---

## 1. The Problem

### Software teams face a brutal trade-off: ship fast or ship safe.

| Pain Point | Impact |
|------------|--------|
| **Manual QA is slow and expensive** | 30-40% of dev cycles spent writing and maintaining tests |
| **Security testing is an afterthought** | 70% of breaches exploit known, unfixed vulnerabilities (Verizon DBIR 2025) |
| **Tools are fragmented** | Teams juggle 5-8 separate tools for functional, security, compliance, and performance testing |
| **AI adoption is surface-level** | Most "AI testing tools" are wrappers around basic prompts, not integrated into the testing lifecycle |
| **Compliance is manual** | ISO 27001, PCI DSS, SOC 2 audits cost R500K-R2M+ and take months of document gathering |

**The result:** Organisations choose between velocity and quality. Vulnerabilities ship to production. Breaches cost an average of $4.88M globally (IBM, 2024).

---

## 2. The Solution

### Y-QA is a unified AI platform that covers the entire quality and security lifecycle.

```
                        ┌─────────────────────────────┐
                        │         Y-QA PLATFORM        │
                        │    "Quality meets Security"   │
                        └──────────────┬──────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
    ┌─────▼──────┐            ┌───────▼────────┐          ┌───────▼────────┐
    │  Y-QA Core │            │  Pen Testing   │          │ ISO Certify    │
    │  QA Engine │            │  Module         │          │ Module         │
    └─────┬──────┘            └───────┬────────┘          └───────┬────────┘
          │                            │                            │
  ● User Stories          ● 6-Phase Pen Tests         ● ISO 27001 / 27002
  ● AI Test Generation    ● OWASP Top 10 Coverage     ● PCI DSS 4.0
  ● Playwright Scripts    ● CVSS 3.1 Scoring          ● HIPAA
  ● Self-Healing Tests    ● Attack Surface Mapping     ● SOC 2
  ● Digital Twins         ● Threat Intelligence        ● Risk Registers
  ● Defect Prediction     ● Remediation Engine         ● Audit Workflows
  ● Quantum Optimization  ● Red Team Simulation        ● Evidence Management
  ● Exploratory Testing   ● Kill Chain Analysis        ● Policy Templates
```

**One platform. One project. Full coverage.**

---

## 3. Product Modules

### 3.1 Y-QA Core — AI-Driven QA Engine

| Feature | Description | AI Depth |
|---------|-------------|----------|
| **AI Test Generation** | Natural language user stories to executable Playwright test scripts | Claude Sonnet 4 generates; Opus 4 validates |
| **Self-Healing Tests** | Tests that detect selector/DOM changes and automatically repair themselves | Claude analyses failure context, suggests fixes |
| **Digital Twin Modelling** | Virtual model of the application architecture — models, controllers, services, views, and their relationships | AI maps codebase to component graph |
| **Defect Prediction** | Predict where bugs will appear before they manifest, with root cause analysis | Claude analyses code patterns, change history, and complexity |
| **Quantum-Inspired Optimization** | Select the optimal subset of tests to run — maximise coverage, minimise time | Simulated annealing across coverage, risk, and cost dimensions |
| **Exploratory Testing** | AI autonomously explores the application, discovers pages, fills forms, finds bugs | Claude/OpenAI decide next exploration actions |
| **Dual-AI Codebase Analysis** | Full stack, route, auth, and database analysis using two AI models | Sonnet 4 for structural analysis; Opus 4 for validation and enhancement |
| **Test Flakiness Detection** | Track and quarantine unreliable tests with statistical analysis | Pattern recognition on failure history |
| **Visual Regression** | Baseline screenshot comparison for pixel-perfect UI verification | Automated diff detection |
| **Code-Test Mapping** | Understand which tests cover which code, and which changes need retesting | AI-powered traceability matrix |

### 3.2 Pen Testing Module — AI-Driven Security Assessment

| Feature | Description | AI Depth |
|---------|-------------|----------|
| **6-Phase Penetration Testing** | Reconnaissance > Scanning > Enumeration > Exploitation > Post-Exploitation > Reporting | AI agents orchestrate each phase |
| **5 Scan Modes** | Quick, Standard, Deep, Continuous, Red Team — each with different depth/time tradeoffs | AI recommends optimal mode based on target type |
| **OWASP Top 10 Coverage** | Full mapping of findings to all 10 OWASP 2021 categories (A01-A10) | AI categorises findings against OWASP taxonomy |
| **CVSS 3.1 Scoring** | Interactive vector calculator with all 8 base metrics | Automated scoring from finding characteristics |
| **Attack Surface Mapping** | Discover domains, subdomains, IPs, endpoints, technologies | Automated asset discovery and technology fingerprinting |
| **Kill Chain Analysis** | Map findings to the 7-stage Cyber Kill Chain | AI correlates vulnerabilities to attack progression |
| **MITRE ATT&CK Mapping** | Coverage across all 14 MITRE ATT&CK tactics | Automated technique classification |
| **Threat Intelligence** | Radar visualisation of threat categories, attack pattern analysis | AI-driven threat correlation |
| **Remediation Engine** | Prioritised fix recommendations with actual code snippets | AI generates fix code specific to the tech stack |
| **Compliance Mapping** | Map findings to PCI DSS 4.0, HIPAA, SOC 2, ISO 27001 requirements | Automated compliance gap analysis |
| **Executive Reporting** | Auto-generated executive summaries, technical reports, remediation plans | AI writes narrative from structured findings |
| **Red Team Simulation** | Adversarial scan mode simulating real-world attacker behaviour | AI-driven exploit chaining |

### 3.3 ISO Certification Module — Compliance Management

| Feature | Description |
|---------|-------------|
| **Framework Management** | ISO 27001:2022, ISO 27002 with full Annex A (93 controls, 4 themes) |
| **Statement of Applicability** | Per-control applicability with justifications |
| **Evidence Management** | Link evidence documents to controls |
| **Risk Register** | Risk identification, treatment plans, and monitoring |
| **Audit Workflows** | Plan, execute, and track compliance audits |
| **Policy Templates** | Pre-built policy documents aligned to controls |

---

## 4. AI Integration Depth

### This is not a GPT wrapper. AI is embedded at every layer.

```
┌──────────────────────────────────────────────────────────┐
│                    AI ARCHITECTURE                         │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐ │
│  │ Claude       │    │ Claude       │    │ OpenAI      │ │
│  │ Sonnet 4     │    │ Opus 4       │    │ GPT-4       │ │
│  │              │    │              │    │             │ │
│  │ Generation   │    │ Validation   │    │ Exploration │ │
│  │ Analysis     │    │ Quality Gate │    │ Fallback    │ │
│  │ Prediction   │    │ Audit        │    │             │ │
│  └──────┬──────┘    └──────┬───────┘    └──────┬──────┘ │
│         │                   │                    │        │
│         └───────────────────┼────────────────────┘        │
│                             │                             │
│                   ┌─────────▼──────────┐                  │
│                   │   AI Service Layer  │                  │
│                   └─────────┬──────────┘                  │
│                             │                             │
│    ┌────────────────────────┼───────────────────────┐     │
│    │            │           │          │             │     │
│    ▼            ▼           ▼          ▼             ▼     │
│ Test Gen    Codebase    Defect     Exploratory   TDD      │
│ Service     Analysis    Predict    Testing       Analysis  │
│             Job         Service    Service       Service   │
│                                                           │
│ Self-Heal   Opus        Root       Pen Test      Debug    │
│ Service     Validation  Cause      Agents        Assist   │
│             Job         Analysis                          │
└──────────────────────────────────────────────────────────┘
```

### AI Services in Production

| Service | AI Provider | What It Does |
|---------|-------------|--------------|
| `AiTestGeneratorService` | Claude Sonnet 4 | Generates test cases, Playwright scripts, and self-healing fixes from natural language and codebase context |
| `CodebaseAnalysisJob` | Claude Sonnet 4 + Opus 4 | Dual-model analysis: Sonnet extracts structure, Opus validates and enhances. Covers tech stack, routes, auth, database schema, and testing strategy |
| `PredictiveDefectAnalysisService` | Claude Sonnet 4 | Predicts where defects will occur based on code complexity, change frequency, and historical patterns |
| `RevolutionaryTddService` | Claude Sonnet 4 | Analyses user stories for technical feasibility, architecture impact, and generates TDD test cases |
| `OpusValidationJob` | Claude Opus 4 | Quality gate: validates AI-generated test cases meet rigorous standards before marking as development-ready |
| `ExploratoryTestingService` | Claude / OpenAI | Autonomously navigates applications, decides exploration paths, identifies issues |
| `ReconAgentService` | AI-orchestrated | Pen test reconnaissance phase: subdomain enumeration, technology fingerprinting, port scanning |
| `ScannerAgentService` | AI-orchestrated | Vulnerability scanning with intelligent target prioritisation |
| `ExploitAgentService` | AI-orchestrated | Exploitation with safety controls and authorisation verification |

### The Dual-AI Pattern (Unique to Y-QA)

Most AI tools use a single model. Y-QA uses **two models in a generate-validate loop**:

1. **Claude Sonnet 4** generates output (tests, analysis, predictions)
2. **Claude Opus 4** validates quality, catches errors, and enhances

This mirrors human code review: one engineer writes, another reviews. The result is significantly higher quality than single-model approaches.

---

## 5. Technical Architecture

### Platform Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Ruby on Rails 7.1, Ruby 3.2 |
| **Database** | PostgreSQL 15 |
| **Background Jobs** | Sidekiq + Redis |
| **Authentication** | Devise + JWT |
| **Authorisation** | Pundit |
| **Real-time** | Hotwire (Turbo + Stimulus) |
| **AI** | Anthropic Claude (Sonnet 4, Opus 4), OpenAI GPT-4 |
| **Storage** | AWS S3 / CloudFlare R2 |
| **Email** | SendGrid |
| **Pen Testing Frontend** | React 19, Vite 7, Tailwind CSS 4, Recharts, Framer Motion |
| **ISO Frontend** | React 19, Vite, Tailwind CSS |
| **Testing** | RSpec (backend), Vitest + React Testing Library (frontend) |
| **Deployment** | GitHub Pages (demo), production-ready for AWS/Railway/Render |

### Data Model Scale

| Category | Count |
|----------|-------|
| Database models | 55+ |
| API controllers | 47 |
| API endpoints | 80+ |
| Frontend pages (pen testing) | 16 |
| Frontend components (pen testing) | 15+ |
| Unit/integration tests | 159 (pen testing frontend) |

---

## 6. ISO 27001 Penetration Test — Y-QA Platform Self-Assessment

### The Story

Y-QA performed an ISO 27001-aligned penetration test **against its own codebase** — the Y-QA Platform (Rails 7.1, PostgreSQL, Redis, Sidekiq, Devise JWT, Claude/OpenAI integrations). This is a real security assessment, not a demo.

**Target:** `Y-QA Platform — Rails 7.1.5.1 / Puma 6.6.0 / PostgreSQL 15`

### Executive Summary

| Severity | Count | Key Findings |
|----------|-------|------------|
| **Critical** | 7 | Live API key in .env, Hardcoded Devise secret, OS command injection via git, Session cookie in repo, Hardcoded user credentials, Self-assignable admin role, Broken API access control |
| **High** | 13 | Host authorization disabled, No project scoping, API key leaked in responses, TLS verification disabled on Redis, CSRF bypassed, JWT key reuse, Unvalidated project fallback |
| **Medium** | 10 | No brute-force protection, Weak password policy (6 chars), Zip Slip risk, User enumeration, Overly permissive Pundit policies, Long password reset window, Error details leaked |
| **Low** | 8 | Long JWT expiry, Debug logging, User enumeration via registration, Missing resource policies, Backup files committed, Weak email regex |
| **Info** | 4 | No security headers, No audit logging, No rate limiting, No upload validation |

### ISO 27001 Annex A Controls Failed

| ISO 27001 Control | Finding | Severity |
|-------------------|---------|----------|
| **A.5.15 — Access Control** | All users see all projects; no project scoping or multi-tenancy | Critical |
| **A.5.17 — Authentication Information** | Hardcoded credentials, 6-char passwords, no lockout, no MFA | Critical |
| **A.8.3 — Information Access Restriction** | Pundit defaults allow any authenticated user to CRUD any resource | High |
| **A.8.4 — Access to Source Code** | Live API keys, session cookies, and credentials committed to repo | Critical |
| **A.8.9 — Configuration Management** | Host authorization disabled, Redis TLS verification disabled | High |
| **A.8.12 — Data Leakage Prevention** | API keys returned in API responses; error messages leak internals | High |
| **A.8.15 — Logging** | No audit trail for security events, no structured API logging | Medium |
| **A.8.25 — Secure Development Lifecycle** | No rate limiting, no input validation on uploads, broad exception handling | Medium |
| **A.8.26 — Application Security Requirements** | CSRF skipped on non-API endpoints, no CSP/HSTS headers | High |
| **A.8.28 — Secure Coding** | OS command injection via system() calls with unsanitized user input | Critical |

### Top 5 Critical Findings — Must Fix Before Audit

| # | Finding | CVSS | Fix Priority |
|---|---------|------|-------------|
| 1 | **Hardcoded Anthropic API Key** committed to repository (.env) | 9.8 | Immediate — rotate key, add .env to .gitignore, purge git history |
| 2 | **OS Command Injection** — branch_name passed directly to system() in CodebaseAnalysisJob | 9.8 | Immediate — use array args for system(), validate branch names |
| 3 | **Hardcoded Devise Secret Key** — enables forging password reset tokens for any user | 9.1 | Immediate — move to Rails credentials, rotate key |
| 4 | **Self-Assignable Admin Role** — registration endpoint permits role: "admin" | 8.8 | Immediate — remove :role from sign_up_params |
| 5 | **Hardcoded User Credentials** — real email/password in ExploratoryTestingService | 8.6 | Immediate — remove defaults, use env vars only |

### What Must Be Done to Pass the ISO 27001 Pen Test

| Priority | Action Items | Timeline |
|----------|-------------|----------|
| **P0 — Immediate** | Rotate all exposed secrets (API keys, Devise key, passwords). Add .env and cookies.txt to .gitignore. Purge git history. | Day 1 |
| **P0 — Immediate** | Fix OS command injection — replace system() string interpolation with array arguments. Validate all user input passed to shell commands. | Day 1–2 |
| **P1 — Within 1 Week** | Remove :role from registration params. Implement proper Pundit policies for every resource. Add project-user membership model. | Week 1 |
| **P1 — Within 1 Week** | Enable Devise :lockable (5 attempts), increase password minimum to 12 chars, enable :timeoutable (30 min), enable paranoid mode. | Week 1 |
| **P2 — Within 2 Weeks** | Add Rack::Attack rate limiting. Configure security headers (CSP, HSTS, X-Frame-Options). Enable Redis TLS verification. Fix CSRF on non-API endpoints. | Week 2 |
| **P2 — Within 2 Weeks** | Implement audit logging for all security events. Add structured API request logging. Hash API keys with BCrypt. | Week 2 |
| **P3 — Within 1 Month** | Validate ZIP uploads (type, size, path traversal). Add input validation on AI generation endpoints. Separate JWT secret from secret_key_base. | Month 1 |
| **P3 — Within 1 Month** | Remove backup files from repo. Implement API pagination. Add MFA support. Configure DMARC/SPF/DKIM for mailer. | Month 1 |

### Pen Test Verdict

**FAIL — The Y-QA Platform does not currently pass an ISO 27001-aligned penetration test.**

The platform has 7 critical and 13 high-severity vulnerabilities that must be remediated before it can be considered compliant with ISO 27001 Annex A controls for access control (A.5.15), authentication (A.5.17), secure coding (A.8.28), and data leakage prevention (A.8.12). The P0 and P1 items above represent the minimum remediation required to re-test.

---

## 7. Visualisations & UX

The pen testing module features a dark-themed, glassmorphic UI with real-time data visualisations:

| Visualisation | Purpose |
|---------------|---------|
| **Risk Gauge** | Semi-circular gauge showing overall risk score (0-100) |
| **Threat Radar** | Radar chart showing threat categories (injection, XSS, auth, access, crypto, SSRF, misconfig, components, API, business logic) |
| **Scan Waveform** | Real-time animated canvas waveform showing active scan state |
| **Kill Chain Diagram** | Interactive 7-phase Cyber Kill Chain with finding counts per phase |
| **OWASP Coverage Grid** | 10-category grid with finding counts and status indicators |
| **Severity Distribution** | Pie chart with critical/high/medium/low breakdown |
| **Vulnerability Trends** | Area chart showing vulnerability discovery over time |
| **Compliance Gauges** | Per-framework compliance percentage (PCI DSS, HIPAA, SOC 2, ISO 27001, OWASP) |
| **Phase Timeline** | Scan phase progression with duration and status |
| **CVSS Calculator** | Interactive CVSS 3.1 vector builder with all 8 metrics |

---

## 8. Competitive Landscape

| Feature | Y-QA | Snyk | Veracode | HCL AppScan | Burp Suite | QualityWorks |
|---------|------|------|----------|-------------|------------|--------------|
| AI test generation | Dual Claude | - | - | - | - | Basic |
| Pen testing | Full 6-phase | Dependency only | SAST/DAST | DAST | Manual + auto | - |
| QA + Security unified | Yes | No | No | No | No | No |
| Compliance mapping | 5 frameworks | - | Limited | Limited | - | - |
| Digital twins | Yes | - | - | - | - | - |
| Defect prediction | Yes | - | - | - | - | - |
| Quantum optimization | Yes | - | - | - | - | - |
| Self-healing tests | Yes | - | - | - | - | - |
| ISO certification | Yes | - | - | - | - | - |
| Dual-AI validation | Yes | - | - | - | - | - |

**Y-QA is the only platform that unifies functional QA, security testing, and compliance in a single AI-driven product.**

---

## 9. Market Opportunity

| Market | 2025 Size | 2030 Projected | CAGR |
|--------|-----------|----------------|------|
| Global Software Testing | $51.8B | $109.5B | 16.1% |
| Application Security Testing | $8.2B | $21.4B | 21.1% |
| AI in Testing | $1.2B | $8.7B | 48.6% |
| GRC / Compliance Software | $14.3B | $28.6B | 14.9% |

### South African Context

- SA cybersecurity market: R12.5B+ (2025)
- POPIA and sector-specific regulations driving compliance spend
- Local enterprises increasingly require combined QA + security assurance
- Limited local competition in AI-driven QA/security space
- Strong rand-based cost advantage for global SaaS delivery

---

## 10. Business Model

| Tier | Target | Price (Monthly) | Includes |
|------|--------|-----------------|----------|
| **Starter** | Small teams (1-5 devs) | R2,500/mo | Core QA, 3 projects, 100 AI generations/mo |
| **Professional** | Mid-market (5-25 devs) | R12,500/mo | Core QA + Pen Testing, 15 projects, 1,000 AI generations/mo |
| **Enterprise** | Large orgs (25+ devs) | R45,000/mo | Full platform + ISO + custom, unlimited projects, unlimited AI |
| **Consulting** | Ad hoc engagements | R150,000+/engagement | Expert-led pen testing using Y-QA platform |

### Revenue Projections (Conservative)

| Year | Customers | ARR (ZAR) |
|------|-----------|-----------|
| Year 1 | 15-25 | R2.5M - R5M |
| Year 2 | 50-80 | R10M - R18M |
| Year 3 | 120-200 | R30M - R55M |

---

## 11. IP Valuation

*Confidential — This section values only the intellectual property (IP). No revenue, no customers, no brand value is included. The platform is pre-market; the valuation accounts for that and explains what the IP enables when we go to market or raise funding.*

### Scope: What We Mean by "IP"

| IP Component | What It Includes | Evidence |
|--------------|------------------|----------|
| **Software & codebase** | Working platform: 55+ models, 47 controllers, 15+ services, 17 background jobs, 40+ DB tables | Full stack: Rails 7.1, PostgreSQL, React, Redis, Sidekiq |
| **Algorithms & methods** | QUBO formulation for test optimization; digital twin build/sync/impact; dual-phase Claude pipeline; defect prediction; pen testing agent orchestration | `QuantumOptimizationService`, `DigitalTwinService`, `ReconAgentService`, `ExploitAgentService` |
| **Integrations & APIs** | Production-ready: D-Wave, IBM Quantum, Anthropic (Sonnet 4 + Opus 4), OpenAI GPT-4, GitHub, Playwright, Stripe | Service classes; env-driven config |
| **Architecture & design** | Dual Claude (Sonnet → Opus) flow; digital twin ↔ quantum ↔ test mapping; codebase → TDD → validation; 6-phase pen test pipeline | End-to-end flows in code |
| **Trade knowledge** | Prompts, weights, constraint handling, solver selection, OWASP/CVSS/MITRE mappings, compliance frameworks | Embedded in services and jobs |

### Comparable Reference Points

| Comparable | Type | Value / Funding | Source |
|------------|------|-----------------|--------|
| **Testim** | Acquisition (product + team + traction) | **~USD 200M** (Feb 2022) | Calcalistech, VentureBeat, Tricentis |
| **Tricentis** | Company valuation | **~USD 4.5Bn** (Nov 2024); ARR >USD 400M | Bloomberg, GTCR, SiliconANGLE |
| **mabl** | Venture funding | **~USD 76.1M** total (Series C) | Tracxn |
| **AI testing sector** | Sector aggregate | **~USD 624M** VC in 49 companies; 8 acquisitions | Tracxn |

Testim had **narrower** scope (self-healing, TestOps, SaaS) but **revenue and customers**. Y-QA has **broader** IP (quantum, digital twin, Dual Claude, TDD, codebase, defects, pen testing, ISO, design) but **no revenue yet**. We value our IP at a fraction of a Testim-style exit.

### Methodology: From Comparable Exit to IP-Only Range

- **Anchor**: Testim acquisition ~USD 200M (proven product + market fit)
- **IP breadth**: Y-QA spans more differentiators than Testim had at acquisition (see Section 8)
- **Pre-market discount**: No revenue, no customers → IP valued at **12–40%** of comparable exit
- **FX**: 1 USD ≈ 16.5 ZAR

### IP-Only Valuation Range

| Scenario | Rationale | USD (approx.) | ZAR (approx.) @ R16.50 |
|----------|-----------|----------------|--------------------------|
| **Conservative** | IP only; pre-market; ~12–15% of Testim-style exit; technology and commercialization risk | USD 25 – 30M | **ZAR 412M – 495M** |
| **Base case** | IP only; working platform; unique features; ~18–22% of reference; still pre-revenue | USD 35 – 45M | **ZAR 577M – 742M** |
| **Upside** | Same IP; value when we go to market or raise (early traction / term sheet); ~30–40% of reference | USD 60 – 80M | **ZAR 990M – 1.32Bn** |

### IP-to-Market-Value Coefficient (Industry-Justified)

**Notation:**

| Symbol | Definition | Typical Value |
|--------|-----------|---------------|
| V_IP | Fair value of IP (pre-market, today) | ZAR 412M – 1.32Bn |
| MV | Possible market value at comparable exit | Derived: MV = V_IP / θ |
| θ (theta) | IP share of market value at exit | 0.25 – 0.35 (25–35%) |
| m | Revenue multiple at exit (EV/ARR) | 8 (mid-range SaaS, 6–12x) |
| ARR | Possible annual recurring revenue at exit | Derived: ARR = MV / m |

**Formulas:**

```
Step 1:  MV  = V_IP / θ           (possible market value from IP)
Step 2:  ARR = MV / m              (possible income from market value)
Combined: ARR = V_IP / (θ × m)    (possible income from IP directly)
```

**Why θ ∈ [0.25, 0.35]:** In tech M&A, intangibles (including IP) represent 20–35% of transaction value; the remainder is revenue multiple, customer base, and team (Ocean Tomo, Aon, tech M&A studies). Pre-revenue startups with strong IP typically fall in the 25–35% band.

### Worked Example (Base Case)

- V_IP = ZAR 660M (mid base case)
- θ = 0.30 (30% IP share)
- m = 8 (EV/ARR multiple)

```
MV  = 660 / 0.30 = ZAR 2,200M = ZAR 2.2Bn (possible market value)
ARR = 2,200 / 8  = ZAR 275M (possible annual recurring revenue)
```

**Per unit of IP value:** possible market value = 1/θ = 3.33x; possible ARR = 1/(θ×m) = 0.42x

### Applied to Y-QA (IP → Possible Market Value → Possible ARR)

| Scenario | IP Value (ZAR) | Possible Market Value (3×–4× IP) | Possible ARR (MV ÷ 8) |
|----------|----------------|----------------------------------|------------------------|
| Conservative | ZAR 412 – 495M | ZAR 1.24 – 1.98Bn | ZAR 155 – 248M |
| Base case | ZAR 577 – 742M | ZAR 1.73 – 2.97Bn | ZAR 216 – 371M |
| Upside | ZAR 990M – 1.32Bn | ZAR 2.97 – 5.28Bn | ZAR 371 – 660M |

### Key Value Drivers

- **Dual Claude AI Architecture** (Sonnet 4 + Opus 4 validation loop) — no competitor ships this
- **Application Digital Twin** for QA — unique in commercial test automation
- **Quantum-inspired optimization** with real D-Wave and IBM Quantum APIs — strong technical moat
- **Unified QA + Security + Compliance** — only platform covering all three in one product
- **55+ production data models** with deep domain logic across 40+ database tables
- **Revolutionary TDD pipeline** — codebase-aware analysis → Opus validation → development-ready tests
- **Working product with comprehensive demo data** — not a prototype, not a pitch deck
- **South African cost base** with global SaaS pricing potential

---

## 12. Team & Ask

### What We've Built

- Full production backend: 55+ models, 47 controllers, 15+ services, 17 background jobs, 40+ DB tables
- Three integrated frontend modules (Core QA, Pen Testing, ISO Certification)
- 8 AI services: Claude Sonnet 4, Claude Opus 4, OpenAI GPT-4
- Real quantum computing APIs: D-Wave and IBM Quantum integration
- Full RSpec test suite (models, services, requests, jobs) + 159 frontend tests
- Playwright E2E test framework with self-healing
- Live demo deployed with comprehensive seed data
- Complete architecture documentation and IP valuation framework

### What's Next

| Priority | Deliverable | Timeline |
|----------|-------------|----------|
| 1 | Production deployment with live pen testing agents | 4-6 weeks |
| 2 | Enterprise pilot with 3-5 SA organisations | 8-12 weeks |
| 3 | SOC 2 Type II and POPIA compliance modules | 12-16 weeks |
| 4 | Public launch and first paying customers | 16-20 weeks |

---

## 13. Contact

**Y-QA Platform**
- Demo: [https://jpvzyl.github.io/y-qa-pen-testing/](https://jpvzyl.github.io/y-qa-pen-testing/)
- Repository: [https://github.com/jpvzyl/y-qa-pen-testing](https://github.com/jpvzyl/y-qa-pen-testing)

---

*This document contains forward-looking statements and IP valuation estimates based on current market data, development costs, and projected revenue. Actual results may vary. IP valuation should be independently verified for investment or transaction purposes.*
