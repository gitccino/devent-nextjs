import { Event } from "@/lib/models";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Check if a string is a valid slug format
const isValidSlug = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();

    const { slug } = await params;

    if (!slug || !isValidSlug(slug)) {
      return NextResponse.json(
        {
          message: "Invalid or missing slug parameter",
        },
        { status: 400 },
      );
    }

    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `Event with slug ${slug} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 },
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Error fetching events by slug",
        error instanceof Error ? error.message : "Unknown errors",
      );
    }

    return NextResponse.json(
      {
        message: "Failed to fetch events",
      },
      { status: 500 },
    );
  }
}
