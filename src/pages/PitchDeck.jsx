import { Shield, Brain, Layers, Target, BarChart3, Lock, Zap, Eye, FileCheck, Globe, Server, Code2, TrendingUp, DollarSign, Users, Rocket, CheckCircle2, ArrowRight, Cpu, GitBranch, Radar, Bug, ScanSearch, AlertTriangle } from 'lucide-react'
import GlassCard from '../components/GlassCard'

function Section({ id, children }) {
  return <section id={id} className="scroll-mt-10">{children}</section>
}

function SectionTitle({ icon: Icon, title, subtitle, color = 'red' }) {
  const colorMap = {
    red: { icon: 'bg-red-500/15 border-red-500/20 text-red-400', line: 'from-red-500/40' },
    blue: { icon: 'bg-blue-500/15 border-blue-500/20 text-blue-400', line: 'from-blue-500/40' },
    purple: { icon: 'bg-purple-500/15 border-purple-500/20 text-purple-400', line: 'from-purple-500/40' },
    orange: { icon: 'bg-orange-500/15 border-orange-500/20 text-orange-400', line: 'from-orange-500/40' },
    green: { icon: 'bg-green-500/15 border-green-500/20 text-green-400', line: 'from-green-500/40' },
    cyan: { icon: 'bg-cyan-500/15 border-cyan-500/20 text-cyan-400', line: 'from-cyan-500/40' },
  }
  const c = colorMap[color]
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-2">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${c.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className={`h-px mt-4 bg-gradient-to-r ${c.line} to-transparent`} />
    </div>
  )
}

function StatCard({ value, label, color = 'red' }) {
  const colorMap = {
    red: 'border-red-500/20 text-red-400',
    blue: 'border-blue-500/20 text-blue-400',
    purple: 'border-purple-500/20 text-purple-400',
    orange: 'border-orange-500/20 text-orange-400',
    green: 'border-green-500/20 text-green-400',
    cyan: 'border-cyan-500/20 text-cyan-400',
  }
  const [border, text] = colorMap[color].split(' ')
  return (
    <div className={`rounded-xl border ${colorMap[color].split(' ')[0]} bg-white/[0.02] p-4 text-center transition-all hover:bg-white/[0.04] hover:scale-[1.02]`}>
      <div className={`text-2xl font-extrabold ${colorMap[color].split(' ')[1]}`}>{value}</div>
      <div className="text-[11px] font-medium text-gray-500 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}

function FeatureRow({ icon: Icon, title, desc, ai }) {
  return (
    <div className="flex gap-4 py-3.5 border-b border-white/[0.04] last:border-0 group">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] transition-colors group-hover:bg-white/[0.06]">
        <Icon className="h-4 w-4 text-gray-500 transition-colors group-hover:text-gray-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-gray-200">{title}</span>
          {ai && <span className="rounded-md bg-purple-500/10 border border-purple-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-400">AI</span>}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function CompareCell({ yes }) {
  return yes
    ? <td className="px-3 py-2.5 text-center"><CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" /></td>
    : <td className="px-3 py-2.5 text-center text-gray-800">—</td>
}

const NAV_ITEMS = [
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'features', label: 'Features' },
  { id: 'ai', label: 'AI Depth' },
  { id: 'demo', label: 'Demo' },
  { id: 'landscape', label: 'Landscape' },
  { id: 'market', label: 'Market' },
  { id: 'valuation', label: 'Valuation' },
  { id: 'roadmap', label: 'Roadmap' },
]

export default function PitchDeck() {
  return (
    <div className="max-w-5xl mx-auto space-y-14 pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#060a14] p-10 md:p-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_30%_-10%,rgba(239,68,68,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_110%,rgba(139,92,246,0.08),transparent_60%)]" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/20 glow-red">
              <Shield className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Y-QA</h1>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">AI-Powered Security Platform</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-light text-gray-300 max-w-2xl leading-relaxed">
            One platform that unifies <span className="text-red-400 font-bold">functional QA</span>,{' '}
            <span className="text-orange-400 font-bold">penetration testing</span>, and{' '}
            <span className="text-purple-400 font-bold">compliance certification</span> — all driven by dual-AI architecture.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-10">
            {NAV_ITEMS.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-gray-400 transition-all hover:border-red-500/25 hover:text-red-400 hover:bg-red-500/[0.04]">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <StatCard value="55+" label="Models" color="red" />
        <StatCard value="47" label="Controllers" color="orange" />
        <StatCard value="80+" label="Endpoints" color="blue" />
        <StatCard value="8" label="AI Services" color="purple" />
        <StatCard value="3" label="Modules" color="green" />
        <StatCard value="5" label="Frameworks" color="cyan" />
        <StatCard value="14" label="ATT&CK" color="orange" />
        <StatCard value="159" label="Tests" color="green" />
      </div>

      {/* 1. The Problem */}
      <Section id="problem">
        <SectionTitle icon={AlertTriangle} title="The Problem" subtitle="Software teams face a brutal trade-off: ship fast or ship safe." color="orange" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { stat: '30-40%', desc: 'of dev cycles spent writing and maintaining tests manually' },
            { stat: '70%', desc: 'of breaches exploit known, unfixed vulnerabilities (Verizon DBIR 2025)' },
            { stat: '5-8', desc: 'separate tools juggled for functional, security, and compliance testing' },
            { stat: '$4.88M', desc: 'average cost of a data breach globally (IBM 2024)' },
            { stat: 'R2M+', desc: 'typical cost for ISO 27001 / SOC 2 audit and compliance in SA' },
            { stat: 'Surface', desc: 'level — most "AI testing tools" are wrappers around basic prompts' },
          ].map((p) => (
            <GlassCard key={p.stat}>
              <div className="text-2xl font-bold text-orange-400 mb-2">{p.stat}</div>
              <p className="text-sm text-gray-400">{p.desc}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* 2. The Solution */}
      <Section id="solution">
        <SectionTitle icon={Layers} title="The Solution" subtitle="A unified AI platform covering the entire quality and security lifecycle." color="blue" />
        <div className="grid md:grid-cols-3 gap-4">
          <GlassCard glow="red">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
                <Brain className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="font-bold text-gray-100">Y-QA Core</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">AI-Driven QA Engine</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> AI Test Generation</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Self-Healing Tests</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Digital Twin Modelling</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Defect Prediction</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Quantum Optimization</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-red-400 shrink-0 mt-0.5" /> Exploratory Testing</li>
            </ul>
          </GlassCard>
          <GlassCard glow="orange">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20">
                <ScanSearch className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="font-bold text-gray-100">Pen Testing</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">AI-Driven Security Assessment</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /> 6-Phase Pen Tests</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /> OWASP Top 10 Coverage</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /> Attack Surface Mapping</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /> CVSS 3.1 Scoring</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /> Kill Chain Analysis</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" /> Red Team Simulation</li>
            </ul>
          </GlassCard>
          <GlassCard glow="purple">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
                <FileCheck className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="font-bold text-gray-100">ISO Certify</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">Compliance Management</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" /> ISO 27001 / 27002</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" /> PCI DSS 4.0</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" /> Risk Registers</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" /> Audit Workflows</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" /> Evidence Management</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" /> Policy Templates</li>
            </ul>
          </GlassCard>
        </div>
      </Section>

      {/* 3. Features Deep Dive */}
      <Section id="features">
        <SectionTitle icon={Zap} title="Features" subtitle="Every capability across the platform." color="green" />
        <div className="grid md:grid-cols-2 gap-4">
          <GlassCard>
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Core QA Engine</h3>
            <FeatureRow icon={Brain} title="AI Test Generation" desc="Natural language user stories to executable Playwright scripts" ai />
            <FeatureRow icon={Zap} title="Self-Healing Tests" desc="Detect selector/DOM changes and automatically repair tests" ai />
            <FeatureRow icon={GitBranch} title="Digital Twin Modelling" desc="Virtual model of app architecture — models, controllers, services, views" ai />
            <FeatureRow icon={Eye} title="Defect Prediction" desc="Predict bugs before they manifest with root cause analysis" ai />
            <FeatureRow icon={Cpu} title="Quantum Optimization" desc="Optimal test subset selection — max coverage, min time" ai />
            <FeatureRow icon={Globe} title="Exploratory Testing" desc="AI autonomously navigates, fills forms, discovers bugs" ai />
            <FeatureRow icon={Code2} title="Dual-AI Codebase Analysis" desc="Sonnet 4 extracts structure, Opus 4 validates and enhances" ai />
            <FeatureRow icon={Bug} title="Test Flakiness Detection" desc="Statistical analysis to track and quarantine unreliable tests" />
            <FeatureRow icon={Eye} title="Visual Regression" desc="Baseline screenshot comparison for pixel-perfect UI verification" />
            <FeatureRow icon={Target} title="Code-Test Mapping" desc="Traceability matrix: which tests cover which code" ai />
          </GlassCard>
          <GlassCard>
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3">Pen Testing Module</h3>
            <FeatureRow icon={ScanSearch} title="6-Phase Penetration Testing" desc="Recon > Scanning > Enumeration > Exploitation > Post-Exploit > Reporting" ai />
            <FeatureRow icon={Target} title="5 Scan Modes" desc="Quick, Standard, Deep, Continuous, Red Team" ai />
            <FeatureRow icon={Shield} title="OWASP Top 10 Coverage" desc="Full mapping to all 10 OWASP 2021 categories (A01-A10)" />
            <FeatureRow icon={BarChart3} title="CVSS 3.1 Scoring" desc="Interactive vector calculator with all 8 base metrics" />
            <FeatureRow icon={Globe} title="Attack Surface Mapping" desc="Domains, subdomains, IPs, endpoints, technology fingerprinting" ai />
            <FeatureRow icon={Radar} title="Kill Chain & MITRE ATT&CK" desc="7-stage Kill Chain + 14 MITRE ATT&CK tactics mapping" />
            <FeatureRow icon={Lock} title="Remediation Engine" desc="Prioritised fix recommendations with stack-specific code snippets" ai />
            <FeatureRow icon={FileCheck} title="Compliance Mapping" desc="PCI DSS 4.0, HIPAA, SOC 2, ISO 27001 gap analysis" />
            <FeatureRow icon={BarChart3} title="Executive Reporting" desc="Auto-generated summaries, technical reports, remediation plans" ai />
            <FeatureRow icon={AlertTriangle} title="Red Team Simulation" desc="Adversarial mode simulating real-world attacker behaviour" ai />
          </GlassCard>
        </div>
      </Section>

      {/* 4. AI Architecture */}
      <Section id="ai">
        <SectionTitle icon={Brain} title="AI Integration Depth" subtitle="Not a GPT wrapper. AI is embedded at every layer." color="purple" />
        <GlassCard glow="purple" className="mb-4">
          <h3 className="text-lg font-bold text-gray-100 mb-2">The Dual-AI Pattern</h3>
          <p className="text-sm text-gray-400 mb-4">Most AI tools use a single model. Y-QA uses two models in a generate-validate loop — mirroring human code review.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="text-sm font-bold text-purple-300 mb-1">Claude Sonnet 4</div>
              <p className="text-xs text-gray-500">Generation, Analysis, Prediction — the builder</p>
            </div>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-gray-600 rotate-90 md:rotate-0" />
            </div>
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
              <div className="text-sm font-bold text-orange-300 mb-1">Claude Opus 4</div>
              <p className="text-xs text-gray-500">Validation, Quality Gate, Audit — the reviewer</p>
            </div>
          </div>
        </GlassCard>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'AiTestGeneratorService', provider: 'Claude Sonnet 4', desc: 'Test cases, Playwright scripts, and self-healing fixes' },
            { name: 'CodebaseAnalysisJob', provider: 'Sonnet 4 + Opus 4', desc: 'Dual-model: extract structure then validate and enhance' },
            { name: 'PredictiveDefectService', provider: 'Claude Sonnet 4', desc: 'Predict defects from code complexity and change patterns' },
            { name: 'RevolutionaryTddService', provider: 'Claude Sonnet 4', desc: 'Technical feasibility analysis and TDD test generation' },
            { name: 'OpusValidationJob', provider: 'Claude Opus 4', desc: 'Quality gate: validates AI outputs meet rigorous standards' },
            { name: 'ExploratoryTestingService', provider: 'Claude / OpenAI', desc: 'Autonomous app navigation and issue discovery' },
            { name: 'ReconAgentService', provider: 'AI-Orchestrated', desc: 'Subdomain enumeration, tech fingerprinting, port scanning' },
            { name: 'ScannerAgentService', provider: 'AI-Orchestrated', desc: 'Vulnerability scanning with intelligent target prioritisation' },
            { name: 'ExploitAgentService', provider: 'AI-Orchestrated', desc: 'Exploitation with safety controls and auth verification' },
          ].map((svc) => (
            <div key={svc.name} className="rounded-xl border border-gray-800/50 bg-white/[0.02] p-4">
              <div className="text-xs font-mono text-purple-400 mb-1">{svc.name}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-2">{svc.provider}</div>
              <p className="text-xs text-gray-500">{svc.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. ISO 27001 Pen Test — Self-Assessment */}
      <Section id="demo">
        <SectionTitle icon={Target} title="ISO 27001 Pen Test — Self-Assessment" subtitle="Real penetration test against the Y-QA Platform codebase." color="red" />
        <GlassCard glow="red" className="mb-4">
          <p className="text-sm text-gray-300 mb-4">
            Y-QA performed an ISO 27001-aligned penetration test <span className="text-red-400 font-semibold">against its own codebase</span> — the Y-QA Platform (Rails 7.1, PostgreSQL, Redis, Sidekiq, Devise JWT, Claude/OpenAI integrations).
          </p>
          <div className="text-xs text-gray-500 font-mono bg-black/30 rounded-lg px-4 py-2 mb-4">
            Target: Y-QA Platform — Rails 7.1.5.1 / Puma 6.6.0 / PostgreSQL 15
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="rounded-full bg-red-500/20 border border-red-500/30 px-3 py-1 text-xs font-bold text-red-400 uppercase">Verdict: FAIL</span>
            <span className="text-xs text-gray-500">7 critical + 13 high-severity findings require remediation</span>
          </div>
        </GlassCard>

        <div className="grid grid-cols-5 gap-3 mb-4">
          {[
            { sev: 'Critical', count: 7, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
            { sev: 'High', count: 13, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
            { sev: 'Medium', count: 10, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
            { sev: 'Low', count: 8, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
            { sev: 'Info', count: 4, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
          ].map((s) => (
            <div key={s.sev} className={`rounded-xl border p-4 text-center ${s.color}`}>
              <div className="text-2xl font-bold">{s.count}</div>
              <div className="text-xs mt-1">{s.sev}</div>
            </div>
          ))}
        </div>

        <GlassCard className="mb-4">
          <h3 className="text-sm font-bold text-red-400 mb-3">Top 5 Critical Findings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Finding</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase">CVSS</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Fix Priority</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  { finding: 'Live Anthropic API Key committed to .env', cvss: '9.8', fix: 'Rotate key, add .env to .gitignore, purge git history' },
                  { finding: 'OS Command Injection via system() in CodebaseAnalysisJob', cvss: '9.8', fix: 'Use array args for system(), validate branch names' },
                  { finding: 'Hardcoded Devise Secret Key enables token forgery', cvss: '9.1', fix: 'Move to Rails credentials, rotate key' },
                  { finding: 'Self-Assignable Admin Role at /api/v1/auth/register', cvss: '8.8', fix: 'Remove :role from sign_up_params' },
                  { finding: 'Hardcoded real user credentials in service code', cvss: '8.6', fix: 'Remove defaults, use env vars only' },
                ].map((r) => (
                  <tr key={r.cvss} className="border-b border-gray-800/30">
                    <td className="py-2 px-3 text-xs text-red-400">{r.finding}</td>
                    <td className="py-2 px-3 text-center text-xs font-mono font-bold text-red-400">{r.cvss}</td>
                    <td className="py-2 px-3 text-xs text-gray-500">{r.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard className="mb-4">
          <h3 className="text-sm font-bold text-orange-400 mb-3">ISO 27001 Annex A Controls Failed</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Control</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Finding</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Severity</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                {[
                  { control: 'A.5.15 — Access Control', finding: 'All users see all projects; no scoping', sev: 'Critical', color: 'text-red-400' },
                  { control: 'A.5.17 — Authentication', finding: 'Hardcoded credentials, 6-char passwords, no lockout', sev: 'Critical', color: 'text-red-400' },
                  { control: 'A.8.4 — Source Code Access', finding: 'Live API keys & credentials committed to repo', sev: 'Critical', color: 'text-red-400' },
                  { control: 'A.8.28 — Secure Coding', finding: 'OS command injection via unsanitized system() calls', sev: 'Critical', color: 'text-red-400' },
                  { control: 'A.8.3 — Access Restriction', finding: 'Pundit defaults allow any user to CRUD any resource', sev: 'High', color: 'text-orange-400' },
                  { control: 'A.8.9 — Configuration Mgmt', finding: 'Host auth disabled, Redis TLS verification disabled', sev: 'High', color: 'text-orange-400' },
                  { control: 'A.8.12 — Data Leakage', finding: 'API keys returned in responses, error details leaked', sev: 'High', color: 'text-orange-400' },
                  { control: 'A.8.15 — Logging', finding: 'No audit trail for security events', sev: 'Medium', color: 'text-yellow-400' },
                  { control: 'A.8.25 — Secure Dev Lifecycle', finding: 'No rate limiting, no upload validation', sev: 'Medium', color: 'text-yellow-400' },
                  { control: 'A.8.26 — App Security Req.', finding: 'CSRF skipped on non-API endpoints, no CSP/HSTS', sev: 'High', color: 'text-orange-400' },
                ].map((r) => (
                  <tr key={r.control} className="border-b border-gray-800/30">
                    <td className="py-2 px-3 text-xs font-mono text-gray-300">{r.control}</td>
                    <td className="py-2 px-3 text-xs text-gray-400">{r.finding}</td>
                    <td className={`py-2 px-3 text-center text-xs font-bold ${r.color}`}>{r.sev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-bold text-green-400 mb-3">Remediation Roadmap to Pass</h3>
          <div className="space-y-3">
            {[
              { priority: 'P0', timeline: 'Day 1', items: 'Rotate all exposed secrets. Add .env and cookies.txt to .gitignore. Purge git history. Fix OS command injection.', color: 'border-red-500/30 bg-red-500/5' },
              { priority: 'P1', timeline: 'Week 1', items: 'Remove :role from registration. Implement Pundit policies. Add project-user membership. Enable Devise :lockable, increase password min to 12.', color: 'border-orange-500/30 bg-orange-500/5' },
              { priority: 'P2', timeline: 'Week 2', items: 'Add Rack::Attack rate limiting. Configure security headers (CSP, HSTS). Enable Redis TLS. Implement audit logging. Hash API keys.', color: 'border-yellow-500/30 bg-yellow-500/5' },
              { priority: 'P3', timeline: 'Month 1', items: 'Validate ZIP uploads. Add AI input validation. Separate JWT secret. Add MFA support. Configure mailer DMARC/SPF.', color: 'border-blue-500/30 bg-blue-500/5' },
            ].map((r) => (
              <div key={r.priority} className={`rounded-lg border p-3 ${r.color}`}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-gray-300">{r.priority}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{r.timeline}</span>
                </div>
                <p className="text-xs text-gray-400">{r.items}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </Section>

      {/* 6. Competitive Landscape */}
      <Section id="landscape">
        <SectionTitle icon={BarChart3} title="Competitive Landscape" subtitle="Y-QA is the only platform unifying functional QA, security testing, and compliance." color="cyan" />
        <GlassCard hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left py-2 px-3 font-semibold text-gray-400">Feature</th>
                  <th className="py-2 px-3 font-semibold text-red-400">Y-QA</th>
                  <th className="py-2 px-3 font-semibold text-gray-500">Testim</th>
                  <th className="py-2 px-3 font-semibold text-gray-500">mabl</th>
                  <th className="py-2 px-3 font-semibold text-gray-500">Burp Suite</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'AI test generation (multi-LLM)', y: true, s: true, v: true, b: false },
                  { f: 'Self-healing tests', y: true, s: true, v: true, b: false },
                  { f: 'Visual regression + AI diff', y: true, s: true, v: true, b: false },
                  { f: 'Full pen testing (6-phase)', y: true, s: false, v: false, b: true },
                  { f: 'Dual Claude (Sonnet + Opus)', y: true, s: false, v: false, b: false },
                  { f: 'Application digital twin', y: true, s: false, v: false, b: false },
                  { f: 'Quantum test optimization (D-Wave/IBM)', y: true, s: false, v: false, b: false },
                  { f: 'Codebase-aware TDD + Opus validation', y: true, s: false, v: false, b: false },
                  { f: 'Predictive defect + root cause', y: true, s: false, v: false, b: false },
                  { f: 'ISO 27001 certification', y: true, s: false, v: false, b: false },
                  { f: 'Design import (Figma → test)', y: true, s: false, v: false, b: false },
                  { f: 'AI exploratory testing', y: true, s: false, v: false, b: false },
                ].map((row) => (
                  <tr key={row.f} className="border-b border-gray-800/30">
                    <td className="py-2 px-3 text-gray-400">{row.f}</td>
                    <CompareCell yes={row.y} />
                    <CompareCell yes={row.s} />
                    <CompareCell yes={row.v} />
                    <CompareCell yes={row.b} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </Section>

      {/* 7. Market Opportunity */}
      <Section id="market">
        <SectionTitle icon={TrendingUp} title="Market Opportunity" subtitle="Massive, fast-growing TAM across three converging markets." color="green" />
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <GlassCard>
            <h3 className="text-sm font-bold text-gray-200 mb-4">Global Markets</h3>
            {[
              { market: 'Software Testing', size: '$51.8B', proj: '$109.5B', cagr: '16.1%' },
              { market: 'Application Security', size: '$8.2B', proj: '$21.4B', cagr: '21.1%' },
              { market: 'AI in Testing', size: '$1.2B', proj: '$8.7B', cagr: '48.6%' },
              { market: 'GRC / Compliance', size: '$14.3B', proj: '$28.6B', cagr: '14.9%' },
            ].map((m) => (
              <div key={m.market} className="flex items-center justify-between py-2 border-b border-gray-800/30 last:border-0">
                <span className="text-sm text-gray-400">{m.market}</span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-gray-500">{m.size}</span>
                  <ArrowRight className="h-3 w-3 text-gray-700" />
                  <span className="text-green-400 font-semibold">{m.proj}</span>
                  <span className="text-[10px] text-gray-600">{m.cagr}</span>
                </div>
              </div>
            ))}
          </GlassCard>
          <GlassCard>
            <h3 className="text-sm font-bold text-gray-200 mb-4">South African Context</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2"><TrendingUp className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> SA cybersecurity market: <span className="text-green-400 font-semibold">R12.5B+</span> (2025)</li>
              <li className="flex items-start gap-2"><Lock className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> POPIA and sector regulations driving compliance spend</li>
              <li className="flex items-start gap-2"><Users className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Limited local competition in AI-driven QA/security</li>
              <li className="flex items-start gap-2"><DollarSign className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Strong rand-based cost advantage for global SaaS delivery</li>
              <li className="flex items-start gap-2"><Globe className="h-4 w-4 text-green-400 shrink-0 mt-0.5" /> Enterprise demand for combined QA + security assurance</li>
            </ul>
          </GlassCard>
        </div>
        <GlassCard>
          <h3 className="text-sm font-bold text-gray-200 mb-4">Business Model</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800/50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Tier</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Target</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-gray-500">Price</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Includes</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-gray-800/30"><td className="py-2 px-3 font-semibold text-gray-300">Starter</td><td className="py-2 px-3">1-5 devs</td><td className="py-2 px-3 text-right font-mono text-green-400">R2,500/mo</td><td className="py-2 px-3 text-xs">Core QA, 3 projects, 100 AI gen/mo</td></tr>
                <tr className="border-b border-gray-800/30"><td className="py-2 px-3 font-semibold text-gray-300">Professional</td><td className="py-2 px-3">5-25 devs</td><td className="py-2 px-3 text-right font-mono text-green-400">R12,500/mo</td><td className="py-2 px-3 text-xs">+ Pen Testing, 15 projects, 1K gen/mo</td></tr>
                <tr className="border-b border-gray-800/30"><td className="py-2 px-3 font-semibold text-gray-300">Enterprise</td><td className="py-2 px-3">25+ devs</td><td className="py-2 px-3 text-right font-mono text-green-400">R45,000/mo</td><td className="py-2 px-3 text-xs">Full platform + ISO, unlimited</td></tr>
                <tr><td className="py-2 px-3 font-semibold text-gray-300">Consulting</td><td className="py-2 px-3">Ad hoc</td><td className="py-2 px-3 text-right font-mono text-green-400">R150K+</td><td className="py-2 px-3 text-xs">Expert-led pen testing engagements</td></tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      </Section>

      {/* 8. IP Valuation */}
      <Section id="valuation">
        <SectionTitle icon={DollarSign} title="IP Valuation (ZAR)" subtitle="IP-only valuation anchored to Testim (~USD 200M) acquisition comparable." color="orange" />

        <GlassCard className="mb-4">
          <h3 className="text-sm font-bold text-gray-200 mb-3">Comparable Reference Points</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-800/50">
                <th className="text-left py-2 px-3 text-gray-500">Comparable</th>
                <th className="text-left py-2 px-3 text-gray-500">Type</th>
                <th className="text-right py-2 px-3 text-gray-500">Value</th>
                <th className="text-left py-2 px-3 text-gray-500">Source</th>
              </tr></thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-gray-800/30"><td className="py-2 px-3 font-semibold text-orange-400">Testim</td><td className="py-2 px-3">Acquisition</td><td className="py-2 px-3 text-right font-mono text-orange-300">~USD 200M</td><td className="py-2 px-3">Tricentis, VentureBeat</td></tr>
                <tr className="border-b border-gray-800/30"><td className="py-2 px-3 font-semibold text-gray-300">Tricentis</td><td className="py-2 px-3">Valuation</td><td className="py-2 px-3 text-right font-mono">~USD 4.5Bn</td><td className="py-2 px-3">Bloomberg, GTCR</td></tr>
                <tr className="border-b border-gray-800/30"><td className="py-2 px-3 font-semibold text-gray-300">mabl</td><td className="py-2 px-3">Series C</td><td className="py-2 px-3 text-right font-mono">~USD 76.1M</td><td className="py-2 px-3">Tracxn</td></tr>
                <tr><td className="py-2 px-3 font-semibold text-gray-300">AI Testing Sector</td><td className="py-2 px-3">Aggregate VC</td><td className="py-2 px-3 text-right font-mono">~USD 624M</td><td className="py-2 px-3">Tracxn (49 cos, 8 acq.)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-600 mt-3">Testim had narrower scope (self-healing, TestOps). Y-QA has broader IP (quantum, digital twin, Dual Claude, TDD, pen testing, ISO) but no revenue yet. IP valued at 12-40% of a Testim-style exit.</p>
        </GlassCard>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <GlassCard>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Conservative</h3>
            <p className="text-xs text-gray-500 mb-2">~12-15% of Testim exit, risk-adjusted</p>
            <div className="text-2xl font-bold text-orange-400">R412 - 495M</div>
            <p className="text-xs text-gray-600 mt-1">USD 25 - 30M</p>
          </GlassCard>
          <GlassCard glow="orange">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Base Case</h3>
            <p className="text-xs text-gray-500 mb-2">~18-22% of reference, working platform</p>
            <div className="text-2xl font-bold text-orange-400">R577 - 742M</div>
            <p className="text-xs text-gray-600 mt-1">USD 35 - 45M</p>
          </GlassCard>
          <GlassCard>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Upside (at GTM)</h3>
            <p className="text-xs text-gray-500 mb-2">~30-40% of reference, early traction</p>
            <div className="text-2xl font-bold text-orange-400">R990M - 1.32Bn</div>
            <p className="text-xs text-gray-600 mt-1">USD 60 - 80M</p>
          </GlassCard>
        </div>

        <GlassCard className="mb-4">
          <h3 className="text-sm font-bold text-gray-200 mb-3">IP-to-Market-Value Formula</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-3">IP typically represents 25-35% of company value at a comparable tech exit (Ocean Tomo, Aon, tech M&A studies).</p>
              <div className="space-y-2 text-xs font-mono text-gray-400 bg-black/30 rounded-lg p-4">
                <div><span className="text-purple-400">MV</span>  = V_IP / <span className="text-cyan-400">θ</span> <span className="text-gray-600 ml-4">possible market value</span></div>
                <div><span className="text-green-400">ARR</span> = MV / <span className="text-orange-400">m</span> <span className="text-gray-600 ml-4">possible annual revenue</span></div>
                <div className="border-t border-gray-800/50 pt-2"><span className="text-green-400">ARR</span> = V_IP / (<span className="text-cyan-400">θ</span> x <span className="text-orange-400">m</span>) <span className="text-gray-600 ml-4">combined</span></div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                <span className="text-cyan-400">θ</span> = 0.25-0.35 (IP share) | <span className="text-orange-400">m</span> = 8 (EV/ARR multiple)
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-3">Worked example (base case, V_IP = R660M):</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs py-1.5 border-b border-gray-800/30">
                  <span className="text-gray-400">Market Value (MV = 660 / 0.30)</span>
                  <span className="font-mono font-bold text-orange-400">R2.2Bn</span>
                </div>
                <div className="flex justify-between text-xs py-1.5 border-b border-gray-800/30">
                  <span className="text-gray-400">Possible ARR (MV / 8)</span>
                  <span className="font-mono font-bold text-green-400">R275M</span>
                </div>
                <div className="flex justify-between text-xs py-1.5">
                  <span className="text-gray-400">IP leverage (per R1 of IP)</span>
                  <span className="font-mono text-gray-300">R3.33 MV, R0.42 ARR</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-4">
          <h3 className="text-sm font-bold text-gray-200 mb-3">IP → Market Value → Possible ARR</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-800/50">
                <th className="text-left py-2 px-3 text-gray-500">Scenario</th>
                <th className="text-right py-2 px-3 text-gray-500">IP Value (ZAR)</th>
                <th className="text-right py-2 px-3 text-gray-500">Market Value (3-4x)</th>
                <th className="text-right py-2 px-3 text-gray-500">Possible ARR</th>
              </tr></thead>
              <tbody className="text-gray-400">
                <tr className="border-b border-gray-800/30"><td className="py-2 px-3">Conservative</td><td className="py-2 px-3 text-right font-mono">R412 - 495M</td><td className="py-2 px-3 text-right font-mono">R1.24 - 1.98Bn</td><td className="py-2 px-3 text-right font-mono text-green-400">R155 - 248M</td></tr>
                <tr className="border-b border-gray-800/30"><td className="py-2 px-3 font-semibold text-gray-200">Base case</td><td className="py-2 px-3 text-right font-mono text-orange-400">R577 - 742M</td><td className="py-2 px-3 text-right font-mono text-orange-400">R1.73 - 2.97Bn</td><td className="py-2 px-3 text-right font-mono text-green-400">R216 - 371M</td></tr>
                <tr><td className="py-2 px-3">Upside</td><td className="py-2 px-3 text-right font-mono">R990M - 1.32Bn</td><td className="py-2 px-3 text-right font-mono">R2.97 - 5.28Bn</td><td className="py-2 px-3 text-right font-mono text-green-400">R371 - 660M</td></tr>
              </tbody>
            </table>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-sm font-bold text-gray-200 mb-3">Key Value Drivers</h3>
          <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
            {[
              'Dual Claude AI Architecture (Sonnet 4 + Opus 4) — no competitor ships this',
              'Application Digital Twin for QA — unique in commercial test automation',
              'Quantum optimization with real D-Wave & IBM Quantum APIs — strong technical moat',
              'Unified QA + Security + Compliance — only platform covering all three',
              '55+ production models, 15+ services, 17 background jobs, 40+ DB tables',
              'Revolutionary TDD pipeline — codebase-aware → Opus validation → dev-ready tests',
              'Working product with comprehensive demo data — not a prototype',
              'South African cost base with global SaaS pricing potential',
            ].map((d) => (
              <div key={d} className="flex items-start gap-2 py-1.5">
                <CheckCircle2 className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400">{d}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </Section>

      {/* 9. Roadmap */}
      <Section id="roadmap">
        <SectionTitle icon={Rocket} title="Roadmap" subtitle="From demo to revenue in 20 weeks." color="red" />
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { phase: '1', weeks: '4-6 weeks', title: 'Production Deploy', desc: 'Live pen testing agents, real scan execution against targets', color: 'border-red-500/30' },
            { phase: '2', weeks: '8-12 weeks', title: 'Enterprise Pilots', desc: '3-5 South African organisations, feedback loop, pricing validation', color: 'border-orange-500/30' },
            { phase: '3', weeks: '12-16 weeks', title: 'Compliance Modules', desc: 'SOC 2 Type II and POPIA compliance workflows', color: 'border-purple-500/30' },
            { phase: '4', weeks: '16-20 weeks', title: 'Public Launch', desc: 'Marketing site, self-serve onboarding, first paying customers', color: 'border-green-500/30' },
          ].map((p) => (
            <GlassCard key={p.phase}>
              <div className={`flex items-center gap-3 mb-3 pb-3 border-b ${p.color}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${p.color} text-sm font-bold text-gray-300`}>{p.phase}</div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{p.weeks}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-200 mb-1">{p.title}</h3>
              <p className="text-xs text-gray-500">{p.desc}</p>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <div className="text-center pt-10">
        <div className="h-px mb-10 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 border border-red-500/20 glow-red">
            <Shield className="h-6 w-6 text-red-400" />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">Y-QA</span>
        </div>
        <p className="text-sm font-medium text-gray-400">AI-Powered Quality & Security Platform</p>
        <p className="text-xs text-gray-600 mt-2 font-medium">March 2026 | Confidential</p>
      </div>
    </div>
  )
}
