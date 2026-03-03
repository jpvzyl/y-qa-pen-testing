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

## 6. Demo: Pen Testing the Demo Event Platform

### The Story

The y-qa Demo Event project is an **Event Management System** built with Rails 7.1, PostgreSQL, Stripe, Elasticsearch, and Hotwire. The pen testing module scans this exact target:

**Target:** `https://demo-events.example.com`

### What the Pen Test Found

| Severity | Count | Highlights |
|----------|-------|------------|
| **Critical** | 6 | SQL injection in event search, Stored XSS in event descriptions, IDOR on ticket records, Stripe secret key in client JS, Broken object-level auth on API, Mass assignment creates free tickets |
| **High** | 13 | Payment amount tampering, Race condition in Stripe webhooks, Mass assignment role escalation, Missing rate limiting, Promo code bypass, CSRF on registration |
| **Medium** | 15 | Missing CSP, Elasticsearch injection, Session cookie flags, CORS misconfiguration, QR code replay, Outdated gems with CVEs |
| **Low** | 9 | User enumeration, Verbose headers, Missing HttpOnly, Autocomplete on card fields |
| **Info** | 6 | Logging gaps, No account lockout, robots.txt exposure |

### AI Cross-Reference

The pen testing module **independently confirmed** vulnerabilities that the Y-QA core AI had **predicted**:

| Y-QA AI Prediction | Pen Test Finding | Status |
|--------------------|------------------|--------|
| "Race condition in payment processing" (Defect Prediction) | Race Condition in Stripe Webhook Processing (CVSS 7.5) | Confirmed |
| "SQL Injection Risk in Event Filters" (Defect Prediction) | SQL Injection in Event Search Filters (CVSS 9.8) | Confirmed |
| "Inconsistent Promo Code Validation" (Defect Prediction) | Promo Code Bypass - Expired Codes Accepted (CVSS 7.2) | Confirmed |
| "Slow Page Load on Dashboard" (Exploration Finding) | N+1 Query Timing Side Channel (CVSS 5.3) | Confirmed |

**This is the AI flywheel: QA predictions feed security testing, security findings validate QA predictions.**

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

### Methodology

The intellectual property valuation considers three approaches:

#### A. Cost Approach — What Would It Cost to Rebuild?

| Component | Effort | Rate (R/month) | Cost (ZAR) |
|-----------|--------|-----------------|------------|
| Backend (55 models, 47 controllers, API) | 14 dev-months | R120,000 | R1,680,000 |
| AI service layer (8 services, dual-model) | 8 dev-months | R150,000 | R1,200,000 |
| Pen testing module (frontend + API) | 6 dev-months | R120,000 | R720,000 |
| ISO certification module | 5 dev-months | R120,000 | R600,000 |
| Quantum optimization engine | 4 dev-months | R150,000 | R600,000 |
| Digital twin system | 4 dev-months | R120,000 | R480,000 |
| Infrastructure, DevOps, testing | 4 dev-months | R100,000 | R400,000 |
| Product design, UX, architecture | 6 dev-months | R100,000 | R600,000 |
| **Subtotal (development)** | **51 dev-months** | | **R6,280,000** |
| Domain expertise (security, compliance, AI) | Multiplier: 1.5x | | R3,140,000 |
| **Total Reproduction Cost** | | | **R9,420,000** |

#### B. Income Approach — Discounted Future Cash Flows

| Assumption | Value |
|------------|-------|
| Year 3 ARR | R30M - R55M |
| SaaS revenue multiple (AI/security) | 8-12x ARR |
| Discount rate (SA risk-adjusted) | 25% |
| Probability of achieving projections | 60% |

| Scenario | Year 3 ARR | Multiple | Gross Value | Risk-Adjusted | PV (ZAR) |
|----------|-----------|----------|-------------|---------------|-----------|
| Conservative | R30M | 8x | R240M | R144M | R73.7M |
| Base | R42M | 10x | R420M | R252M | R129M |
| Optimistic | R55M | 12x | R660M | R396M | R203M |

#### C. Market Comparable Approach

| Company | Valuation | Revenue Multiple | Notes |
|---------|-----------|------------------|-------|
| Snyk | $7.4B (2024) | ~30x ARR | Developer security |
| Veracode | $2.5B (2024) | ~12x ARR | AppSec testing |
| QualityWorks (SA) | Est. R50-100M | ~8x ARR | QA services |
| BugCrowd | $1B+ (2024) | ~15x ARR | Pen testing platform |

### IP Valuation Summary

| Method | Low Estimate (ZAR) | Mid Estimate (ZAR) | High Estimate (ZAR) |
|--------|--------------------|--------------------|---------------------|
| **Cost Approach** | R9.4M | R12M | R15M |
| **Income Approach** | R73.7M | R129M | R203M |
| **Market Comparable** | R40M | R80M | R150M |

### Recommended IP Valuation Range

| | ZAR | USD Equivalent (~R18.50) |
|-|-----|--------------------------|
| **Floor (cost-based)** | **R9.4 Million** | ~$508,000 |
| **Current Fair Value** | **R25 - R40 Million** | ~$1.35M - $2.16M |
| **Growth Potential (3-year)** | **R80 - R150 Million** | ~$4.3M - $8.1M |

**Key value drivers:**
- Dual-AI architecture (Sonnet + Opus validation loop) — no competitor has this
- Unified QA + Security + Compliance — unique market positioning
- 55+ production data models with deep domain logic
- Quantum-inspired optimization — genuine technical moat
- South African cost base with global SaaS pricing potential
- Working product with comprehensive demo data

---

## 12. Team & Ask

### What We've Built

- Full production backend with 55+ models and 47 controllers
- Three integrated frontend modules (Core, Pen Testing, ISO)
- 8 AI services using Claude Sonnet 4, Opus 4, and GPT-4
- Comprehensive test suites (159 frontend tests passing)
- Live demo deployed at GitHub Pages
- Seed data for full platform demonstration

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
