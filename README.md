# Harbor - Privacy-First Mental Health Tracker

Harbor is a mental health web application focused on emotional safety, speed, and strict privacy boundaries.

Built with React, Tailwind CSS, Firebase Authentication, and Firestore.

## Highlights

- Fast mood check-ins (single tap + optional note)
- 30-minute cooldown between mood submissions
- Day-wise mood timeline with notes and date range filters (default: last 7 days)
- Daily journal with search and range filters
- Weekly insight summary and streak tracking
- Admin panel for user management and non-sensitive operations only

## Roles

### User

- Can read/write only their own mood and journal data
- Can export their own data as JSON
- Can reset password and sign in with Google

### Admin

- Can view user directory (email, full name, status, join date)
- Can activate/deactivate users
- Can manage support messages
- Cannot read private mood notes or journals

## Security Model

Security rules are defined in [firestore.rules](firestore.rules).

Privacy guarantees:

- `moods` and `journals` are owner-only (read/write only by the same user)
- Admin cannot read private emotional entries
- `users` profile is self-readable or admin-readable only
- Account status changes are admin-only
- `supportMessages` write access is admin-only
- `adminStats/overview` write access is admin-only (prevents normal-user analytics tampering)

### Important architecture note

Client-side writes to `adminStats` are intentionally disabled for security.
If you need reliable aggregate analytics (total moods, distributions), compute and update `adminStats` from a trusted backend path (e.g., Cloud Functions with Admin SDK).

## Firestore Collections

### `users/{uid}`

- `uid`
- `email`
- `fullName`
- `role` (`user` | `admin`)
- `status` (`active` | `inactive`)
- `createdAt`
- `lastActiveAt`

### `moods/{autoId}`

- `userId`
- `mood` (`happy` | `neutral` | `sad` | `angry`)
- `note`
- `dayKey` (`yyyy-MM-dd`)
- `createdAt`

### `journals/{userId_date}`

- `userId`
- `date` (`yyyy-MM-dd`)
- `text`
- `createdAt`
- `updatedAt`

### `supportMessages/{id}`

- `text`
- `createdBy`
- `createdAt`
- `updatedAt`

### `adminStats/overview` (optional backend-managed aggregate doc)

- `totalMoods`
- `moodDistribution`
- `updatedAt`

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Create local env file.

```bash
cp .env.example .env
```

3. Fill Firebase config values in `.env`.

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

4. Start development server.

```bash
npm run dev
```

5. Build for production.

```bash
npm run build
```

## Firebase Setup

1. Enable Authentication providers in Firebase Console.

- Email/Password
- Google

2. Create Firestore database (production mode recommended).

3. Deploy Firestore rules and indexes.

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

4. Optional: bind local project alias.

```bash
firebase use <project-id>
```

## GitHub Push Safety Checklist

Run these before pushing:

1. Lint and build must pass.

```bash
npm run lint && npm run build
```

2. Verify `.env` is not committed.

- `.env` and `.env.*` are gitignored
- only `.env.example` should be in repo

3. Confirm `firestore.rules` and `firestore.indexes.json` are up to date.

4. Do not commit local logs or temporary exports.

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - build production bundle
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

## Recommended Next Hardening

- Move admin analytics aggregation to Cloud Functions (Admin SDK)
- Add App Check and rate limits for abuse resistance
- Add Firebase Hosting headers (CSP, X-Frame-Options, Referrer-Policy)
