# University Practical Work Opportunities Platform

> 🎓 A platform connecting university students with NGOs and small businesses for practical training opportunities.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Customization Guide](#customization-guide)
  - [1. Branding & Images](#1-branding--images)
  - [2. Theme & Colors](#2-theme--colors)
  - [3. Internationalization (i18n)](#3-internationalization-i18n)
  - [4. Database Configuration](#4-database-configuration)
- [Running the Application](#running-the-application)
- [Database Setup](#database-setup)
- [Deployment](#deployment)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn

### Installation

```
# Clone the repository
git clone https://github.com/antonio-hus/student-opportunities-platform
cd student-opportunities-platform/app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Configure database (see Database Configuration below)
# Edit .env and add your DATABASE_URL

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## 🎨 Customization Guide

### 1. Branding & Images

All public assets are located in the `public/` folder.

#### Files to Replace:

```
public/
├── favicon.ico          # Browser tab icon (16x16, 32x32, 48x48)
├── logo.svg             # Main platform logo (used in header)
├── logo-light.svg       # Logo for dark mode (optional)
├── og-image.jpg         # Social media preview image (1200x630)
```

#### Recommendations:

- **Favicon**: Use a simple, recognizable icon of your university
- **Logo**: SVG format preferred for scalability
- **OG Image**: Include university name and platform tagline

**Example:**
```
# Replace favicon
cp your-university-favicon.ico public/favicon.ico

# Replace logo
cp your-university-logo.svg public/logo.svg
```

---

### 2. Theme & Colors

The design system is centralized in `app/globals.css`.

#### Color Variables

Edit the `:root` section for light mode colors:

```
/* app/globals.css */

:root {
/* Primary color (main accent - buttons, links) */
--primary: #14b8a6;          /* Teal by default */
--primary-hover: #0d9488;
--primary-light: #5eead4;
--primary-dark: #0f766e;

/* Secondary color (supporting elements) */
--secondary: #64748b;        /* Slate by default */
--secondary-hover: #475569;

/* Accent color (highlights, CTAs) */
--accent: #f59e0b;           /* Amber by default */
--accent-hover: #d97706;

/* ... more colors */
}
```

#### Quick Theme Change

**Example: Change to University Blue Theme**

```
:root {
--primary: #1e40af;          /* Deep Blue */
--primary-hover: #1e3a8a;
--primary-light: #3b82f6;
--primary-dark: #1e3a8a;
}
```

**Example: Change to University Red Theme**

```
:root {
--primary: #dc2626;          /* Red */
--primary-hover: #b91c1c;
--primary-light: #ef4444;
--primary-dark: #991b1b;
}
```

#### Dark Mode Colors

Edit the `@media (prefers-color-scheme: dark)` section:

```
@media (prefers-color-scheme: dark) {
:root {
--primary: #5eead4;        /* Lighter shade for dark mode */
--primary-hover: #2dd4bf;
/* ... adjust other colors */
}
}
```

---

### 3. Internationalization (i18n)

The platform supports multiple languages. Default: English and Romanian.

#### File Structure

```
i18n/
├── config.ts              # Language configuration
└── messages/
├── en.ts              # English translations
└── ro.ts              # Romanian translations
```

#### Adding/Modifying Languages

**Step 1: Update `i18n/config.ts`**

```
export const locales = ['en', 'ro', 'de'] as const;  // Add 'de' for German
export const defaultLocale = 'en' as const;
```

**Step 2: Create/Edit Message Files**

`messages/en.ts`:
```
export default {
metadata: {
title: "Your University Name - Practical Work Platform",
description: "Connect students with opportunities",
},
auth: {
login: {
title: "Sign In",
subtitle: "Welcome back to the platform",
email: "Email",
password: "Password",
// ... more translations
}
}
} as const;
```

`messages/ro.ts`:
```
export default {
metadata: {
title: "Nume Universitate - Platformă de Practică",
description: "Conectează studenții cu oportunități",
},
auth: {
login: {
title: "Autentificare",
subtitle: "Bine ai revenit pe platformă",
email: "Email",
password: "Parolă",
// ... more translations
}
}
} as const;
```

---

### 4. Database Configuration

#### Environment Variables

Edit `.env`:

```
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/university_platform?schema=public"

# Session Security (generate a random 32-character string)
SESSION_SECRET="your-super-secret-random-string-here-min-32-chars"

# Email (optional - for verification emails)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="noreply@youruniversity.ro"
SMTP_PASS="your-email-password"
```

#### Generate Secure Session Secret

```
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

#### Initial Platform Settings

Edit `prisma/seed.ts` to customize initial configuration:

```
const config = await prisma.platformConfiguration.upsert({
where: { id: 'default' },
update: {},
create: {
id: 'default',
universityName: 'Your University Name',           // ← Change this
primaryColor: '#14b8a6',                          // ← Match globals.css
secondaryColor: '#64748b',
studentEmailDomain: '@stud.youruniversity.ro',    // ← Change this
staffEmailDomain: '@youruniversity.ro',           // ← Change this
requireOrgVerification: true,
requireProjectApproval: true,
enablePortfolioFeature: true,
},
})
```

---

## 🏃 Running the Application

### Development Mode

```
npm run dev
```

Access at: `http://localhost:3000`

### Production Build

```
# Build the application
npm run build

# Start production server
npm start
```

---

## 🗄️ Database Setup

### Run Migrations

```
# Create and apply migrations
npm run db:init

# If migrations exist, just apply them
npm run db:migrate:deploy
```

### Seed Initial Data

```
npm run db:seed
```

This creates:
- Default platform configuration
- Admin user (email: `admin@youruniversity.ro`, password: `admin`)

⚠️ **Important**: Change the admin password after first login!

### Reset Database (Development)

```
npx prisma migrate reset
```

---

## 🚀 Deployment

### Environment Variables (Production)

Ensure these are set on your hosting platform:

```
DATABASE_URL="your-production-database-url"
SESSION_SECRET="your-production-secret-min-32-chars"
NODE_ENV="production"
```

### Recommended Platforms

- **Vercel** (easiest for Next.js)
- **Railway** (includes PostgreSQL)
- **DigitalOcean App Platform**
- **AWS Amplify**

### Vercel Deployment

```
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Project Settings > Environment Variables
```

---

## 📄 License

Copyright © 2025 Babes-Bolyai University. All rights reserved.
Made by Antonio Hus as part of bachelor thesis.