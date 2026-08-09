import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rsvps = await prisma.rSVP.findMany({
      include: {
        event: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { event: { date: "asc" } },
    });

    return NextResponse.json(rsvps);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch rsvps" },
      { status: 500 }
    );
  }
}
