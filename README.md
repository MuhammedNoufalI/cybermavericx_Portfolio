This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🚀 Deployment (Ubuntu 24.04 LTS)

Follow these steps to deploy this portfolio on a fresh Ubuntu 24 server.

### 1. Prerequisites & System Update
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install common tools
sudo apt install -y curl git unzip

# Install Node.js 22 (LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Verify versions
node -v
npm -v
```

### 2. Setup Project
```bash
# Clone your repository
git clone <your-repo-url>
cd myown_portfolio

# Install dependencies
npm install

# Setup Environment Variables
# Create a .env file and add your secrets
nano .env
```

**Required .env content:**
```env
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_DATABASE="cybermavericx_portfolio_03052026"
DB_USERNAME="root"
DB_PASSWORD=""

DATABASE_URL="mysql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}"
```

### 3. Build & Initialize Database
```bash
# Generate Prisma Client
npx prisma generate

# Apply Database Migrations (for MySQL)
npx prisma migrate deploy

# Build the Next.js application
npm run build
```

### 4. Run with PM2 (Process Manager)
PM2 keeps your app running in the background and restarts it if it crashes or the server reboots.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the app
# --name "portfolio": Friendly name
# -- start: Executes 'npm run start'
pm2 start npm --name "portfolio" -- start

# Save PM2 list to respawn on reboot
pm2 save
pm2 startup
# (Run the command output by 'pm2 startup' to finalize)
```

### 5. (Optional) Nginx Reverse Proxy
To access your app via a domain or IP (port 80) instead of `:3000`.

```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/portfolio
```

**Nginx Config:**
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Updating the Application (Fix 502 Errors)
When pulling new changes (especially DB changes), run:
```bash
# Stop app (optional)
pm2 stop portfolio1

# Get code & deps
git pull
npm install

# Update Database & Client
npx prisma generate
npx prisma migrate deploy

# Rebuild
npm run build

# Restart
# Restart
pm2 restart portfolio1
```
*Note: The application is configured to run on port 3021 (CloudPanel default).*
