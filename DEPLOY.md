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

pm2 runs one fork-mode process named `portfolio` (`pm2 start ecosystem.config.js` on a
fresh server, then `pm2 save`). Don't start a second copy — both would fight for port 3021.

## Content visibility

Every public section renders only when it is **Published** in Admin → Sections **and** has
content. Sections live on pages: Home (About, Testimonials, Custom), Journey (Experience,
Education, Skills, Certifications, Awards + CV), Projects, Blog. A page and its menu/footer
link exist only while one of its sections is visible (Journey also counts the CV). The nav,
footer, CTAs and admin preview all use `getPortfolio()` in `src/lib/sections.ts`.

## Caching (why navigation is instant)

Public pages (Home, Journey, Projects, Blog, blog posts, Contact, Privacy, favicon) are
pre-rendered and served from Next's cache; menu links are prefetched, so clicks don't wait
for the server. Every admin save calls `revalidatePath('/', 'layout')`, which regenerates
them immediately; `revalidate = 3600` is only a safety net (e.g. for direct DB edits).
Blog search is the only per-request public page (`/blog/search?q=`).
`npm run build` reads the database, so the DB must be reachable at build time.

## CV download tracking

- **Tracked links** (Admin → Tracked Links): personal URLs like `/?r=enbd-sara-hr-7f3k`.
  Opening one sends a Telegram "tracked link opened" alert (once per link+IP per 30 min);
  later CV downloads and contact messages name the link. Stored in first-party cookies for 90 days.
- **Every verified CV download** is saved (Admin → CV Downloads) with the IP owner
  (company/ISP via ipapi.co free tier), location, first-touch source (referrer / utm_source)
  and device. Lookups time out after 2.5 s and never delay the download.
- Times are shown in `NOTIFY_TIMEZONE` (default `Asia/Dubai`).
- Disclosed on `/privacy` (footer link).

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
