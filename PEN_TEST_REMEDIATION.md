# Pen Test Findings — Remediation Summary

**Date:** 9 March 2026  
**Source:** `pen-test-findings` (ISO 27001-aligned penetration test report)  
**Scope:** Y-QA Platform (Rails 7.1.5.1)

This document lists all code and configuration changes made to address the reported vulnerabilities. Items that require manual or operational steps (e.g. rotate keys, run migrations, set ENV) are noted.

---

## Critical (CRIT)

### CRIT-02: OS Command Injection — `codebase_analysis_job.rb`

**Issue:** User-controlled `branch_name` was passed into `system()` strings, allowing command injection.

**Change:** Validate branch name with a strict regex and use array form of `system()` so the shell is not used.

```ruby
# Before (vulnerable):
system("git checkout #{branch_name}")
system("git pull origin #{branch_name}")
system("git clone -b #{branch_name} #{authenticated_url} #{repo_dir}")

# After (fixed):
unless branch_name.match?(/\A[a-zA-Z0-9._\-\/]+\z/)
  raise ArgumentError, "Invalid branch name: only letters, numbers, dots, underscores, hyphens and slashes allowed"
end
# ...
system('git', 'fetch', 'origin')
system('git', 'checkout', branch_name)
system('git', 'pull', 'origin', branch_name)
# ...
system('git', 'clone', '-b', branch_name, authenticated_url, repo_dir)
```

**File:** `app/jobs/codebase_analysis_job.rb`

---

### CRIT-03: Hardcoded Devise Secret Key — `devise.rb`

**Issue:** Devise `secret_key` was hardcoded in the initializer.

**Change:** Use `ENV['DEVISE_SECRET_KEY']` or Rails credentials; fallback to `secret_key_base` only if neither is set. (Existing initializer already used ENV/credentials; comment kept for traceability.)

**Config:** Ensure `DEVISE_SECRET_KEY` is set in production (or `devise_secret_key` in Rails credentials). Rotate the key after migration to invalidate existing tokens.

---

### CRIT-05: Hardcoded Credentials — `exploratory_testing_service.rb`

**Issue:** Fallback username/password were hardcoded.

**Change:** Use only `ENV` or explicit options; raise if credentials are missing.

```ruby
# Before:
@login_credentials = {
  username: options[:username] || ENV['EXPLORATORY_TEST_USERNAME'] || 'jp.vanzyl@icloud.com',
  password: options[:password] || ENV['EXPLORATORY_TEST_PASSWORD'] || 'Jpvanzyl7'
}

# After:
username = options[:username] || ENV['EXPLORATORY_TEST_USERNAME']
password = options[:password] || ENV['EXPLORATORY_TEST_PASSWORD']
raise ArgumentError, 'EXPLORATORY_TEST_USERNAME and EXPLORATORY_TEST_PASSWORD must be set' if username.blank? || password.blank?
@login_credentials = { username: username, password: password }
```

**File:** `app/services/exploratory_testing_service.rb`  
**Action required:** Set `EXPLORATORY_TEST_USERNAME` and `EXPLORATORY_TEST_PASSWORD` wherever this service is used.

---

### CRIT-06: Self-Assignable Admin Role — Registrations & ApplicationController

**Issue:** `role` was permitted on sign-up, allowing users to set themselves as admin.

**Change:** Removed `:role` from permitted sign-up parameters in both places.

```ruby
# app/controllers/application_controller.rb
def configure_permitted_parameters
  devise_parameter_sanitizer.permit(:sign_up, keys: [:first_name, :last_name])
  devise_parameter_sanitizer.permit(:account_update, keys: [:first_name, :last_name])
end

# app/controllers/api/v1/auth/registrations_controller.rb
def sign_up_params
  params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name)
end
```

**Files:** `app/controllers/application_controller.rb`, `app/controllers/api/v1/auth/registrations_controller.rb`

---

### CRIT-07: No Authorization on API Project Listing + API Key in Response

**Issue:** API returned `Project.all` and included `api_key` in project JSON.

**Change:**  
1. Use Pundit `policy_scope(Project)` for JWT-authenticated users; for API-key auth return only the current project.  
2. Remove `api_key` from API project JSON.  
3. Add `ProjectPolicy` and use it from API and web.

```ruby
# app/controllers/api/v1/projects_controller.rb — index
projects = if current_user
  policy_scope(Project).order(:name)
else
  current_project ? [current_project] : []
end
# project_json: removed api_key key entirely
```

**Files:**  
- `app/controllers/api/v1/projects_controller.rb` (index + `project_json`)  
- `app/controllers/api/v1/base_controller.rb` (include Pundit)  
- `app/policies/project_policy.rb` (new)

---

## High (HIGH)

### HIGH-04: CSRF Bypass on Non-API Endpoints

**Issue:** `skip_before_action :verify_authenticity_token` on TestCasesController (AI assist) and StaticController.

**Change:**  
- **TestCasesController:** Removed skip; frontend must send `X-CSRF-Token` (or Rails `csrf_meta_tags`) for `ai_assist_test_script` and `claude_chat`.  
- **StaticController:** Removed skip; actions are GET-only, so CSRF not required.

**Files:** `app/controllers/test_cases_controller.rb`, `app/controllers/static_controller.rb`

---

### HIGH-05: JWT Secret and Algorithm — `base_controller.rb` / Devise

**Issue:** JWT fell back to `secret_key_base`; algorithm not explicitly set.

**Change:**  
- In API `authenticate_jwt`: use only `ENV['DEVISE_JWT_SECRET_KEY']`; if blank, JWT auth fails. Decode with explicit `algorithm: 'HS256'`.  
- Rescue only `JWT::DecodeError` and `JWT::ExpiredSignature` (no `StandardError`).

```ruby
# app/controllers/api/v1/base_controller.rb
def authenticate_jwt(token)
  secret = ENV['DEVISE_JWT_SECRET_KEY']
  return false if secret.blank?
  payload = JWT.decode(token, secret, true, { algorithm: 'HS256' }).first
  # ...
rescue JWT::DecodeError, JWT::ExpiredSignature
  false
end
```

**Action required:** Set `DEVISE_JWT_SECRET_KEY` in production (and optionally in development).

---

### HIGH-06: Project.first Fallback — `base_controller.rb`

**Issue:** `resolve_project` used `Project.first` when `project_id` was missing.

**Change:** No fallback; set `@current_project` only when `project_id`/`id` is present. Actions that require a project (e.g. `show`) return 400 when `current_project` is nil.

```ruby
def resolve_project
  project_id = params[:project_id] || params[:id]
  @current_project = project_id.present? ? Project.find_by(id: project_id) : nil
end
```

**File:** `app/controllers/api/v1/base_controller.rb`

---

### HIGH-07: API Key in API Responses

**Change:** Removed `api_key` from `project_json` in `app/controllers/api/v1/projects_controller.rb` (see CRIT-07).

---

### HIGH-10: GenerateController Input — Length and Error Leakage

**Issue:** Arbitrary `source_content` and internal error messages in API response.

**Change:**  
1. Limit `source_content` to 100KB; raise `ArgumentError` if exceeded.  
2. On `StandardError`, log the exception and return generic message.

```ruby
# generate_params: reject oversized source_content
if p[:source_content].to_s.length > 100_000
  raise ArgumentError, "source_content exceeds 100KB limit"
end

# create: rescue StandardError
rescue StandardError => e
  Rails.logger.error("GenerateController error: #{e.message}")
  render json: { error: "Generation failed" }, status: :unprocessable_entity
end
```

**File:** `app/controllers/api/v1/generate_controller.rb`

---

### HIGH-11: Open3.capture3 Command Injection — `playwright_runner_service.rb`

**Issue:** Command built with string interpolation passed to `Open3.capture3`.

**Change:** Use env hash and array arguments (no shell).

```ruby
# Before:
stdout, stderr, status = Open3.capture3(
  "cd #{TEST_BASE_DIR} && " +
  "PLAYWRIGHT_JSON_OUTPUT_NAME=#{results_dir}/results.json " +
  "NODE_PATH=#{TEST_BASE_DIR}/node_modules " +
  "npx playwright test #{File.basename(test_run.script_path)} " +
  "--config=#{config_path}"
)

# After:
env = {
  'PLAYWRIGHT_JSON_OUTPUT_NAME' => "#{results_dir}/results.json",
  'NODE_PATH' => "#{TEST_BASE_DIR}/node_modules"
}
stdout, stderr, status = Open3.capture3(
  env, 'npx', 'playwright', 'test', script_basename, '--config', config_path,
  chdir: TEST_BASE_DIR
)
```

**File:** `app/services/playwright_runner_service.rb`

---

### HIGH-13: Redis KEYS — `projects_controller.rb`

**Issue:** `$redis.keys("zip_upload:*")` can block Redis.

**Change:** Use `scan_each` to collect keys, then delete.

```ruby
# Before:
old_keys = $redis.keys("zip_upload:*")

# After:
old_keys = []
$redis.scan_each(match: "zip_upload:*") { |k| old_keys << k }
$redis.del(*old_keys) if old_keys.any?
```

**File:** `app/controllers/projects_controller.rb`

---

## Medium (MED)

### MED-01: Devise Lockable

**Change:**  
- Enabled lockable in `config/initializers/devise.rb`: `lock_strategy = :failed_attempts`, `maximum_attempts = 5`, `unlock_strategy = :both`, `unlock_in = 1.hour`, `last_attempt_warning = true`.  
- Added `:lockable` to the User model.  
- Added migration `AddLockableToUsers` (columns: `locked_at`, `failed_attempts`, `unlock_token`).

**Action required:** Run `bin/rails db:migrate` to add lockable columns.

**Files:** `config/initializers/devise.rb`, `app/models/user.rb`, `db/migrate/*_add_lockable_to_users.rb`

---

### MED-02: Password Length

**Change:** In `devise.rb`, `config.password_length = 12..128`.

**File:** `config/initializers/devise.rb`

---

### MED-03: Zip Slip (Path Traversal) in ZIP Extraction

**Change:** Before extracting each entry, resolve path with `File.expand_path` and ensure it stays under the extraction directory.

```ruby
# Pattern used in codebase_analysis_job.rb and codebase_extraction_job.rb:
base = File.expand_path(extraction_dir)
# ...
file_path = File.expand_path(File.join(extraction_dir, entry.name))
next unless file_path == base || file_path.start_with?(base + File::SEPARATOR)
```

**Files:** `app/jobs/codebase_analysis_job.rb`, `app/jobs/codebase_extraction_job.rb`

---

### MED-04: Paranoid Mode

**Change:** In `devise.rb`, `config.paranoid = true`.

**File:** `config/initializers/devise.rb`

---

### MED-05: Pundit / Project Scoping

**Change:**  
- Added `app/policies/project_policy.rb` with Scope (currently returns all for authenticated user; can be tightened when project-user membership exists).  
- Web: `ProjectsController#index` uses `policy_scope(Project)`.  
- API: `Api::V1::ProjectsController#index` uses `policy_scope(Project)` when `current_user` is present.

**Files:** `app/policies/project_policy.rb`, `app/controllers/projects_controller.rb`, `app/controllers/api/v1/projects_controller.rb`

---

### MED-06: Password Reset Window

**Change:** In `devise.rb`, `config.reset_password_within = 30.minutes`.

**File:** `config/initializers/devise.rb`

---

### MED-07: Error Details in API

**Change:** GenerateController rescues `StandardError`, logs the message, and returns `{ error: "Generation failed" }` (see HIGH-10).

---

### MED-08: Mailer Sender

**Change:** In `devise.rb`, `config.mailer_sender = ENV.fetch('DEVISE_MAILER_SENDER', 'noreply@y-qa-platform.com')`.

**File:** `config/initializers/devise.rb`

---

### MED-09: Session Timeout

**Change:** In `devise.rb`, `config.timeout_in = 30.minutes`; added `:timeoutable` to the User model.

**Files:** `config/initializers/devise.rb`, `app/models/user.rb`

---

### MED-10: JWT Algorithm

**Change:** In API JWT decode, explicit `{ algorithm: 'HS256' }` (see HIGH-05).

---

## Low (LOW)

### LOW-01: JWT Expiry

**Change:** In `devise.rb` JWT config, `jwt.expiration_time = 15.minutes.to_i`.

**File:** `config/initializers/devise.rb`

---

### LOW-02: Debug Logging (puts)

**Change:** Replaced `puts` with `Rails.logger.debug` in `ExploratoryTestingService`.

**File:** `app/services/exploratory_testing_service.rb`

---

### LOW-05: Backup Files in Repo

**Change:** Added to `.gitignore`: `*.backup`, `*.bak`, and `cookies.txt`.

**File:** `.gitignore`

---

### LOW-07: Broad JWT Rescue

**Change:** In `authenticate_jwt`, rescue only `JWT::DecodeError` and `JWT::ExpiredSignature` (see HIGH-05).

---

### LOW-08: CORS

**Change:** Added `rack-cors` and `config/initializers/rack_cors.rb` to allow configured origins for `/api/*`. Origins come from `ENV['CORS_ORIGINS']` (default `localhost:3000`).

**Files:** `Gemfile`, `config/initializers/rack_cors.rb`

---

## Informational (INFO)

### INFO-01: Security Headers

**Change:** In `ApplicationController`, added `set_security_headers` before_action setting:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` and `Content-Security-Policy` when `request.ssl?`

**File:** `app/controllers/application_controller.rb`

---

### INFO-03: Rate Limiting

**Change:**  
- `config.middleware.use Rack::Attack` in `config/application.rb`.  
- `config/initializers/rack_attack.rb`: throttles for logins/ip, logins/email, registrations/ip, password_resets/ip, api/ip; subscribes to `throttle.rack_attack` for logging.

**Files:** `config/application.rb`, `config/initializers/rack_attack.rb`

---

## Not Fixed in Code (Manual / Future Work)

- **CRIT-01, CRIT-04:** Rotate API keys and session secret; remove `.env` and `cookies.txt` from git history (e.g. BFG); ensure `.env` and `cookies.txt` are in `.gitignore` (done).
- **CRIT-04:** Delete `cookies.txt` from repo and history; rotate `secret_key_base`.
- **HIGH-02:** Full project-user membership and scoping to `current_user.projects` require a new association and migration; `ProjectPolicy::Scope` is in place for when that exists.
- **HIGH-08:** Hashing API keys with BCrypt and showing full key only at creation would require a migration and key lifecycle changes.
- **HIGH-09:** Separating JWT and API-key auth and adding expiry/rotation/logging for API keys is a design change, not applied here.
- **INFO-02:** Audit logging for security events (e.g. failed logins, role changes) can be added as a separate concern or service.
- **MFA, DMARC/SPF/DKIM:** Not implemented; noted in original report.

---

## Checklist for Deploy

1. Run `bin/rails db:migrate` (AddLockableToUsers).
2. Set in production (or equivalent):
   - `DEVISE_SECRET_KEY`
   - `DEVISE_JWT_SECRET_KEY`
   - `DEVISE_MAILER_SENDER`
   - `EXPLORATORY_TEST_USERNAME` / `EXPLORATORY_TEST_PASSWORD` if using exploratory testing
   - `CORS_ORIGINS` for API CORS
3. Rotate any previously committed or default secrets (API keys, Devise secret, session secret).
4. Remove `.env` and `cookies.txt` from git history and ensure they are not deployed.
