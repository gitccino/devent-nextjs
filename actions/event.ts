import { connectToDatabase } from "@/lib/mongodb";
import { Event, IEvent } from "@/lib/models";
import { cacheTag, cacheLife } from "next/cache";
import { fileToBuffer } from "@/lib/server/utils";
import { eventZodSchema } from "@/lib/validation";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { updateTag } from "next/cache";

export const getEvents = async (totalEvents = 9): Promise<IEvent[]> => {
  "use cache";
  cacheLife("hours");
  cacheTag("events");
  await connectToDatabase();
  const events = await Event.find({})
    .sort({ createdAt: -1 })
    .limit(totalEvents);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return JSON.parse(JSON.stringify(events)) as IEvent[];
};

export const getFeatureEvents = async (totalEvents = 3): Promise<IEvent[]> => {
  "use cache";
  cacheLife("hours");
  cacheTag("feature-events");
  await connectToDatabase();
  const events = await Event.find()
    .sort({ createdAt: -1 })
    .limit(totalEvents)
    .lean();
  return JSON.parse(JSON.stringify(events)) as IEvent[];
};

export const getSimilarEventsBySlug = async (
  slug: string,
  minSharedTags = 1,
  limit = 6,
) => {
  try {
    await connectToDatabase();
    const event = await Event.findOne({ slug }).lean();

    if (!event) return [];

    // return await Event.find({
    //   _id: { $ne: event._id },
    //   tags: { $in: event.tags },
    // });

    // Return events that share at least 2 tags with the current event
    // Uses $expr inside $match so MongoDB can leverage the tags index — filters
    // before computing, unlike $addFields which scans every document first.
    return await Event.aggregate([
      {
        $match: {
          _id: { $ne: event._id },
          $expr: {
            $gte: [
              { $size: { $setIntersection: ["$tags", event.tags] } },
              minSharedTags,
            ],
          },
        },
      },
      // Compute sharedTagCount only on the already-filtered subset for sorting
      {
        $addFields: {
          sharedTagCount: {
            $size: { $setIntersection: ["$tags", event.tags] },
          },
        },
      },
      { $sort: { sharedTagCount: -1 } },
      { $limit: limit },
    ]);

    // ── Slower alternative: $addFields scans ALL docs before $match ──────────
    // return await Event.aggregate([
    //   /**
    //    * Adds a computed field `sharedTagCount` to every event document
    //    * `$setInteraction` finds the common tags between the current and others
    //    */
    //   {
    //     $addFields: {
    //       sharedTagCount: {
    //         $size: { $setIntersection: ["$tags", event.tags] },
    //       },
    //     },
    //   },
    //   {
    //     $match: {
    //       _id: { $ne: event._id },
    //       sharedTagCount: { $gte: minSharedTags },
    //     },
    //   },
    //   { $sort: { sharedTagCount: -1 } },
    //   { $limit: limit },
    // ]);
  } catch {
    return [];
  }
};

export const createEvent = async (formData: FormData) => {
  try {
    await connectToDatabase();

    // 1. Validate form fields first
    const parsed = eventZodSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      const { fieldErrors, formErrors } = z.flattenError(parsed.error);
      return {
        ok: false,
        message: "Validation failed",
        errors: fieldErrors,
        formErrors,
      };
    }

    // 2. Validate image
    const file = formData.get("image");
    if (!(file instanceof File))
      return {
        ok: false,
        message: "Image file is required",
      };

    // 3. Upload to Cloudinary
    const buffer = fileToBuffer(file);
    const uploadResult = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: "devent" },
            (error, result) => {
              if (error || !result)
                return reject(error ?? new Error("No result from Cloudinary"));
              resolve({ secure_url: result.secure_url });
            },
          )
          .end(buffer);
      },
    );

    // 4. Save to DB using parsed.data + image URL
    const createdEvent = await Event.create({
      ...parsed.data,
      image: uploadResult.secure_url,
    });
    updateTag("feature-events");
    return {
      ok: true,
      message: "Event created successfully",
      data: createdEvent,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
