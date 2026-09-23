# Deploy (CloudPanel, pm2)

Schema is managed with `prisma db push` — there are no migration files.

```bash
cd ~/htdocs/muhammednoufal.cybermavericx.com
git pull
npm ci
npx prisma generate
npx prisma db push            # applies schema changes (new tables are additive)
node scripts/move-cv-private.js   # keeps the CV out of public/ (idempotent)
npm run build
pm2 restart all
```

`.env` must contain every key in `.env.example`. Note `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
is baked in at build time — rebuild after changing it.

## Content visibility

Every public section (About, Experience, Projects, Skills, Education, Certifications,
Awards, Testimonials, Custom Sections, Blog) renders only when it is **Published** in
Admin → Sections **and** has content. The nav, footer, CTAs and admin preview all use
`getPortfolio()` in `src/lib/sections.ts`, so they can't disagree.

## reCAPTCHA Enterprise

Policy-based key bound to the submit button (`src/components/RecaptchaButton.tsx`);
server verification via the Assessment API with a service account (`src/lib/recaptcha.ts`).

| Protected form | Action | Endpoint |
|---|---|---|
| Contact form (`/contact`) | `submit_contact` | server action `submitMessage` |
| CV download (home) | `download_cv` (pending approval) | `POST /api/download/cv` |

Server checks, in order: honeypot (contact only) → missing token → per-IP rate limit
(DB-backed, 5/min, 30/h) → Assessment API (3 s timeout, fail closed) → token valid →
action matches → hostname allowed → score ≥ `RECAPTCHA_MIN_SCORE`. Every outcome is
logged as a JSON line tagged `recaptcha` with score and reasons (`pm2 logs`).
The browser only ever sees "Verification failed. Please try again."

The script loads only on pages with a protected form; the badge is hidden
(`visibility`) after navigating to a page without one.

## Files

- `public/uploads/` — images only, served by `/uploads/[filename]`.
- `private_uploads/` — the CV; only reachable via `POST /api/download/cv` with a
  valid reCAPTCHA token. Back this folder up along with `public/uploads/`.
