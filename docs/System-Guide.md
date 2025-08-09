## Field‑IQ System Guide (All‑in‑One)

This single guide covers how people get access and what each role sees on their dashboard. It avoids technical jargon and focuses on what to do in the app.

### Contents

- Access & Invitations
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

If the invite link expires, use “Forgot password” on the sign‑in page or ask the inviter to resend.

Security basics

- Invite links are time‑limited and tied to the recipient’s email.
- Passwords are never sent by email.
- If using a shared device, sign out when done.

---

## Your Dashboard by Role

Below is a plain‑English tour of each dashboard block (the main sections/cards you’ll see). Each block lists what it shows, how to use it, and common actions.

### Admin Dashboard

User Manager

- What it shows: A list of users for your company with their role and status.
- How to use: Filter/search users; open a user to view details.
- Actions: Invite new users, update roles, activate/deactivate, resend invites.

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

- What it shows: FAQ cards/lists and usage stats.
- How to use: Search and filter FAQs; open one to edit.
- Actions: Create, edit, or retire FAQs to keep the knowledge base up‑to‑date.

### Sales Rep Dashboard

Visit Schedule

- What it shows: Daily planner with scheduled visits; quick access to directions.
- How to use: Pick a date; view stops and timing; open directions when traveling.
- Actions: Add/edit visits; get directions; adjust plans on the fly.

Farmer Manager

- What it shows: Your farmer accounts with key details and status badges.
- How to use: Search/filter; open a farmer to view details and history.
- Actions: Add farmers, invite new contacts, update account info.

Dealer Alert Log

- What it shows: A list of alerts grouped by dealer/farm, with statuses.
- How to use: Filter by status, type, or area; open an alert for detail.
- Actions: Acknowledge/resolve alerts; follow up with affected farms.

Monthly Sales Chart

- What it shows: Sales performance by month with trends.
- How to use: Change date range; compare periods.
- Actions: Identify peaks/dips; set targets for upcoming periods.

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

- What it shows: A simple calculator to estimate feed usage/needs.
- How to use: Enter inputs to get quick estimates.
- Actions: Share results with your team for planning.

Current Feed in Use

- What it shows: Snapshot of the feed currently being used.
- How to use: Review at a glance.
- Actions: Use in conversations with your rep or nutritionist.

### Super Admin (Dev) Dashboard

User Tools (internal)

- What it shows: Utilities for setting up/testing accounts.
- How to use: Generate account links; view user tables.
- Actions: Create company admins; support demos and QA.

---

## LLM Chat (Sales Rep & Farmer)

Who has access

- Available to Sales Reps and Farmers. Admins and Super Admins do not see the chat.

How to open

- Click the chat bubble in the page corner. You’ll see a short welcome and suggested prompts.

How it behaves

- The chat asks for one missing detail at a time (date format, product/feed name, location, etc.).
- It confirms when a log is complete; otherwise it will ask for the next needed detail.
- Product/feed names are validated against the catalog; dates should be in YYYY/MM/DD.

### Sales Rep: Chat categories and what they do

1. Sales Activity Log

- Purpose: Record a sale you just made.
- It will collect: date (YYYY/MM/DD), product sold (exact name), total amount, quantity, location/branch, farm name.
- What you say: “Sold 50 bags of Broiler Starter at San Isidro, Farm Delta, total ₱85,000 yesterday.”
- What happens: If any item is missing, the chat asks for it; then confirms the sale is recorded.

2. Farm Visit Log (Planned or Completed)

- Purpose: Add a planned visit or confirm a completed one.
- It will collect: visit type (planned/completed), date (YYYY/MM/DD), location, farm name, purpose; (optional) ticket number if you have one (format TKT-000(ID)-(NUMBER)).
- What you say: “Planned visit at San Pedro Farm on 2025/08/12 for product review.”
- What happens: It asks for any missing details and then confirms once recorded.

3. Dealer Issue Log

- Purpose: Report dealer problems to follow up (stockout, pricing problem, delivery delay).
- It will collect: problem summary, problem type, location, dealer name; optionally product affected.
- What you say: “Delivery delay at Luzon Feeds, San Juan. Broiler Finisher affected.”
- What happens: It clarifies missing fields, tags the issue, and confirms when saved.

4. Feed/Product Issue Log

- Purpose: Capture issues that seem feed- or product-related in the field.
- It will collect: short description, problem, feed name, location, farm name; may ask about birds affected/age only if you mentioned them.
- What you say: “Farm Delta reports feed refusal with Poultry Advantage Starter at Brgy. Sto Nino.”
- What happens: It classifies as feed- or product-related, asks for any missing details, and confirms logging.

5. Advisory, Guides, and Help (General Questions)

- Purpose: Quick answers, product matching, performance checks, downloading feeding guides, or routing help requests.
- Examples:
  - “Match a starter feed for 2-week broilers.” → Product match, benchmarks, and switching guidance.
  - “Download feeding guide.” → Provides a PDF/video guide link details.
  - “I need vet assistance.” → Routes as a help request (vet/technical/support).

Tips

- If the assistant asks for a date, use YYYY/MM/DD (e.g., 2025/08/11).
- Use exact product names from the catalog when possible. If unsure, the chat will try to help you pick the right one.

### Farmer: Chat categories and what they do

1. Health Incident Log

- Purpose: Report sickness, mortality, or feed rejection.
- It will collect: incident type (sickness/mortality/feed_rejection), date (YYYY/MM/DD), number affected, symptoms, suspected cause, immediate actions, any feed info.
- What you say: “May namatay kahapon 2025/08/10, 5 birds, matamlay at may sipon.”
- What happens: You’ll get guidance and a vet reminder; missing details are asked one by one; then the log is confirmed.

2. Performance Report Log (Daily/Weekly)

- Purpose: Record performance numbers regularly.
- It can include: average weight, mortality count, bags used, feed intake, eggs/day, shell quality issues, feed intake status, general health.
- What you say: “Weekly report: 1.6 kg average weight, 2 mortality, 25 bags, intake normal.”
- What happens: The chat summarizes, asks for any key missing info, and confirms the report is saved.

3. DIY Practice Log

- Purpose: Share a home/DIY practice for feeding or health.
- It classifies: safe, caution, or for R&D review; next step may be review or professional advice.
- What you say: “Naglalagay kami ng herbal mix once a week for appetite.”
- What happens: You’ll get a friendly, safety‑minded response and the practice is logged with the right tag.

4. Feed Advisory & Product Matching

- Purpose: Ask for the right feed, benchmarks, or switching timing.
- It provides: product match (if any), expected benchmarks (weight/FCR/laying rate), and when to switch feeds.
- What you say: “Ano ang recommended next feed after 21 days for broilers?”
- What happens: You get a clear answer and reasoning tailored to your stage and goals.

Tips

- For dates, use YYYY/MM/DD.
- If you didn’t mention numbers (like affected birds), the assistant won’t guess—expect a follow‑up question.

Limitations & good practice

- If a response seems off, rephrase with one extra detail (date, farm, area, or product).
- The chat guides your next step, but use your dashboard pages to review and confirm before taking action.

---

## Tips & Troubleshooting

Tips

- Start your day on the dashboard to see priorities.
- Use filters to focus on the right region, dealer, or timeframe.
- Log small updates often so reports and charts stay meaningful.

Troubleshooting

- I can’t find someone I invited: Check the Users/Team list or resend the invite.
- My map/list looks empty: Clear filters or expand the date range.
- I think I’m seeing the wrong dashboard: Ask an Admin to review your role.

Note: In‑app chat help can be added later for step‑by‑step guidance.
