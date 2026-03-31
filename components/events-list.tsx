import Image from "next/image";
import { fetchConferences } from "@/lib/conferences";
import type { Event } from "@/lib/conferences";
import { CalendarDays, MapPin } from "lucide-react";

export default async function EventsList() {
  const events = await fetchConferences();

  return (
    <ul className="grid grid-cols-3 gap-x-4 gap-y-8 max-sm:grid-cols-2">
      {events.map((event) => (
        <EventComponent key={event.slug} event={event} />
      ))}
    </ul>
  );
}

interface EventComponentProps {
  event: Event;
}

function EventComponent({ event }: EventComponentProps) {
  return (
    <li className="">
      <Image
        src={event.image}
        alt={`${event.title} Thumbnail`}
        width={750}
        height={500}
        className="w-full"
        loading="eager"
      />

      <div className="px-4 py-2">
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
    </li>
  );
}
