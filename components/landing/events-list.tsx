import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { IEvent, Event } from "@/lib/models";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { connection } from "next/server";
import { getFeatureEvents } from "@/actions/event";

export default async function EventsList() {
  await connection(); // This component is dynamic
  // await connectToDatabase();
  // const events = (await Event.find()
  //   .sort({ createdAt: -1 })
  //   .lean()) as IEvent[];

  const events = await getFeatureEvents();
  return (
    <ul className="grid grid-cols-3 gap-x-4 gap-y-8 max-sm:grid-cols-2">
      {events.map((event) => (
        <li key={event.slug}>
          <EventComponent event={event} />
        </li>
      ))}
    </ul>
  );
}

interface EventComponentProps {
  event: IEvent;
}

export function EventComponent({
  event,
  className,
}: EventComponentProps & React.ComponentProps<"div">) {
  return (
    <div className={cn("", className)}>
      <Link href={`/event/${event.slug}`}>
        <Image
          src={event.image}
          alt={`${event.title} Thumbnail`}
          width={750}
          height={500}
          className="w-full aspect-video object-cover"
          loading="eager"
        />

        <div className="px-2 py-2">
          <h3 className="text-base font-bold">{event.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <CalendarDays size={12} />
              <span className="text-xs">{event.date}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin size={12} />
              <span className="text-xs">{event.location}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
