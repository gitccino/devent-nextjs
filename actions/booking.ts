"use server";

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
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    await connectToDatabase();
    await Booking.create(parsed.data);
    return { success: true, message: "You're booked!" };
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
