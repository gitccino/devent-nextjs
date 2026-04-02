import { z } from "zod/v4";
import { EVENT_MODES } from "./models/event.model";

// export const eventZodSchema = z.object({
//   title: z.string().min(1),
//   description: z.string().min(1),
//   venue: z.string().min(1),
//   location: z.string().min(1),
//   date: z.string().min(1),
//   time: z.string().min(1),
//   image: z.string().min(1),
// });

export const eventZodSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim(),
  overview: z.string().trim(),
  venue: z.string().trim(),
  location: z.string().trim(),
  date: z.string().trim(),
  time: z.string().trim(),
  mode: z.enum(EVENT_MODES),
  audience: z.string().trim(),
  agenda: z
    .string()
    .trim()
    .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
  organizer: z.string().trim(),
  tags: z
    .string()
    .trim()
    .transform((v) => v.split(",").map((s) => s.trim()).filter(Boolean)),
});

export type EventInput = z.infer<typeof eventZodSchema>;

export const bookingZodSchema = z.object({
  eventId: z.string().min(1),
  email: z.email(),
});

export type BookingInput = z.infer<typeof bookingZodSchema>;
