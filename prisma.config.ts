import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use process.env (not env()) so `prisma generate` works on Vercel
    // when DATABASE_URL is not available during postinstall.
    url: process.env.DATABASE_URL,
  },
});
