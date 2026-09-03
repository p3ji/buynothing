# Buy Nothing

A clear, lightweight, and distraction-free web platform designed to facilitate hyperlocal Buy Nothing gifting without the friction of Facebook Groups.

---

## Core Problems Solved

1. **Unclaimed items no longer get buried**:
   - On message boards, unclaimed items sink down algorithmic feeds within hours.
   - Here, explicit states (`Available` $\rightarrow$ `Pending Pickup` $\rightarrow$ `Picked Up`) and a dedicated **"Unclaimed (2+ days)"** filter elevate items that haven't found a home.
   - If a neighbor flakes, a 1-click **"Flaked? Re-offer"** action restores the item back to `Available` without reposting.

2. **Replicating Facebook Messenger simplicity without the clutter**:
   - In-app chats are strictly anchored to `(Item, Giver, Requester)`.
   - Requesters click 1-tap availability slots (*"Today 5:30–7:00 PM"*) instead of comment spam.
   - Givers click **"Select Neighbor"** and safely drop their porch address into the private chat with 1-click address copy.

3. **Trust & Accountability**:
   - Transparent neighbor trust stats (*"28 given • 14 picked up • 100% completion rate"*).
   - Saved private porch address vault (only revealed to the chosen neighbor).
   - Phone verification (SMS OTP) for identity and pickup alerts.

---

## Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Run Automated Simulated UX Tests
```bash
npx tsx scripts/simulate-ux.ts
```

### Production Build
```bash
npm run build
```

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
