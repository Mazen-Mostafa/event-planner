import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** Neon pooler URLs include channel_binding=require; strip it for drivers that don't support it. */
function connectionStringForNeon(url: string) {
  const parsed = new URL(url);
  parsed.searchParams.delete("channel_binding");
  if (!parsed.searchParams.has("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
  }
  return parsed.toString();
}

function createPrismaClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel → Settings → Environment Variables."
    );
  }

  const adapter = new PrismaNeon({
    connectionString: connectionStringForNeon(raw),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
