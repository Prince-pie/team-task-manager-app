# TaskMaster - Team Task Manager

A premium full-stack task management application built with Next.js, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication**: Secure signup and login with JWT and Bcrypt.
- **Role-Based Access**: ADMIN and MEMBER roles.
- **Project Management**: Create, view, and manage projects.
- **Task Tracking**: Assign tasks, update status (Kanban-style), and set priorities.
- **Premium UI**: Modern glassmorphism design with responsive layouts.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), Lucide Icons, Framer Motion.
- **Backend**: Next.js API Routes, JWT, Bcrypt.
- **Database**: PostgreSQL with Prisma ORM.
- **Styling**: Vanilla CSS with modern custom properties.

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database (Local or Cloud)

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file based on `.env.example`:
```env
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_jwt_secret"
```

### 4. Database Setup
```bash
npx prisma db push
```

### 5. Run Locally
```bash
npm run dev
```

## 🌐 Deployment to Railway

1.  **Push to GitHub**: Create a repository and push this code.
2.  **Railway Setup**:
    - Link your GitHub account to Railway.
    - Click **New Project** > **Deploy from GitHub repo**.
    - Add a **PostgreSQL** service to your Railway project.
3.  **Environment Variables**:
    - Railway will automatically provide `DATABASE_URL` if you add the PostgreSQL service.
    - Manually add `JWT_SECRET`.
4.  **Build Command**: Railway should detect it as a Next.js app. Ensure the build command is `npm run build`.
5.  **Database Migration**: You can run `npx prisma db push` from the Railway CLI or add it to your `package.json` build step: `"build": "prisma generate && prisma db push && next build"`.

## 👤 Role Logic
- **Admin**: Can create projects and manage teams.
- **Member**: Can be assigned to projects and manage tasks within them.
