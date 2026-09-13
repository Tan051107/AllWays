# AllWays

**Accessible group travel, planned around everyone's needs — not the average traveler's.**

AllWays is a React and Vite prototype for accessible group-travel planning. It bakes mobility, comfort, safety, and shared-cost concerns directly into the planning engine instead of leaving them as afterthoughts. Every itinerary is generated, adapted, and verified to keep the whole group moving together.

---

## The Screens

Each screen below is framed as a **problem** the group faces and the **solution** AllWays provides.

### 1. Host Preferences — Accessibility as a first-class trip setting

<img src="docs/screens/01-host-preferences.png" alt="Host Preferences screen showing accessibility toggles" width="553" />

**Problem:** Group trips usually treat accessibility as an afterthought. By the time someone realizes a station has no elevator or a restaurant has stairs, the plan is already locked in and hard to change.

**Solution:** During trip creation, the host sets accessibility and comfort needs once — wheelchair access, elevator-only transfers, and nearby accessible restrooms. These become the trip's permanent planning rules, powering a 100% step-free draft itinerary, and the rest of the group can add their own needs from the shared planning workspace.

---

### 2. Today View — Live, adaptive daily guidance

<img src="docs/screens/02-today-view.png" alt="Today View showing schedule, disruption alert, and adaptive timing" width="370" />

**Problem:** A carefully planned accessible route can break in real time — an elevator goes out of service and suddenly the "planned" path includes 24 stairs the group can't use.

**Solution:** The Today view tracks the live schedule and detects disruptions as they happen. When Shinjuku's elevator goes offline, it instantly proposes a verified 100% step-free alternative (with boarding-gap details and working lifts), preserves the arrival buffer, and lets Waylo recalculate departure timing and rest breaks based on real walking and rolling speed.

---

### 3. Itinerary Planning — Collaborative, review-before-apply planning

<img src="docs/screens/03-itinerary-planning.png" alt="Itinerary planning screen for Penang Food Weekend with invite and Waylo suggestions" width="503" />

**Problem:** Coordinating a group itinerary means endless back-and-forth, and it's easy to add a stop that quietly doesn't work for someone's accessibility needs.

**Solution:** Each trip has a shared planning workspace with an invite code, per-member profile completion tracking, and a "request group review" gate. Travelers ask Waylo to adjust a day (more rest, more food options, lower fatigue) and it proposes changes before applying them. Every stop shows accessibility flags (step-free seating, vegetarian options) with an explicit "confirm accessibility" step.

---

### 4. Budget & Savings — Cutting cost without cutting accessibility

<img src="docs/screens/04-budget-savings.png" alt="Budget and savings screen with AI budget rescue and protected accessibility items" width="277" />

**Problem:** When a group goes over budget, the easiest things to cut are often the accessible options — the step-free van, the wider-clearance restaurant — which quietly excludes members.

**Solution:** The budget guard forecasts overspending per member and group-wide, then "AI Budget Rescue" finds savings that never compromise accessibility. It swaps an evening taxi for a verified step-free metro and a pricey dining reservation for an equally accessible alternative, while must-have accessible bookings are explicitly locked and protected from cuts.

---

### 5. Add Shared Expense — Fair, flexible cost splitting

<img src="docs/screens/05-shared-expense.png" alt="Shared expense screen with custom split and receipt scanning" width="365" />

**Problem:** Splitting group costs is fiddly and error-prone — not everyone shares every expense equally, and manual entry invites mistakes and disputes.

**Solution:** Shared expenses can be captured by scanning a receipt (auto-filling title, amount, category, date) and split however the group needs — whole receipt or by item, equally or custom amounts. The screen shows who's sharing, a live allocation breakdown, and flags any unallocated difference before the expense is saved.

---

### 6. Settlement Details — Transparent, minimized debt settlement

<img src="docs/screens/06-settlement.png" alt="Settlement details screen showing who owes whom and route minimization" width="554" />

**Problem:** After a group trip, everyone owes everyone a little, producing a tangle of tiny payments that are confusing and easy to lose track of.

**Solution:** Settlement separates "you owe" from "owed to you," and Waylo's Direct Route Minimization nets out debts — pairing custom dinner splits with an earlier accessible van booking to collapse 12 transactions down to 3. A clear two-step flow (payer marks paid externally, receiver confirms receipt) closes each debt without ambiguity.

---

### 7. Group Member Offline — Proactive safety check-ins

<img src="docs/screens/07-member-offline.png" alt="Group member offline safety dialog with escalation options" width="552" />

**Problem:** In an unfamiliar city, a group member can fall behind or lose connection, and no one notices until it's genuinely worrying.

**Solution:** When a member's location stops updating, AllWays alerts the group and asks them to confirm the person is safe. Options are clear — mark them safe, contact emergency, or check in personally — and if no one responds, the app automatically escalates to emergency services and designated contacts.

---

### 8. Off-Route Divergence Alert — Automatic safety integrity checks

<img src="docs/screens/08-off-route-alert.png" alt="Off-route divergence alert with auto-escalation timer and PIN confirmation" width="532" />

**Problem:** Straying from a verified step-free corridor into an unmapped stair sector can leave a traveler stuck or in danger, with no built-in safeguard.

**Solution:** AllWays continuously checks position against the designated step-free route. On a significant divergence it raises a Safety Integrity Check, starts an auto-escalation countdown to a designated contact, and requires a PIN to confirm the traveler is safe — turning a silent risk into a monitored, time-bound safety event.

---

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Setup

1. Open a terminal in the frontend folder:

   ```powershell
   cd frontend
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Create your local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Start the development server:

   ```powershell
   npm run dev
   ```

   Open `http://localhost:3000` in your browser.

---

## Adding the screenshots

The screen images referenced above live in `docs/screens/`. Save each screenshot with the matching filename:

| Screen | Filename |
| --- | --- |
| Host Preferences | `docs/screens/01-host-preferences.png` |
| Today View | `docs/screens/02-today-view.png` |
| Itinerary Planning | `docs/screens/03-itinerary-planning.png` |
| Budget & Savings | `docs/screens/04-budget-savings.png` |
| Add Shared Expense | `docs/screens/05-shared-expense.png` |
| Settlement Details | `docs/screens/06-settlement.png` |
| Group Member Offline | `docs/screens/07-member-offline.png` |
| Off-Route Divergence Alert | `docs/screens/08-off-route-alert.png` |
