import { useState } from 'react'
import { ClipboardCheck, ChevronDown, ChevronUp, FileCode2, AlertTriangle, CheckCircle2, Clock, Code2, ArrowRight, Shield, Wrench, ExternalLink } from 'lucide-react'
import GlassCard from '../components/GlassCard'

const SEV = {
  critical: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'CRITICAL' },
  high:     { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'HIGH' },
  medium:   { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'MEDIUM' },
  low:      { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'LOW' },
  info:     { text: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20', label: 'INFO' },
}

const ACTIONED_ITEMS = [
  {
    id: 'CRIT-02', severity: 'critical', title: 'OS Command Injection — codebase_analysis_job.rb',
    issue: 'User-controlled branch_name was passed into system() strings, allowing arbitrary command execution on the server.',
    change: 'Validate branch name with strict regex /\\A[a-zA-Z0-9._\\-\\/]+\\z/. Use array form of system() so the shell is never invoked.',
    files: ['app/jobs/codebase_analysis_job.rb'],
    before: `system("git checkout #{branch_name}")
system("git pull origin #{branch_name}")
system("git clone -b #{branch_name} #{authenticated_url} #{repo_dir}")`,
    after: `unless branch_name.match?(/\\A[a-zA-Z0-9._\\-\\/]+\\z/)
  raise ArgumentError, "Invalid branch name"
end
system('git', 'fetch', 'origin')
system('git', 'checkout', branch_name)
system('git', 'pull', 'origin', branch_name)
system('git', 'clone', '-b', branch_name, authenticated_url, repo_dir)`,
    iso: 'A.8.28 — Secure Coding',
  },
  {
    id: 'CRIT-03', severity: 'critical', title: 'Hardcoded Devise Secret Key',
    issue: 'Devise secret_key was hardcoded as a 128-char hex string in the initializer. Allows forging password reset tokens.',
    change: "Use ENV['DEVISE_SECRET_KEY'] or Rails credentials. No hardcoded fallback. Rotate key after migration.",
    files: ['config/initializers/devise.rb'],
    before: `config.secret_key = 'dc3be7d040690aeb...[128 chars]'`,
    after: `config.secret_key = ENV['DEVISE_SECRET_KEY'] || Rails.application.credentials.devise_secret_key`,
    iso: 'A.5.17 — Authentication Information',
    action: 'Set DEVISE_SECRET_KEY in production. Rotate key to invalidate existing tokens.',
  },
  {
    id: 'CRIT-05', severity: 'critical', title: 'Hardcoded Credentials — ExploratoryTestingService',
    issue: 'Real user credentials (email + password) were hardcoded as fallback defaults in the service.',
    change: 'Use only ENV or explicit options. Raise ArgumentError if credentials missing — no silent fallback.',
    files: ['app/services/exploratory_testing_service.rb'],
    before: `@login_credentials = {
  username: options[:username] || ENV['EXPLORATORY_TEST_USERNAME'] || 'jp.vanzyl@icloud.com',
  password: options[:password] || ENV['EXPLORATORY_TEST_PASSWORD'] || 'Jpvanzyl7'
}`,
    after: `username = options[:username] || ENV['EXPLORATORY_TEST_USERNAME']
password = options[:password] || ENV['EXPLORATORY_TEST_PASSWORD']
raise ArgumentError, 'Credentials must be set' if username.blank? || password.blank?
@login_credentials = { username: username, password: password }`,
    iso: 'A.5.17 — Authentication Information',
    action: 'Set EXPLORATORY_TEST_USERNAME and EXPLORATORY_TEST_PASSWORD in production.',
  },
  {
    id: 'CRIT-06', severity: 'critical', title: 'Self-Assignable Admin Role at Registration',
    issue: ':role was permitted on sign-up, allowing any user to register as admin.',
    change: 'Removed :role from permitted sign_up parameters in both ApplicationController and RegistrationsController.',
    files: ['app/controllers/application_controller.rb', 'app/controllers/api/v1/auth/registrations_controller.rb'],
    before: `devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name, :role])`,
    after: `devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name])`,
    iso: 'A.5.15 — Access Control',
  },
  {
    id: 'CRIT-07', severity: 'critical', title: 'No Authorization on API Projects + API Key Leaked',
    issue: 'API returned Project.all and included api_key in every project JSON response.',
    change: 'Use Pundit policy_scope(Project) for JWT auth. API-key auth returns only current project. Removed api_key from JSON. Added ProjectPolicy.',
    files: ['app/controllers/api/v1/projects_controller.rb', 'app/controllers/api/v1/base_controller.rb', 'app/policies/project_policy.rb'],
    before: `projects = Project.all.order(:name)
# project_json included: api_key: project.api_key`,
    after: `projects = if current_user
  policy_scope(Project).order(:name)
else
  current_project ? [current_project] : []
end
# project_json: api_key removed entirely`,
    iso: 'A.5.15 — Access Control, A.8.3 — Information Access Restriction',
  },
  {
    id: 'HIGH-04', severity: 'high', title: 'CSRF Bypass on Non-API Endpoints',
    issue: 'skip_before_action :verify_authenticity_token on TestCasesController and StaticController.',
    change: 'Removed CSRF skip. Frontend must send X-CSRF-Token for ai_assist and claude_chat POST endpoints.',
    files: ['app/controllers/test_cases_controller.rb', 'app/controllers/static_controller.rb'],
    before: `skip_before_action :verify_authenticity_token, only: [:ai_assist_test_script, :claude_chat]`,
    after: `# skip removed — CSRF protection now enforced`,
    iso: 'A.8.26 — Application Security Requirements',
  },
  {
    id: 'HIGH-05', severity: 'high', title: 'JWT Secret Fallback + Missing Algorithm',
    issue: 'JWT fell back to secret_key_base; algorithm not explicitly set; rescued StandardError broadly.',
    change: "Use only ENV['DEVISE_JWT_SECRET_KEY']. Decode with explicit algorithm: 'HS256'. Rescue only JWT-specific errors.",
    files: ['app/controllers/api/v1/base_controller.rb'],
    before: `secret = ENV['DEVISE_JWT_SECRET_KEY'] || Rails.application.secret_key_base
payload = JWT.decode(token, secret).first
rescue StandardError
  false`,
    after: `secret = ENV['DEVISE_JWT_SECRET_KEY']
return false if secret.blank?
payload = JWT.decode(token, secret, true, { algorithm: 'HS256' }).first
rescue JWT::DecodeError, JWT::ExpiredSignature
  false`,
    iso: 'A.5.17 — Authentication Information, A.8.25 — Secure Development Lifecycle',
    action: 'Set DEVISE_JWT_SECRET_KEY in production.',
  },
  {
    id: 'HIGH-06', severity: 'high', title: 'Project.first Fallback in API',
    issue: 'resolve_project used Project.first when project_id was missing — any user got the first project.',
    change: 'No fallback. Set @current_project only when project_id is present. Return 400 if nil.',
    files: ['app/controllers/api/v1/base_controller.rb'],
    before: `@current_project = project_id ? Project.find_by(id: project_id) : Project.first`,
    after: `@current_project = project_id.present? ? Project.find_by(id: project_id) : nil`,
    iso: 'A.5.15 — Access Control',
  },
  {
    id: 'HIGH-10', severity: 'high', title: 'GenerateController Input Length + Error Leakage',
    issue: 'Arbitrary source_content accepted without limits. Internal error messages returned to client.',
    change: 'Limit source_content to 100KB. On StandardError, log internally and return generic message.',
    files: ['app/controllers/api/v1/generate_controller.rb'],
    before: `# No size limit on source_content
rescue StandardError => e
  render json: { error: e.message }, status: :unprocessable_entity`,
    after: `raise ArgumentError if p[:source_content].to_s.length > 100_000
rescue StandardError => e
  Rails.logger.error("GenerateController error: #{e.message}")
  render json: { error: "Generation failed" }, status: :unprocessable_entity`,
    iso: 'A.8.26 — Application Security Requirements',
  },
  {
    id: 'HIGH-11', severity: 'high', title: 'Open3.capture3 Command Injection',
    issue: 'Command built with string interpolation passed to Open3.capture3 in PlaywrightRunnerService.',
    change: 'Use env hash and array arguments with chdir: option. No shell invocation.',
    files: ['app/services/playwright_runner_service.rb'],
    before: `Open3.capture3(
  "cd #{TEST_BASE_DIR} && " +
  "PLAYWRIGHT_JSON_OUTPUT_NAME=#{results_dir}/results.json " +
  "npx playwright test #{File.basename(test_run.script_path)}"
)`,
    after: `env = {
  'PLAYWRIGHT_JSON_OUTPUT_NAME' => "#{results_dir}/results.json",
  'NODE_PATH' => "#{TEST_BASE_DIR}/node_modules"
}
Open3.capture3(env, 'npx', 'playwright', 'test', script_basename, '--config', config_path, chdir: TEST_BASE_DIR)`,
    iso: 'A.8.28 — Secure Coding',
  },
  {
    id: 'HIGH-13', severity: 'high', title: 'Redis KEYS Blocking Call',
    issue: '$redis.keys("zip_upload:*") blocks Redis server during full key scan.',
    change: 'Use scan_each (cursor-based) to collect keys without blocking.',
    files: ['app/controllers/projects_controller.rb'],
    before: `old_keys = $redis.keys("zip_upload:*")`,
    after: `old_keys = []
$redis.scan_each(match: "zip_upload:*") { |k| old_keys << k }
$redis.del(*old_keys) if old_keys.any?`,
    iso: 'A.8.26 — Application Security Requirements',
  },
  {
    id: 'MED-01', severity: 'medium', title: 'Devise Lockable — Brute Force Protection',
    issue: ':lockable module was commented out. No account lockout after failed attempts.',
    change: 'Enabled :lockable with lock_strategy = :failed_attempts, maximum_attempts = 5, unlock_strategy = :both, unlock_in = 1.hour. Added migration for lockable columns.',
    files: ['config/initializers/devise.rb', 'app/models/user.rb', 'db/migrate/*_add_lockable_to_users.rb'],
    iso: 'A.5.17 — Authentication Information',
    action: 'Run bin/rails db:migrate to add lockable columns.',
  },
  {
    id: 'MED-02', severity: 'medium', title: 'Password Length — Increased to 12',
    issue: 'Minimum password was 6 characters.',
    change: 'config.password_length = 12..128',
    files: ['config/initializers/devise.rb'],
    iso: 'A.5.17 — Authentication Information',
  },
  {
    id: 'MED-03', severity: 'medium', title: 'Zip Slip Path Traversal Protection',
    issue: 'ZIP extraction did not validate entry paths, allowing writes outside the extraction directory.',
    change: 'Resolve paths with File.expand_path and ensure they stay under the extraction directory.',
    files: ['app/jobs/codebase_analysis_job.rb', 'app/jobs/codebase_extraction_job.rb'],
    before: `# No path validation — extracted directly`,
    after: `base = File.expand_path(extraction_dir)
file_path = File.expand_path(File.join(extraction_dir, entry.name))
next unless file_path.start_with?(base + File::SEPARATOR)`,
    iso: 'A.8.28 — Secure Coding',
  },
  {
    id: 'MED-04', severity: 'medium', title: 'Paranoid Mode — Prevent User Enumeration',
    issue: 'config.paranoid was commented out. Login/reset returned different messages for existing vs non-existing emails.',
    change: 'config.paranoid = true',
    files: ['config/initializers/devise.rb'],
    iso: 'A.5.17 — Authentication Information',
  },
  {
    id: 'MED-05', severity: 'medium', title: 'Pundit / Project Scoping',
    issue: 'ProjectsController#index returned Project.all with no authorization.',
    change: 'Added ProjectPolicy with Scope. Web and API controllers use policy_scope(Project).',
    files: ['app/policies/project_policy.rb', 'app/controllers/projects_controller.rb', 'app/controllers/api/v1/projects_controller.rb'],
    iso: 'A.5.15 — Access Control',
  },
  {
    id: 'MED-06', severity: 'medium', title: 'Password Reset Window — Reduced to 30 min',
    issue: 'reset_password_within was 6 hours.',
    change: 'config.reset_password_within = 30.minutes',
    files: ['config/initializers/devise.rb'],
    iso: 'A.5.17 — Authentication Information',
  },
  {
    id: 'MED-08', severity: 'medium', title: 'Mailer Sender — Configured',
    issue: 'Mailer used default placeholder (please-change-me@example.com).',
    change: "config.mailer_sender = ENV.fetch('DEVISE_MAILER_SENDER', 'noreply@y-qa-platform.com')",
    files: ['config/initializers/devise.rb'],
    iso: 'A.8.26 — Application Security Requirements',
  },
  {
    id: 'MED-09', severity: 'medium', title: 'Session Timeout — 30 min',
    issue: ':timeoutable was not enabled. Sessions never expired.',
    change: 'Enabled :timeoutable with config.timeout_in = 30.minutes.',
    files: ['config/initializers/devise.rb', 'app/models/user.rb'],
    iso: 'A.5.17 — Authentication Information',
  },
  {
    id: 'LOW-01', severity: 'low', title: 'JWT Expiry — Reduced to 15 min',
    issue: 'JWT tokens expired in 24 hours.',
    change: 'jwt.expiration_time = 15.minutes.to_i',
    files: ['config/initializers/devise.rb'],
    iso: 'A.5.17 — Authentication Information',
  },
  {
    id: 'LOW-02', severity: 'low', title: 'Debug Logging Removed',
    issue: 'puts statements in ExploratoryTestingService logged to stdout in production.',
    change: 'Replaced puts with Rails.logger.debug.',
    files: ['app/services/exploratory_testing_service.rb'],
    iso: 'A.8.15 — Logging',
  },
  {
    id: 'LOW-05', severity: 'low', title: 'Backup Files — .gitignore Updated',
    issue: '.backup and .bak files were committed to the repository.',
    change: 'Added *.backup, *.bak, and cookies.txt to .gitignore.',
    files: ['.gitignore'],
    iso: 'A.8.4 — Access to Source Code',
  },
  {
    id: 'LOW-07', severity: 'low', title: 'JWT Rescue Scope Narrowed',
    issue: 'authenticate_jwt rescued StandardError, hiding real errors.',
    change: 'Rescue only JWT::DecodeError and JWT::ExpiredSignature.',
    files: ['app/controllers/api/v1/base_controller.rb'],
    iso: 'A.8.25 — Secure Development Lifecycle',
  },
  {
    id: 'LOW-08', severity: 'low', title: 'CORS Configuration Added',
    issue: 'No CORS configuration existed for the API.',
    change: "Added rack-cors gem with configured origins from ENV['CORS_ORIGINS'] for /api/*.",
    files: ['Gemfile', 'config/initializers/rack_cors.rb'],
    iso: 'A.8.26 — Application Security Requirements',
  },
  {
    id: 'INFO-01', severity: 'info', title: 'Security Headers — All Set',
    issue: 'No security headers (CSP, HSTS, X-Frame-Options, etc.) were configured.',
    change: 'Added set_security_headers before_action: X-Frame-Options: DENY, X-Content-Type-Options: nosniff, X-XSS-Protection, Referrer-Policy, HSTS + CSP when SSL.',
    files: ['app/controllers/application_controller.rb'],
    iso: 'A.8.26 — Application Security Requirements',
  },
  {
    id: 'INFO-03', severity: 'info', title: 'Rate Limiting — Rack::Attack',
    issue: 'No rate limiting on any endpoint.',
    change: 'Added Rack::Attack middleware with throttles for logins/ip, logins/email, registrations/ip, password_resets/ip, api/ip. Logging on throttle events.',
    files: ['config/application.rb', 'config/initializers/rack_attack.rb'],
    iso: 'A.8.26 — Application Security Requirements',
  },
]

const NOT_FIXED = [
  { id: 'CRIT-01', severity: 'critical', title: 'Hardcoded API Key in .env', reason: 'Requires manual key rotation in Anthropic dashboard and git history purge with BFG Repo-Cleaner.' },
  { id: 'CRIT-04', severity: 'critical', title: 'Session Cookie in Repository', reason: 'Requires git history purge and secret_key_base rotation.' },
  { id: 'HIGH-02', severity: 'high', title: 'Broken Access Control (no project-user membership)', reason: 'Requires new user-project association, migration, and full policy tightening.' },
  { id: 'HIGH-08', severity: 'high', title: 'API Key Plaintext Storage', reason: 'Requires BCrypt hashing migration and key lifecycle redesign.' },
  { id: 'HIGH-09', severity: 'high', title: 'Dual Auth Separation (JWT + API Key)', reason: 'Architecture change: separate auth paths, add expiry/rotation/logging for API keys.' },
  { id: 'HIGH-SSL', severity: 'high', title: 'SSL/TLS Verification Disabled on Redis', reason: 'Requires Heroku Redis CA certificate configuration.' },
  { id: 'HIGH-HOST', severity: 'high', title: 'Host Authorization Disabled', reason: 'Requires setting explicit host allowlist per environment.' },
  { id: 'INFO-02', severity: 'info', title: 'Audit Logging for Security Events', reason: 'Requires audit log table, Warden hooks, and admin action logging.' },
  { id: 'INFO-MFA', severity: 'info', title: 'MFA, DMARC/SPF/DKIM', reason: 'Not implemented — noted for future roadmap.' },
]

function ActionedCard({ item, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const s = SEV[item.severity]
  const hasCode = item.before || item.after

  return (
    <div className={`rounded-xl border ${s.border} overflow-hidden transition-all duration-200 ${open ? `${s.bg}` : 'hover:bg-white/[0.015]'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
        <span className={`shrink-0 rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${s.text} ${s.bg} border ${s.border} font-mono`}>{item.id}</span>
        <span className="flex-1 text-sm font-semibold text-gray-200 truncate">{item.title}</span>
        {item.iso && <span className="hidden sm:inline-flex shrink-0 text-[9px] font-bold text-gray-600 font-mono">{item.iso.split(' — ')[0]}</span>}
        {open ? <ChevronUp className="h-4 w-4 text-gray-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0 space-y-4 animate-slide-down border-t border-white/[0.04]">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-600 mb-1">Issue</div>
            <p className="text-xs text-gray-400 leading-relaxed">{item.issue}</p>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Fix Applied</div>
            <p className="text-xs text-gray-300 leading-relaxed">{item.change}</p>
          </div>
          {hasCode && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {item.before && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500/60" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-red-400">Before</span>
                  </div>
                  <pre className="rounded-lg bg-black/40 border border-red-500/10 p-3 text-[11px] text-red-300/80 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{item.before}</pre>
                </div>
              )}
              {item.after && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">After</span>
                  </div>
                  <pre className="rounded-lg bg-black/40 border border-emerald-500/10 p-3 text-[11px] text-emerald-300/80 font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{item.after}</pre>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-4 flex-wrap">
            {item.files && item.files.map((f) => (
              <span key={f} className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
                <FileCode2 className="h-3 w-3" />{f}
              </span>
            ))}
          </div>
          {item.iso && (
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Shield className="h-3 w-3" />
              <span className="font-semibold">ISO 27001:</span> {item.iso}
            </div>
          )}
          {item.action && (
            <div className="flex items-start gap-2 rounded-lg bg-blue-500/[0.06] border border-blue-500/15 px-3 py-2">
              <Clock className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span className="text-xs text-blue-300">{item.action}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AuditActions() {
  const [filter, setFilter] = useState('all')

  const sevCounts = ACTIONED_ITEMS.reduce((a, i) => { a[i.severity] = (a[i.severity] || 0) + 1; return a }, {})
  const filtered = filter === 'all' ? ACTIONED_ITEMS : ACTIONED_ITEMS.filter((i) => i.severity === filter)

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-[#060a14] p-8 md:p-10 hero-gradient">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/20">
              <ClipboardCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Audit Actioned Items</h2>
              <p className="text-sm text-gray-500 mt-0.5">ISO 27001 pen test — code and configuration changes implemented</p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6 text-xs">
            <div>
              <span className="text-gray-600 font-medium">Date:</span>{' '}
              <span className="text-gray-300 font-semibold">9 March 2026</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Target:</span>{' '}
              <span className="text-gray-300 font-semibold">Y-QA Platform (Rails 7.1.5.1)</span>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Standard:</span>{' '}
              <span className="text-gray-300 font-semibold">ISO/IEC 27001:2022 Annex A</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {['critical', 'high', 'medium', 'low', 'info'].map((sev) => {
          const s = SEV[sev]
          return (
            <button
              key={sev}
              onClick={() => setFilter(filter === sev ? 'all' : sev)}
              className={`rounded-xl border p-4 text-center transition-all ${filter === sev ? `${s.border} ${s.bg}` : 'border-white/[0.05] hover:border-white/[0.1]'}`}
            >
              <div className={`text-2xl font-extrabold ${s.text}`}>{sevCounts[sev] || 0}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">{s.label}</div>
            </button>
          )
        })}
      </div>

      {/* Total banner */}
      <GlassCard glow="green" className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          <div>
            <span className="text-lg font-extrabold text-emerald-400">{ACTIONED_ITEMS.length}</span>
            <span className="text-lg font-extrabold text-gray-300"> findings remediated</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-500">{NOT_FIXED.length} remaining</span>
          <span className="text-xs text-gray-600">(manual / architectural)</span>
        </div>
      </GlassCard>

      {/* Actioned items list */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Wrench className="h-5 w-5 text-emerald-400" />
          <h3 className="text-lg font-extrabold text-white">Implemented Fixes</h3>
          {filter !== 'all' && (
            <button onClick={() => setFilter('all')} className="text-xs text-gray-500 hover:text-gray-300 font-medium transition-colors">
              Clear filter
            </button>
          )}
        </div>
        <div className="space-y-2">
          {filtered.map((item, i) => (
            <ActionedCard key={item.id} item={item} defaultOpen={i === 0} />
          ))}
        </div>
      </div>

      {/* Not fixed */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
          <h3 className="text-lg font-extrabold text-white">Not Yet Actioned</h3>
          <span className="text-xs text-gray-500">(requires manual or architectural changes)</span>
        </div>
        <div className="space-y-2">
          {NOT_FIXED.map((item) => {
            const s = SEV[item.severity]
            return (
              <div key={item.id} className={`flex items-start gap-4 rounded-xl border ${s.border} px-5 py-4`}>
                <AlertTriangle className={`h-4 w-4 shrink-0 mt-0.5 ${s.text}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`shrink-0 rounded-md px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${s.text} ${s.bg} border ${s.border} font-mono`}>{item.id}</span>
                    <span className="text-sm font-semibold text-gray-200">{item.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.reason}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Deploy checklist */}
      <GlassCard glow="blue">
        <div className="flex items-center gap-3 mb-5">
          <Clock className="h-5 w-5 text-blue-400" />
          <h3 className="text-sm font-bold text-gray-300">Post-Remediation Deploy Checklist</h3>
        </div>
        <div className="space-y-3">
          {[
            { step: 'Run bin/rails db:migrate (AddLockableToUsers)', status: 'required' },
            { step: 'Set DEVISE_SECRET_KEY in production', status: 'required' },
            { step: 'Set DEVISE_JWT_SECRET_KEY in production', status: 'required' },
            { step: 'Set DEVISE_MAILER_SENDER for email delivery', status: 'required' },
            { step: 'Set EXPLORATORY_TEST_USERNAME / PASSWORD', status: 'conditional' },
            { step: 'Set CORS_ORIGINS for API CORS', status: 'required' },
            { step: 'Rotate all previously committed secrets', status: 'critical' },
            { step: 'Remove .env and cookies.txt from git history (BFG)', status: 'critical' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold ${
                item.status === 'critical' ? 'bg-red-500/10 border border-red-500/15 text-red-400' :
                item.status === 'conditional' ? 'bg-yellow-500/10 border border-yellow-500/15 text-yellow-400' :
                'bg-blue-500/10 border border-blue-500/15 text-blue-400'
              }`}>
                {i + 1}
              </div>
              <span className="text-sm text-gray-300">{item.step}</span>
              {item.status === 'critical' && <span className="text-[9px] font-bold uppercase tracking-wider text-red-400">Critical</span>}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
