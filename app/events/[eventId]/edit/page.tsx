import EditEventForm from "@/components/EditEventForm";
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";
import { notFound } from "next/navigation";

function toDateTimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  await connection();
  const { eventId } = await params;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    notFound();
  }

  return (
    <EditEventForm
      event={{
        id: event.id,
        title: event.title,
        description: event.description,
        date: toDateTimeLocalValue(new Date(event.date)),
        location: event.location,
        maxAttendees: event.maxAttendees,
        isPublic: event.isPublic,
      }}
    />
  );
}
