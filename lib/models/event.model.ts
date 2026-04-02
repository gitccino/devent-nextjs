import mongoose, { Schema, model, models, type Document } from "mongoose";
import slugify from "slugify";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export const EVENT_MODES = [
  "online",
  "offline",
  "hybrid",
] as const satisfies EventMode[];
export type EventMode = "online" | "offline" | "hybrid";

/** Plain object shape — use this for API responses and component props */
export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Mongoose document — use this when working with raw model instances */
export interface IEventDocument extends IEvent, Document {}

// ------------------------------------------------------------------
// Schema
// ------------------------------------------------------------------

const EventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    // Auto-generated from title before save (see pre-save hook below)
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },

    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },

    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    date: {
      type: String,
      required: [true, "Date is required"],
    },

    time: {
      type: String,
      required: [true, "Time is required"],
    },

    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"] satisfies EventMode[],
        message: "{VALUE} is not a valid mode",
      },
    },

    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },

    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      default: [],
    },

    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },

    tags: {
      type: [String],
      required: [true, "Tags are required"],
      default: [],
    },
  },
  {
    // Automatically manages createdAt and updatedAt fields
    timestamps: true,
  },
);

// ------------------------------------------------------------------
// Hooks
// ------------------------------------------------------------------

/**
 * Generate a unique slug from the title before saving.
 * If the base slug already exists, append a numeric suffix and
 * keep incrementing until a free slot is found (e.g. "react-conf-2").
 * Excludes the current document via `_id` so updates don't collide
 * with themselves.
 */
EventSchema.pre("save", async function (this: IEventDocument) {
  if (!this.isModified("title") && this.slug) return;

  const baseSlug = slugify(this.title, { lower: true, strict: true });
  let candidate = baseSlug;
  let suffix = 2;

  // _id: { $ne: this._id } - Find docs where _id is not equal to the current doc's _id
  while (await EventModel.exists({ slug: candidate, _id: { $ne: this._id } })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix++;
  }

  this.slug = candidate;
});

// ------------------------------------------------------------------
// Indexes
// ------------------------------------------------------------------

// Filter by location (e.g. "events in Berlin")
EventSchema.index({ location: 1 });

// Filter by mode (online/offline/hybrid)
EventSchema.index({ mode: 1 });

// Tag-based filtering ("show me all AI events")
EventSchema.index({ tags: 1 });

// Events on a specific date by mode (e.g. all online events in June)
EventSchema.index({ date: 1, mode: 1 });

// ------------------------------------------------------------------
// Model
// ------------------------------------------------------------------

/**
 * Guard against model re-registration during Next.js hot-reloads.
 * `models.Event` returns the cached model if it already exists.
 */
const EventModel =
  (models.Event as mongoose.Model<IEventDocument> | undefined) ??
  model<IEventDocument>("Event", EventSchema);

export default EventModel;
