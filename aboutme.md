# Project Workflow & Documentation

## Overview
This project is a comprehensive, production-ready Portfolio and Blog application designed for a Cloud Systems Engineer. It features a modern, "Cyberpunk/DevOps" inspired design (dark mode, neon accents, sleek glassmorphism) tailored for an immersive user experience.

## Technology Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** TailwindCSS v4
- **Database:** MySQL (Migrated from file-based SQLite `dev.db` to MySQL for production readiness)
- **ORM:** Prisma
- **Icons:** Lucide-React
- **Fonts:** Geist Sans & Geist Mono (via Google Fonts `next/font`)

## Implemented Features
1. **Public Portfolio Pages:**
   - **Home (`/`):** Hero section with bio, dynamic typography, and primary navigation.
   - **Journey (`/journey`):** Timeline or list showcasing professional experience, jobs, and milestones.
   - **Contact (`/contact`):** Working contact form storing messages into the database, complete with social links (GitHub, LinkedIn).
   - **Showcase (`/showcase`):** Space for projects or achievements (additional custom route).

2. **Blog System (`/blog`):**
   - **Listing:** Displays a list of all published blog posts.
   - **Detail View:** Markdown rendering for blog content using `react-markdown`.
   - Dynamic routing and layout structure to avoid overlapping fixed navigation with content.

3. **Admin Dashboard (`/admin`):**
   - Access to manage content dynamically.
   - Content management capabilities for Blog posts and potentially projects.

4. **Database & Backend:**
   - **MySQL Integration:** Successfully migrated and imported to a local Laragon-hosted MySQL database (`cybermavericx_portfolio_03052026`).
   - The initial file-based SQLite approach (`dev.db`) was completely removed to avoid unwanted artifacts.
   - **Prisma Schema:** Configured to map seamlessly to models: `User`, `Profile`, `Job`, `Project`, `Blog`, `Certification`, `Message`, and `ExternalPage`.

## Future Development & Enhancements
- Enhance Admin Dashboard security/authentication.
- Implement more robust error handling or form validation feedback.
- Introduce caching for frequently accessed static content.
- Fine-tune responsive design components and dynamic color theming.

## Local Testing Setup
The application is configured to run on localhost for iterative testing and development.
- **Database Connection:** Driven by local Laragon environment (`root` user, no password).
- **Run Command:** Use `npm run dev` in the project root to start the server. Access the UI via `http://localhost:3000` (or `3021` depending on current `package.json` script overrides).
