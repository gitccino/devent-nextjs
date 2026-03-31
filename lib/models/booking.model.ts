import { Schema, model, models, type Document, type Types } from "mongoose";
import EventModel from "./event.model";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

/** Plain object shape — use for API responses and component props */
export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Mongoose document — use when working with raw model instances */
export interface IBookingDocument extends IBooking, Document {}

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------

const BookingSchema = new Schema<IBookingDocument>(
  {
    // Indexed for fast lookups when querying all bookings for an event
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      // Mongoose built-in validator for email format
      validate: {
        validator: (value: string) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "{VALUE} is not a valid email address",
      },
    },
  },
  {
    timestamps: true,
  },
);

// ------------------------------------------------------------------
// Hooks
// ------------------------------------------------------------------

/**
 * Before saving a booking, confirm the referenced event actually exists.
 * This guards against orphaned bookings caused by deleted events or
 * invalid IDs slipping through the API layer.
 */
BookingSchema.pre("save", async function (this: IBookingDocument) {
  const eventExists = await EventModel.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error(`Event with ID "${this.eventId}" does not exist`);
  }
});

// ------------------------------------------------------------------
// Indexes
// ------------------------------------------------------------------

// Covers "all bookings for an event, newest first" — the most common query pattern
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Covers "all bookings by this email" for user-facing booking history
BookingSchema.index({ email: 1 });

// ------------------------------------------------------------------
// Model
// ------------------------------------------------------------------

/**
 * Guard against model re-registration during Next.js hot-reloads.
 * `models.Booking` returns the cached model if it already exists.
 */
import type mongoose from "mongoose";

const BookingModel =
  (models.Booking as mongoose.Model<IBookingDocument> | undefined) ??
  model<IBookingDocument>("Booking", BookingSchema);

export default BookingModel;
