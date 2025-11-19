# Solace Candidate Assignment

A full-stack application for finding and connecting with healthcare advocates. This project demonstrates a modern onboarding flow, robust search and filtering capabilities, and a scalable database architecture.

## Features

- **Guided Onboarding:** A step-by-step flow to capture user health concerns and location.
- **Advocate Search:** Find advocates based on city, health concerns, and name.
- **Advanced Filtering:** Filter results by years of experience and education level.
- **Responsive UI:** Built with Tailwind CSS for a seamless experience across devices.
- **Realistic Data Seeding:** Custom scripts to generate realistic mock data for advocates and specializations.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Containerization:** [Docker](https://www.docker.com/)

## Prerequisites

- **Node.js:** v24.11.1 (recommended, see `.nvmrc`)
- **Docker:** Required for running the PostgreSQL database.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

The project uses a PostgreSQL database. The connection string is configured in `.envrc` (for `direnv` users) or can be set in a `.env` file.

```bash
# Example .env content
DATABASE_URL="postgresql://postgres:password@localhost/solaceassignment"
```

### 3. Start the Database

Use Docker Compose to spin up the PostgreSQL container. This will automatically create the `solaceassignment` database.

```bash
docker-compose up -d
```

### 4. Database Migration & Seeding

Once the database is running, run the migrations to set up the schema and seed it with mock data.

```bash
# Run migrations
npm run migrate:up

# Seed the database with mock data
npm run seed
```

### 5. Run the Application

Start the Next.js development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint.
- `npm run db:gen`: Generates Drizzle migration files based on schema changes.
- `npm run db:push`: Applies pending migrations to the database.
- `npm run db:seed`: Populates the database with initial mock data.
- `npm run db:reset`: Resets the database (clears data and re-seeds).

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   │   ├── api/             # Backend API endpoints
│   │   └── page.tsx         # Main frontend logic
│   ├── components/          # Reusable UI components
│   ├── db/                  # Database configuration, schema, and seeds
│   └── lib/                 # Utility functions
├── public/                  # Static assets
├── drizzle.config.ts        # Drizzle ORM configuration
├── docker-compose.yml       # Docker configuration for PostgreSQL
└── package.json             # Project dependencies and scripts
```

## API Endpoints

- `GET /api/advocates`: Search and filter advocates.
- `GET /api/health-concerns`: Retrieve a list of available health concerns.
- `GET /api/cities`: Retrieve a list of cities with available advocates.
