# 🔥 Checker Backend

This is the backend for the **Checker** to-do list app, built with [Hono.js](https://hono.dev/) and managed with [pnpm](https://pnpm.io/).

## 🛠 Tech Stack

- 🔥 [Hono.js](https://hono.dev/) – Lightweight web framework
- 📦 [pnpm](https://pnpm.io/) – Fast package manager
- 💙 [TypeScript](https://www.typescriptlang.org/) – Strongly typed JavaScript
- 🔐 [Better-Auth](https://www.better-auth.com/) – Authentication framework
- 🛆 [Prisma](https://www.prisma.io/) – lightning speed ORM
- 🗄️ [Postgresql](https://www.postgresql.org/) – Relatinal database
- 🧪️ [Vitest](https://vitest.dev/) – Testing framework

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/checker-backend.git
cd checker-backend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Run the development server

```bash
pnpm dev
```

⚠️ Make sure you have pnpm installed. If not:

```bash
npm install -g pnpm
```

### 📁 Project Structire

```
checker-backend/
├── src/
│   ├── index.ts        # Main entry point
│   ├── app.ts          # Application
│   └── routes/         # Route handlers
├── .env                # Environment variables (ignored in git)
├── .env.example        # Environment variables (exmaple)
├── tsconfig.json       # TypeScript configuration
├── pnpm-lock.yaml
└── README.md
```

### 📝 License

MIT
