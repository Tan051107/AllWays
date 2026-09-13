# AllWays

**Accessible group travel, planned around everyone's needs — not the average traveler's.**

AllWays is a React and Vite prototype for accessible group-travel planning. It bakes mobility, comfort, safety, and shared-cost concerns directly into the planning engine instead of leaving them as afterthoughts. Every itinerary is generated, adapted, and verified to keep the whole group moving together.

---

## The Screens

### 1. Host Preferences — Accessibility as a first-class trip setting

<p align="center">
  <img src="docs/screens/01-host-preferences.png" alt="Host Preferences screen showing accessibility toggles" width="240" />
</p>

Group travel often ignores accessibility until it's too late. AllWays flips that: the host defines mobility and comfort needs upfront, the app generates a step-free draft itinerary, and the group adds their own needs from a shared planning workspace.

---

### 2. Today View — Live, adaptive daily guidance

<p align="center">
  <img src="docs/screens/02-today-view.png" alt="Today View showing schedule, disruption alert, and adaptive timing" width="240" />
</p>

A carefully planned accessible route can break in real time. AllWays watches the live schedule and reacts: when Shinjuku's elevator goes offline, it proposes a verified 100% step-free alternative, keeps the arrival buffer intact, and lets Waylo recalculate departure timing and rest breaks from real walking and rolling speed.

---

### 3. Itinerary Planning — Collaborative, review-before-apply planning

<p align="center">
  <img src="docs/screens/03-itinerary-planning.png" alt="Itinerary planning screen for Penang Food Weekend with invite and Waylo suggestions" width="240" />
</p>

Coordinating a group itinerary is endless back-and-forth, and it's easy to add a stop that quietly doesn't work for someone. AllWays gives each trip a shared planning workspace with an invite code and profile tracking, lets travelers ask Waylo to adjust a day before changes are applied, and flags accessibility on every stop with an explicit confirmation step.

---

### 4. Budget & Savings — Cutting cost without cutting accessibility

<p align="center">
  <img src="docs/screens/04-budget-savings.png" alt="Budget and savings screen with AI budget rescue and protected accessibility items" width="240" />
</p>

When a group goes over budget, the accessible options are usually the first things cut. AllWays forecasts overspending per member and group-wide, then finds savings that never compromise accessibility — swapping a taxi for a verified step-free metro and a pricey reservation for an equally accessible one, while must-have accessible bookings stay locked and protected.

---

### 5. Add Shared Expense — Fair, flexible cost splitting

<p align="center">
  <img src="docs/screens/05-shared-expense.png" alt="Shared expense screen with custom split and receipt scanning" width="240" />
</p>

Splitting group costs is fiddly and dispute-prone. AllWays lets you scan a receipt to auto-fill the details, then split however the group needs — whole receipt or by item, equally or custom amounts — with a live allocation breakdown that flags any unallocated difference before saving.

---

### 6. Settlement Details — Transparent, minimized debt settlement

<p align="center">
  <img src="docs/screens/06-settlement.png" alt="Settlement details screen showing who owes whom and route minimization" width="240" />
</p>

After a trip, everyone owes everyone a little, creating a tangle of tiny payments. AllWays separates what you owe from what you're owed, and Waylo's Direct Route Minimization nets debts down — collapsing 12 transactions into 3 — with a clear two-step flow where the payer marks paid and the receiver confirms.

---

### 7. Group Member Offline — Proactive safety check-ins

<p align="center">
  <img src="docs/screens/07-member-offline.png" alt="Group member offline safety dialog with escalation options" width="240" />
</p>

In an unfamiliar city, a group member can fall behind or lose connection before anyone notices. When a member's location stops updating, AllWays alerts the group to confirm they're safe, offers clear options to mark safe, contact emergency, or check in personally, and auto-escalates to emergency services and designated contacts if no one responds.

---

### 8. Off-Route Divergence Alert — Automatic safety integrity checks

<p align="center">
  <img src="docs/screens/08-off-route-alert.png" alt="Off-route divergence alert with auto-escalation timer and PIN confirmation" width="240" />
</p>

Straying from a verified step-free corridor into an unmapped stair sector can leave a traveler stuck or in danger. AllWays continuously checks position against the designated route, raises a Safety Integrity Check on a significant divergence, and starts an auto-escalation countdown that requires a PIN to confirm the traveler is safe.

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
