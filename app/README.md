# University Practical Work Opportunities Platform

> A platform connecting university students with NGOs and small businesses for practical training opportunities.

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
  - [Docker Deployment](#docker-deployment)

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

**⚠️ IMPORTANT: The theme system uses a centralized configuration file.**

**Do NOT edit `app/globals.css` directly** - it is auto-generated!

#### How to Change Theme Colors

**Step 1: Edit the theme configuration file**

Edit `resources/theme/colors.ts`:

```
export const themeColors = {
light: {
primary: '#14b8a6',           // Change this to your university color
primaryHover: '#0d9488',
primaryLight: '#5eead4',
primaryDark: '#0f766e',
primaryForeground: '#ffffff',

        // ... more colors
    },
    dark: {
        primary: '#5eead4',           // Dark mode equivalent
        // ... more colors
    },
}
```

**Step 2: Generate CSS from configuration**

```
npm run theme:generate
```

This will automatically update:
- `app/globals.css` (auto-generated)
- Email templates (automatically use the same colors)
- All UI components

---

### 3. Internationalization (i18n)

The platform supports multiple languages. Default: English and Romanian.

#### File Structure

```
resources/messages/
├── en.ts              # English translations
└── ro.ts              # Romanian translations
```

#### Adding/Modifying Languages

**Step 1: Update `src/utils/i18n/ty;es.ts`**

```
export const locales = ['en', 'ro', 'de'] as const;  // Add 'de' for German
export const defaultLocale = 'en' as const;
```

**Step 2: Create Message File**

Create `resources/messages/de.ts` following the same structure as `en.ts`.

---

### 4. Database Configuration

#### Environment Variables

Create a `.env` file following the `.env.example`.

#### Generate Secure Session Secret

```
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
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
# Generate theme CSS
npm run theme:generate

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
npm run db:migrate

# If migrations exist, just apply them
npm run db:migrate:deploy
```

### Reset Database (Development)

```
npx prisma migrate reset
```

---

## 🚀 Deployment

### Docker Deployment (Recommended)

Docker provides a consistent environment across all platforms.

### Other Deployment Platforms

| Platform | Notes |
|----------|-------|
| **Docker** | Recommended - works everywhere |
| **Railway** | Built-in PostgreSQL, easy deployment |
| **Render** | Free tier available, persistent containers |
| **DigitalOcean App Platform** | Managed containers + database |
| **Fly.io** | Global edge deployment |
| **VPS (DigitalOcean, Linode)** | Full control, Docker recommended |

### Vercel/Serverless Platforms

⚠️ **Note**: The token cleanup cron job requires a persistent Node.js process. If deploying to Vercel or other serverless platforms, you must use their built-in cron features or external cron services.

---

## 📄 License

Copyright © 2025 Babeș-Bolyai University. All rights reserved.

Made by Antonio Hus as part of bachelor thesis.