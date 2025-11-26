# Employee Management System (MERN Stack + TypeScript)

This is a full-stack **MERN** (MongoDB, Express, React, Node.js) Employee Management System project built using **TypeScript** in both backend and frontend.
The backend uses **Node.js + Express + TypeScript (CommonJS modules)** and the frontend uses **Next.js + TypeScript + Tailwind CSS + Shadcn UI**.

---

## Table of Contents

* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Environment Variables](#environment-variables)
* [Backend Setup](#backend-setup)
* [Frontend Setup](#frontend-setup)
* [Running the Project](#running-the-project)
* [Features](#features)
* [Tech Stack](#tech-stack)

---

## Project Structure

```
/Technical-assessment
│
├─ /backend              # Express + Node.js + TypeScript + MongoDB (CommonJS)
│   ├─ /src
│   │   ├─ /controllers
│   │   ├─ /models
│   │   ├─ /routes
│   │   ├─ /middlewares
│   │   ├─ /scripts
│   │   ├─ /utils
│   │   ├─ /types
│   │   ├─ /config
│   │   └─ server.ts
│   ├─ tsconfig.json
│   └─ package.json
│
├─ /frontend             # Next.js 16 + TypeScript
│   ├─ /app
│   ├─ /components
│   ├─ /hooks
│   ├─ /lib
│   ├─ /public
│   ├─ next.config.mjs
│   └─ package.json
│
└─ README.md
```

---

## Prerequisites

Make sure you have installed:

* **Node.js** (v18+ recommended)
* **npm** or **Yarn or pnpm**
* **Git**

---

## Environment Variables

### Backend (`/backend/.env`)

```
MONGO_URI=mongodb+srv://arunmozhivarmandev_db_user:v8KYtv6q1dMN3UdK@cluster0.k9vohzd.mongodb.net/?appName=Cluster0
DB_NAME=employee_management
JWT_SECRET=37ac8744f091925b25bb6168771d10b01c5aa93eb88bf543da623e655b16f5c3d2312a3bbb709701c1742427faa2316511db4bf8d289e6960e5e6ae01057ffbc
PORT=5000
JWT_EXPIRES_IN=1d
BASE_URL=http://localhost:5000
```

### Frontend (`/frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Backend Setup (TypeScript + CommonJS)

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```


Your backend will run at: [**http://localhost:5000**](http://localhost:5000)

---

## Frontend Setup (Next.js + TypeScript)

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

The frontend will run at: [**http://localhost:3000**](http://localhost:3000)

---

## Running the Project (Both Frontend & Backend)

1. Ensure MongoDB is connected.
2. Start backend:

```bash
cd backend
npm run dev
```

3. Start frontend:

```bash
cd frontend
npm run dev
```

4. Visit your app:

👉 [http://localhost:3000](http://localhost:3000)

---

## Features

* TypeScript in both frontend & backend
* JWT authentication (login, logout)
* Role-based access: **admin / user**
* CRUD operations for employees
* Image upload using **Multer**
* Pagination, search, and sorting
* Clean UI with **Tailwind CSS + Shadcn UI**
* Form validation using **Zod** + **React Hook Form**
* API consumption using axios

---

## Tech Stack

### Frontend

* **Next.js 16**
* **TypeScript**
* **Tailwind CSS**
* **Shadcn UI**
* **React Hook Form + Zod**

### Backend

* **Node.js + Express.js (CommonJS)**
* **TypeScript**
* **Mongoose**
* **Multer**
* **JWT Authentication**

### Database

* **MongoDB (Atlas)**

---

## Admin Bootstrap Information

When you start the backend for the first time, the system automatically creates a default Admin account using a bootstrap script.

### Default Admin Credentials

Email: admin@example.com
Password: Admin@123

This admin account is required to:

Manage employees

Manage users

Assign roles

Access admin-only dashboards

### API to Create Admin Manually

If the admin is not created automatically, you can manually trigger the admin creation API:

POST /api/auth/create-admin

No input body is required.

This will create the default admin user.
