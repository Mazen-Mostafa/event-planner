"use server";

import { z } from "zod";
import { getAppUser } from "./app-user";
import { prisma } from "./prisma";
import { revalidateTag } from "next/cache";
import { RSVPStatus } from "./models";

export type CreateEventState = {
  success: boolean;
  eventId: string | null;
  error: string;
};

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  maxAttendees: z.string().optional(),
  isPublic: z.string().optional(),
});

export async function createEvent(
  _prevState: CreateEventState,
  formData: FormData
): Promise<CreateEventState> {
  try {
    const user = await getAppUser();

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      location: formData.get("location"),
      maxAttendees: formData.get("maxAttendees"),
      isPublic: formData.get("isPublic"),
    };

    const validatedData = eventSchema.parse(rawData);

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        location: validatedData.location,
        maxAttendees: validatedData.maxAttendees
          ? Number(validatedData.maxAttendees)
          : null,
        isPublic: validatedData.isPublic === "on",
        userId: user.id,
      },
    });

    return { success: true, eventId: event.id, error: "" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        eventId: null,
        error: error.issues[0]?.message ?? "Invalid input",
      };
    }

    return { success: false, error: "Failed to create event", eventId: null };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidateTag("events", "max");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete the event" };
  }
}

export async function rsvpToEvent(eventId: string, status: RSVPStatus) {
  try {
    const user = await getAppUser();

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    if (!existingEvent.isPublic) {
      return { success: false, error: "Event is not public" };
    }

    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId,
        },
      },
    });

    if (existingRSVP) {
      await prisma.rSVP.update({
        where: {
          userId_eventId: {
            userId: user.id,
            eventId,
          },
        },
        data: { status },
      });
    } else {
      await prisma.rSVP.create({
        data: {
          userId: user.id,
          eventId,
          status,
        },
      });
    }

    revalidateTag("events", "max");
    revalidateTag(`event-${eventId}`, "max");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to RSVP" };
  }
}
