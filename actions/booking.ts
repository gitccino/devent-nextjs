"use server";

import { z } from "zod";
import { connectToDatabase } from "@/lib/mongodb";
import { Booking } from "@/lib/models";
import { bookingZodSchema } from "@/lib/validation";

export async function bookEvent(_: unknown, formData: FormData) {
  const raw = {
    eventId: formData.get("eventId"),
    email: formData.get("email"),
  };

  const parsed = bookingZodSchema.safeParse(raw);
  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);
    const message =
      errors.properties?.email?.errors?.[0] ??
      errors.properties?.eventId?.errors?.[0] ??
      "Invalid input.";
    return { success: false, message };
  }

  try {
    await connectToDatabase();
    await Booking.create(parsed.data);
    return { success: true, message: "You're booked!", data: parsed.data };
  } catch (e: unknown) {
    const isDuplicate =
      e instanceof Error &&
      "code" in e &&
      (e as { code: number }).code === 11000;
    return {
      success: false,
      message: isDuplicate
        ? "This email is already booked for this event."
        : "Something went wrong. Please try again.",
    };
  }
}
