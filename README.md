# Portfolio CMS

Personal portfolio with a built-in CMS — Next.js 16, Prisma 5, MySQL 8.4.

- **Public site:** Home (hero + About), Journey (Experience, Education, Skills, Certifications,
  Awards + CV download), Projects, Blog, Contact. Every section, page and menu link appears only
  when it has published content (`src/lib/sections.ts`).
- **Admin (`/admin`):** content editors with a Markdown toolbar, per-section Published/Disabled
  switches and ordering, live preview, messages, tracked links and CV download history.
- **Protection:** reCAPTCHA Enterprise (policy-based) on the contact form and CV download,
  per-IP rate limits, signed admin session, security headers.
- **Notifications:** Telegram alerts for contact messages, CV downloads and tracked-link visits.

## Local development

```bash
cp .env.example .env          # fill in values
npm ci
npx prisma db push            # create/update tables
npm run dev
```

Without reCAPTCHA keys, verification is skipped in development only (production fails closed).

## Deploy

See [DEPLOY.md](DEPLOY.md).
