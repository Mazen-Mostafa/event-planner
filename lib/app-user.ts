import { prisma } from "./prisma";

const APP_USER_EMAIL = "app@event-planner.local";
const APP_USER_NAME = "Event Planner";

/** Ensures a single app user exists for DB-backed actions (no auth). */
export async function getAppUser() {
  return prisma.user.upsert({
    where: { email: APP_USER_EMAIL },
    update: {},
    create: {
      email: APP_USER_EMAIL,
      name: APP_USER_NAME,
    },
  });
}
