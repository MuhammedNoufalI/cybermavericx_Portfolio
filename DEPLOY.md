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

## Files

- `public/uploads/` — images only, served by `/uploads/[filename]`.
- `private_uploads/` — the CV; only reachable via `POST /api/download/cv` with a
  valid reCAPTCHA token. Back this folder up along with `public/uploads/`.
