# FAP Scout App

Free Agent Portal - Scout Platform

A mobile-first web application for scouts to search athletes and generate detailed scout reports.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Documentation of Features

## Project Structure

```
src/
├── app/                 # Next.js app router
├── components/          # Reusable UI components
├── layout/             # Layout components (AuthGuard, providers)
├── views/              # Page views (Login, Dashboard)
├── state/              # State management
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## Features

- 🔐 **Secure Authentication** - Token-based auth with protected routes
- 📱 **Mobile-First Design** - Optimized for phones and tablets
- 🏈 **Scout Tools** - Athlete search and report generation
- ⚡ **Smooth Animations** - Framer Motion powered interactions
- 🎨 **Modern UI** - Professional sports-themed design

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: SCSS with CSS custom properties
- **Animations**: Framer Motion
- **State**: Zustand + React Query
- **HTTP**: Axios

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
