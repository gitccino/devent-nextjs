import { z } from "zod/v4";
import { EVENT_MODES } from "./models/event.model";

export const eventZodSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  overview: z.string().trim().min(1),
  venue: z.string().trim().min(1),
  location: z.string().trim().min(1),
  date: z.string().trim().min(1),
  time: z.string().trim().min(1),
  mode: z.enum(EVENT_MODES),
  audience: z.string().trim().min(1),
  agenda: z
    .string()
    .trim()
    .transform((v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  organizer: z.string().trim().min(1),
  tags: z
    .string()
    .trim()
    .transform((v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
});

export type EventInput = z.infer<typeof eventZodSchema>;

export const bookingZodSchema = z.object({
  eventId: z.string().min(1),
  email: z.email(),
});

export type BookingInput = z.infer<typeof bookingZodSchema>;
