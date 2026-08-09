import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(events);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
