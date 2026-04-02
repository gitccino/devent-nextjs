import { connectToDatabase } from "@/lib/mongodb";
import { Event, IEvent } from "@/lib/models";
import { cacheTag, cacheLife } from "next/cache";
import { fileToBuffer } from "@/lib/utils";
import { eventZodSchema } from "@/lib/validation";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

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
    ]);
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
      const something = parsed.error.flatten();
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
