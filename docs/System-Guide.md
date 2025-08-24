## Field‑IQ System Guide (All‑in‑One)

This single guide covers how people get access and what each role sees on their dashboard. It avoids technical jargon and focuses on what to do in the app.

### Contents

- Access & Invitations
- Onboarding & Setup Flows
- Your Dashboard by Role
  - Admin
  - Sales Rep
  - Farmer
  - Super Admin (Dev)
  - LLM Chat (Sales Rep & Farmer)
- Tips & Troubleshooting

---

## Access & Invitations

Who invites whom

- Super Admin (Dev) → invites Company Admins
- Company Admin → invites Sales Reps
- Sales Rep → invites Farmers

How invitations work

1. Start an invite from your dashboard (Invite user).
2. The recipient gets an email with a “Set your password” button.
3. They set their password and are signed in automatically.
4. They land on the dashboard for their role (Admin, Sales, or Farmer).

If the invite link expires, use "Forgot password" on the sign‑in page or ask the inviter to resend.

Authentication Methods

The system supports multiple authentication flows:

- **Sign In**: Standard email/password authentication with role-based dashboard routing
- **Create Password**: First-time password creation from invitation links
- **Forgot Password**: Password reset functionality for existing users
- **Dev Signup**: Special signup flow for development/testing purposes
- **Invitation Flow**: Passwordless invitations that auto-create accounts

Role-Based Access Control

- Users are automatically redirected to their appropriate dashboard based on role
- Route permissions are enforced - users cannot access areas outside their role
- Failed authentication redirects to sign-in with the intended destination preserved

Security basics

- Invite links are time‑limited and tied to the recipient's email.
- Passwords are never sent by email.
- If using a shared device, sign out when done.
- All routes are protected and enforce role-based permissions.

---

## Onboarding & Setup Flows

New User Welcome Experience

When you first access Field‑IQ, you'll see a welcome screen with animated questions about your farming challenges. This helps introduce you to the system's capabilities:

- "Worried about your chickens?"
- "Hoping for bigger profits?"
- "Sure about the right feed?"
- And more engaging questions to set the context

After viewing the welcome questions, you'll be directed to sign in and begin your dashboard journey.

Company Setup (Admins Only)

When an Admin signs in for the first time without a company setup, they'll see a mandatory Company Setup Modal that must be completed:

- Company name and type (Feed Manufacturer, Distributor, or Cooperative)
- Country and timezone selection
- Optional contact details (email, phone, address)
- Phone number validation based on selected country
- Cannot be closed until completed

Farmer Onboarding Process

When farmers first access their dashboard after invitation, they encounter a comprehensive onboarding flow that ensures proper setup before they can use the system:

**Initial Dashboard Access**

- Upon first login, farmers see their dashboard with all components, but a mandatory onboarding overlay prevents full access
- The system checks if they have an active feed program or feed product setup
- If neither exists, the Feed Program Manager modal automatically opens and cannot be closed until completed

**3-Step Feed Program Setup (Mandatory)**

1. **Welcome Step**:
   - Introduction to the farm dashboard concept
   - Explanation of feed program benefits for farm optimization
   - Visual: Wheat icon with green accent
   - Message: "Let's get you started with your first feed program to optimize your farm operations"

2. **Feed Product Selection**:
   - Advanced product selector with detailed specifications
   - Visual tooltips showing:
     - Product goals and unique selling points
     - Animal type and feed stage compatibility
     - Age ranges (e.g., "Day 1 - 21 days")
     - Medicated vs. non-medicated indicators
     - Product format and category details
   - Visual: Package icon with blue accent
   - Must select a product to proceed
   - Message: "Select the right feed product for your animals to ensure optimal growth and health"

3. **Setup Completion**:
   - Final confirmation and feed program creation
   - Visual: CheckCircle icon with purple accent
   - Creates the farmer_feed_program record linking farmer to selected feed
   - Success message: "Feed program created successfully! Welcome to your farm management journey!"
   - Message: "Finalize your feed program setup and start tracking your farm's performance"

**Post-Onboarding Dashboard Access**

- Once completed, farmers gain full access to all dashboard components
- Feed Program Manager becomes invisible and non-intrusive
- All dashboard widgets become fully functional with their new feed program data

**Persistent Onboarding Design**

- The onboarding modal cannot be dismissed or closed until completed
- It's designed as a persistent overlay that ensures every farmer has a proper setup
- Progress indicators show current step (1 of 3, 2 of 3, 3 of 3)
- Navigation only allows forward progress with valid data

This onboarding is essential because many farmer dashboard features depend on having an active feed program established.

---

## Your Dashboard by Role

Below is a plain‑English tour of each dashboard block (the main sections/cards you’ll see). Each block lists what it shows, how to use it, and common actions.

### Admin Dashboard

User Manager

- What it shows: Comprehensive user management with real-time metrics (total users, farmers, sales reps, active/inactive counts).
- How to use: Filter/search users; open user details; view detailed user information with last sign-in data.
- Actions: Invite new users (sales reps and farmers), update roles, activate/deactivate accounts, resend invites, generate email links, manage user territories and regions.

Sales Activity Summary

- What it shows: Charts summarizing sales activity over time.
- How to use: Adjust the date range; switch views to focus on trends or totals.
- Actions: Drill down to see specific periods or segments.

Farm Registration Tracker

- What it shows: A map and charts of registered farms, plus registration stats.
- How to use: Filter by region/date; click map markers for details.
- Actions: Review progress, identify areas needing attention.

Dealer Issue Tracker

- What it shows: A map/heat view and a list of dealer issues.
- How to use: Filter by severity, status, or area; switch between heatmap and list.
- Actions: Open an issue, update status, follow up with the responsible team.

Feed Performance Tracker

- What it shows: Performance charts and a map view of feed outcomes.
- How to use: Choose timeframes and filters to compare areas or products.
- Actions: Spot under‑performance and plan interventions.

Competitor Intelligence

- What it shows: Brand rankings, competitor charts, and switching risks.
- How to use: Apply filters and view toggles to compare brands.
- Actions: Use insights for strategy and messaging.

FAQ Manager

- What it shows: Comprehensive FAQ management with category-based organization, usage analytics, and filtering options.
- How to use: Switch between card and list views; filter by category, status, or search terms; sort by various criteria.
- Actions: Create new FAQs, edit existing ones, delete outdated content, view detailed analytics, manage categories and priorities.

### Sales Rep Dashboard

Visit Schedule

- What it shows: Daily planner with scheduled visits; quick access to directions.
- How to use: Pick a date; view stops and timing; open directions when traveling.
- Actions: Add/edit visits; get directions; adjust plans on the fly.

Farmer Manager

- What it shows: Your farmer accounts with livestock type selection (broilers, layers, native chickens, ducks, hogs), territory mapping, and status indicators.
- How to use: Search/filter farmers; open farmer details; manage livestock types and territories.
- Actions: Invite new farmers (passwordless or with signup), select livestock types, assign territories, update farmer information, send targeted invitations.

Dealer Alert Log

- What it shows: A list of alerts grouped by dealer/farm, with statuses.
- How to use: Filter by status, type, or area; open an alert for detail.
- Actions: Acknowledge/resolve alerts; follow up with affected farms.

Monthly Sales Chart

- What it shows: Detailed sales performance with volume influenced vs. closed sales, monthly trends, and average benchmarks.
- How to use: View total volume influenced, total closed sales, and monthly averages; analyze performance against targets.
- Actions: Track sales progress, identify performance patterns, compare monthly results, set improvement goals.

Training Tracker

- What it shows: Assigned training modules and earned badges.
- How to use: See what’s pending vs. completed.
- Actions: Start/continue modules; track completion.

### Farmer Dashboard

Health Watch Summary

- What it shows: Current health issues, counts, and a prioritized list.
- How to use: Filter by status; open an issue to see details.
- Actions: Add new issues; update status as work is done.

Growth Performance Log

- What it shows: Records and charts of growth over time.
- How to use: Add measurements; view details; compare periods.
- Actions: Add records; review details; export if needed.

Feed Intake Behavior

- What it shows: Behavior meters and lists of observations.
- How to use: Add new observations; monitor changes.
- Actions: Log behaviors; review trends for early warning.

Feed Usage Calculator

- What it shows: Advanced calculator with animal type selection, feed stage options, and consumption patterns with automatic reorder point calculations.
- How to use: Enter number of animals, bag size, current stock, and costs; select animal type and feed stage for accurate estimates.
- Actions: Calculate daily/weekly consumption, determine reorder points, get cost estimates, receive low-stock alerts.

Current Feed in Use

- What it shows: Detailed view of your active feed product with stage information, start dates, and usage status.
- How to use: Click to view expanded details about your current feed program.
- Actions: Monitor feed transitions; plan next feed stages with your team.

Feed Product Selector

- What it shows: Available feed products for your livestock with detailed specifications.
- How to use: Browse products by animal type, stage, and goals; view tooltips for detailed info.
- Actions: Select appropriate feeds; compare options; view medicated vs. non-medicated choices.

Feed Program Manager

- What it shows: Your active feed program status and setup.
- How to use: Automatically appears for new farmers; guides through feed program creation.
- Actions: Complete initial setup; manage ongoing feed programs.

### Super Admin (Dev) Dashboard

Email Link Generator

- What it shows: Advanced user creation and invitation tools.
- How to use: Select link type (signup, invite, recovery); enter user details and role.
- Actions: Create admin accounts; send passwordless invitations; manage user onboarding.

Users Table

- What it shows: Complete user management interface for all companies.
- How to use: Search, filter, and manage users across the entire system.
- Actions: Support account issues; manage user roles; troubleshoot access problems.

---

## LLM Chat (Sales Rep & Farmer)

Who has access

- Sales Reps and Farmers only. Admins and Super Admins do not see the chat.

How to open

- Click the chat bubble. You’ll see a welcome screen with suggestions.

How the frontend chat is organized

- Stages: welcome → chat → report
- Modes: normal (free chat), report (guided logging), quick (selection‑based)

Frontend categories and options come from the app's chat menu. The assistant still follows the same rules from the prompts: it asks for one missing detail at a time, validates product/feed names, and expects dates in YYYY/MM/DD.

Available Prompt Files

The system uses dedicated prompt files for different chat intents:

**Sales Rep Prompts:**

- ask_salesrep_sales_log.json/txt - Sales activity logging
- ask_salesrep_farm_log.json/txt - Farm visit tracking
- ask_salesrep_dealer_log.json/txt - Dealer problem reporting
- ask_salesrep_product_field_log.json/txt - Product/field issue logging
- ask_sales_rep_general_questions.json/txt - General Q&A
- ask_salesrep_intent.json/txt - Intent classification

**Farmer Prompts:**

- ask_farmer_health_log.json/txt - Health issue reporting
- ask_farmer_log.json/txt - Performance logging
- ask_farmer_diy_log.json/txt - DIY practice safety checks
- ask_farmer_general_questions.json/txt - General questions & feed advisory
- ask_farmer_intent.json/txt - Intent classification

### Sales Rep: Frontend categories

Top‑level options

- Ask Question (free chat)
- Report Issue (guided)
- Log Performance (guided)

Report → Log Performance

- Sales Report (intent 7): Daily/weekly sales activity logging.
- Farm Visit (intent 8): Planned/completed visits; date, location, farm, purpose, optional ticket.

Report → Report Issue

- Dealer Problems (intent 2): Stockout, pricing, delivery delays → dealer name, location, summary.
- Product or Field Issues (intent 3): Feed/product issues in the field → feed name, farm/location, problem.

Tips

- Use exact product names when possible.
- Use YYYY/MM/DD for dates.

Detailed flows

Sales Report (intent 7)

- Collects: sale date (YYYY/MM/DD), product sold (exact catalog name), total amount (₱), quantity (units/bags), location/branch, farm name, short description.
- Validations: product name must match catalog; date must be YYYY/MM/DD; amounts are numeric; quantity provided as a number/units.
- Assistant behavior: asks for one missing field at a time; replies with a professional confirmation when complete.
- Example (you): “Sold 50 bags of Broiler Starter at San Isidro, Farm Delta, total ₱85,000 on 2025/08/11.”
- Example (assistant): “Got it. Logging a sales activity for Broiler Starter (50 bags) at San Isidro, Farm Delta, total ₱85,000 on 2025/08/11. Anything else to add?”
- Stored as: sales activity log.
- Reference: @prompts/ask_salesrep_sales_log.json.

Farm Visit (intent 8)

- Collects: visit type (planned/completed), date, location, farm name, purpose; optional ticket number (format TKT-000(ID)-(NUMBER)).
- Validations: date format; ticket number only if it matches the pattern; purpose required.
- Assistant behavior: asks for any missing item; summarizes before saving.
- Example (you): “Planned visit tomorrow 2025/08/12 to San Pedro Farm for product review.”
- Example (assistant): “Planning a visit on 2025/08/12 to San Pedro Farm for product review. Do you want to add a ticket number?”
- Stored as: farm visit log.
- Reference: @prompts/ask_salesrep_farm_log.json.

Dealer Problems (intent 2)

- Collects: dealer name, location, problem summary, problem type (stockout, pricing, delivery), optional product affected; internal notes.
- Validations: requires dealer name, location, problem and type; asks for one missing detail at a time.
- Assistant behavior: acknowledges, clarifies, then confirms logging.
- Example (you): “Delivery delay at Luzon Feeds, San Juan. Broiler Finisher affected.”
- Example (assistant): “Logging a delivery delay at Luzon Feeds (San Juan), product affected: Broiler Finisher. Any additional details I should include?”
- Stored as: dealer issue log.
- Reference: @prompts/ask_salesrep_dealer_log.json.

Product or Field Issues (intent 3)

- Collects: short description, problem, feed name (must be asked if missing), farm name, location; only record birds affected/age if you explicitly provided them.
- Validations: do not infer bird counts/age; ask if missing critical info; classify as feed‑ or product‑related.
- Assistant behavior: supportive tone; one missing info at a time; confirms when complete.
- Example (you): “Feed refusal with Poultry Advantage Starter at Brgy. Sto Nino, Farm Delta.”
- Example (assistant): “Thanks for reporting. I’ll log a feed‑related issue for Poultry Advantage Starter at Farm Delta (Brgy. Sto Nino). When did this start? (YYYY/MM/DD)”
- Stored as: product/feed issue log.
- Reference: @prompts/ask_salesrep_product_field_log.json.

Ask Question (intent 0)

- Purpose: general Q&A, product matching, performance checks, download guides, or asking for help.
- Behaviors: may classify your intent, answer directly, or route you into the right guided flow.
- Examples: “Match a starter feed for 2‑week broilers.” “Download feeding guide.” “I need vet assistance.”
- Reference: @prompts/ask_sales_rep_general_questions.json, @prompts/ask_salesrep_intent.json.

### Farmer: Frontend categories

Top‑level options

- Ask Question (free chat)
- Report Health Issues (intent 2)
- Ask if Safe (intent 3)
- Log Farm Performance (intent 7)

What they cover

- Report Health Issues (2): Sickness, mortality, feed rejection; collects date, affected count, symptoms.
- Ask if Safe (3): DIY/safety checks or feed guidance.
- Log Farm Performance (7): Weight, mortality, feed intake, eggs/day, shell quality, intake status.

Detailed flows

Report Health Issues (intent 2)

- Collects: incident type (sickness, mortality, feed rejection), date (YYYY/MM/DD), affected count, symptoms, suspected cause, immediate actions, any feed info.
- Validations: asks one missing item at a time; dates must be YYYY/MM/DD; always includes a vet disclaimer.
- Assistant behavior: gives immediate, practical guidance; then confirms logging when complete.
- Example (you): “May namatay kahapon 2025/08/10, 5 birds, matamlay at may sipon.”
- Example (assistant): “Salamat sa detalye. Ire‑record ko ang mortality incident (2025/08/10, 5 birds). Magpahinga ang apektado, hiwalay sila, at kumunsulta sa vet. May binanggit bang pakain o batch code?”
- Stored as: health incident log.
- Reference: @prompts/ask_farmer_health_log.json.

Log Farm Performance (intent 7)

- Collects: average weight, mortality count, bags used, feed intake, eggs/day, shell quality issues, feed intake status, general health; plus summary notes.
- Validations: asks only for missing fields; confirms a clear summary.
- Assistant behavior: warm, farmer‑friendly tone; confirms when saved.
- Example (you): “Weekly report: 1.6 kg average weight, 2 mortality, 25 bags, intake normal.”
- Example (assistant): “Sige. Ire‑record ko: 1.6 kg average weight, 2 mortality, 25 bags used, intake normal. May dagdag ka pa bang detalye?”
- Stored as: performance report log.
- Reference: @prompts/ask_farmer_log.json.

Ask if Safe (intent 3) — DIY or Feed Safety

- Collects: exact DIY practice; classifies as safe, caution, or for R&D review; suggests next step (await review, validated safe, or seek professional advice).
- Validations: safety‑minded language; does not over‑promise; keeps a record for research.
- Assistant behavior: supportive and careful; ends with a vet/tech consultation reminder if needed.
- Example (you): “Naglalagay kami ng herbal mix once a week para sa appetite.”
- Example (assistant): “Salamat sa pagbahagi. Ilalagay ko ito bilang DIY practice (for R&D review). Bantayan ang intake at kalagayan, at kumunsulta sa vet kung may pagbabago.”
- Stored as: DIY practice submission.
- Reference: @prompts/ask_farmer_diy_log.json, @prompts/ask_farmer_general_questions.json.

Ask Question (intent 0)

- Purpose: general questions, feed advisory, product matching, switching guidance.
- Behaviors: may classify your intent; provide benchmarks (weight/FCR/laying), next‑feed timing, and product match when applicable.
- Reference: @prompts/ask_farmer_general_questions.json, @prompts/ask_farmer_intent.json.

### Suggested prompts in the UI

- The UI suggests short starters depending on what you pick (e.g., sales daily summary, territory update, health issue, feed consumption, etc.). These are just shortcuts to help you phrase entries.

### Intent → prompt reference (for maintainers)

Sales Rep

- 7 Sales Report → ask_salesrep_sales_log.json
- 8 Farm Visit → ask_salesrep_farm_log.json
- 2 Dealer Problems → ask_salesrep_dealer_log.json
- 3 Product or Field Issues → ask_salesrep_product_field_log.json
- 0 Ask Question → ask_sales_rep_general_questions.json + ask_salesrep_intent.json

Farmer

- 2 Report Health Issues → ask_farmer_health_log.json
- 7 Log Farm Performance → ask_farmer_log.json
- 3 Ask if Safe → ask_farmer_diy_log.json and ask_farmer_general_questions.json (feed advisory)
- 0 Ask Question → ask_farmer_general_questions.json + ask_farmer_intent.json

Notes

- “Ask Question” is free chat and may route to the right flow based on your message.
- Feed advisory responses include product matching, benchmarks, and transition guidance when relevant.

---

## Tips & Troubleshooting

Tips

- Start your day on the dashboard to see priorities.
- Use filters to focus on the right region, dealer, or timeframe.
- Log small updates often so reports and charts stay meaningful.
- Complete any onboarding flows promptly - they're required for system access.
- Use tooltips and help icons for detailed feature explanations.
- Take advantage of the calculator tools for accurate planning.

Troubleshooting

- I can't find someone I invited: Check the Users/Team list or resend the invite.
- My map/list looks empty: Clear filters or expand the date range.
- I think I'm seeing the wrong dashboard: Ask an Admin to review your role.
- Company setup modal won't close: Complete all required fields before the modal can be dismissed.
- Feed program setup stuck: Ensure you've selected a feed product before continuing. The onboarding cannot be skipped.
- Farmer dashboard seems blocked: Complete the mandatory Feed Program Manager onboarding - it's required for dashboard access.
- Can't access farmer features: Verify your feed program setup was completed. Some features require an active feed program.
- Chat not responding properly: Check that you're using the correct date format (YYYY/MM/DD) and exact product names.
- Authentication issues: Clear browser cache and try again, or use the "Forgot Password" link.
- Role permission errors: Contact your administrator to verify your role assignment.
