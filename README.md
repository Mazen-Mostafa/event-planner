# Event Planner

## Project overview

Event Planner is a full-stack web application for creating, browsing, and managing events. Users can publish events with details like date, location, and capacity, RSVP to public events, and view an overview of all events and RSVPs on a dashboard.

The app connects to a **Neon Postgres** database through **Prisma**. There is no authentication layer — create, edit, delete, and RSVP actions use a shared app user in the database so the focus stays on core event management features.

## Features

- Browse all events with search and upcoming / past filters
- Create new events (title, description, date & time, location, max attendees, public/private)
- View event details and attendee RSVP lists
- Edit and delete existing events
- RSVP to public events as **Going**, **Maybe**, or **Not Going**
- Dashboard with totals, upcoming/past stats, and lists of events and RSVPs
- Form validation with **Zod** on create and update

## Technologies used

- **Next.js 16** (App Router) — frontend and server actions / API routes
- **React 19** — UI components
- **TypeScript** — type-safe application code
- **Tailwind CSS 4** — styling
- **Prisma 7** — ORM
- **Neon Postgres** — hosted PostgreSQL database
- **`@prisma/adapter-neon`** — serverless-friendly database driver for Vercel
- **Zod** — input validation
- **date-fns** — date formatting
- **Vercel** — hosting and deployment

## Setup / install instructions

### Prerequisites

- Node.js 20 or later
- npm
- A Neon Postgres database ([console.neon.tech](https://console.neon.tech))

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/Mazen-Mostafa/event-planner.git
cd event-planner
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/neondb?sslmode=require"
```

Use the **pooled** Neon connection string (hostname includes `-pooler`). Prefer `sslmode=require`. You can omit `channel_binding=require`.

4. **Sync the database schema**

```bash
npx prisma db push
```

5. **Start the development server**

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Useful commands

| Command             | Description                                     |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Run the app in development mode                 |
| `npm run build`     | Generate Prisma Client and build for production |
| `npm start`         | Run the production build                        |
| `npm run lint`      | Run ESLint                                      |
| `npx prisma studio` | Browse database data in the browser             |

## Deployment link

Live app: [https://event-planner-mazen14.vercel.app](https://event-planner-mazen14.vercel.app)

> If the preview URL asks you to log in to Vercel, open the project’s **Production** domain in the Vercel dashboard, or turn off Deployment Protection under **Settings → Deployment Protection**.

### Deploying your own instance

1. Import the GitHub repo into [Vercel](https://vercel.com).
2. Add `DATABASE_URL` (Neon pooled connection string) for Production and Preview.
3. Deploy. After changing env vars, redeploy so they apply.

## Any other relevant information

### How identity works

The app does **not** use login or OAuth. Creates and RSVPs are tied to a shared database user (`app@event-planner.local`). The dashboard shows all events and RSVPs stored in the connected Neon database.

### Data models

- **User** — organizer / RSVP identity
- **Event** — title, description, date, location, max attendees, public flag
- **RSVP** — status (`GOING` | `MAYBE` | `NOT_GOING`), unique per user and event

### Project structure

```
app/           # Pages and API routes
components/    # UI components (navbar, lists, forms, RSVP)
lib/           # Prisma client, server actions, models
prisma/        # Prisma schema and migrations
```

### Notes

- Keep `.env` out of git; never commit database credentials.
- `postinstall` runs `prisma generate` so Vercel builds get a fresh Prisma Client.
- Zod validates event create/update payloads on the server before writing to the database.
