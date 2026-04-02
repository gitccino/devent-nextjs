import { Suspense } from "react";
import Loading from "@/app/loading";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Asterisk,
  type LucideIcon,
} from "lucide-react";
import BookEvent from "@/components/event/book-event";
import { getSimilarEventsBySlug } from "@/actions/event";
import { EventComponent } from "@/components/landing/events-list";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { connectToDatabase } from "@/lib/mongodb";
import { Event, Booking, IEvent } from "@/lib/models";

interface EventDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  return (
    <Suspense fallback={<Loading />}>
      <EventDetails params={params} />
    </Suspense>
  );
}

async function EventDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  await new Promise((resolve) => setTimeout(resolve, 2000)); // ignore this just to showcase loading
  const event = await Event.findOne({ slug }).lean();

  if (!event) return notFound();

  const eventDetailsItems: { icon: LucideIcon; value: string }[] = [
    { icon: CalendarDays, value: event.date },
    { icon: Clock, value: event.time },
    { icon: MapPin, value: event.location },
    { icon: Asterisk, value: event.mode },
    { icon: Users, value: event.audience },
  ];
  const agendaItems = event.agenda;
  const tags = event.tags;
  const bookings = await Booking.countDocuments({ eventId: event._id });

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(event.slug, 1);

  return (
    <main className="container-wrapper max-w-6xl justify-start">
      <div>
        <h1 className="mb-2 tracking-tighter">{event.title}</h1>
        <p className="text-muted-foreground text-lg">{event.description}</p>
      </div>

      <div className="flex flex-row gap-4 w-full mt-4">
        <div className="flex flex-col gap-4">
          <Image
            src={event.image}
            alt={`${event.title}`}
            width={800}
            height={800}
            className="w-full"
            loading="eager"
          />

          <section className="flex flex-col gap-2">
            <h2>Overview</h2>
            <p className="text-muted-foreground">{event.overview}</p>
          </section>

          <section className="flex flex-col gap-2">
            <h2>Event Details</h2>
            {eventDetailsItems.map(({ icon, value }, index) => (
              <EventDetailsItem
                key={`${value}-${index}`}
                icon={icon}
                value={value}
              />
            ))}
          </section>

          <EventAgenda agendaItems={agendaItems} />

          <section className="flex flex-col gap-2">
            <h2>About organizer</h2>
            <p className="text-muted-foreground">{event.organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        <aside className="w-100 h-fit p-5 shrink-0 bg-card sticky top-20">
          <div>
            <h2>Book Your Spot</h2>
            <p className="text-muted-foreground">
              {bookings > 0
                ? `Join ${bookings} people who have already books their spot`
                : "Be the first one to book your spot!"}
            </p>

            <BookEvent eventId={String(event._id)} />
          </div>
        </aside>
      </div>

      <section className="w-full flex flex-col gap-2 mt-40">
        <h2>Similar Events</h2>
        <Carousel>
          <CarouselContent>
            {similarEvents.map((event) => (
              <CarouselItem key={event.slug} className="basis-1/3">
                <EventComponent event={event} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </main>
  );
}

interface EventDetailsItemProps {
  icon: LucideIcon;
  value: string;
}

function EventDetailsItem({ icon: Icon, value }: EventDetailsItemProps) {
  return (
    <div className="flex flex-row gap-2 items-center text-muted-foreground">
      <Icon size={16} />
      <span>{value}</span>
    </div>
  );
}

interface EventAgendaProps {
  agendaItems: string[];
}

function EventAgenda({ agendaItems }: EventAgendaProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2>Agenda</h2>
      <ul className="text-muted-foreground">
        {agendaItems.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}

interface EventTagsProps {
  tags: string[];
}

function EventTags({ tags }: EventTagsProps) {
  return (
    <div className="mt-6 flex flex-row flex-wrap gap-1.5">
      {tags.map((tag) => (
        <div key={tag} className="px-2 py-1 bg-card">
          {tag}
        </div>
      ))}
    </div>
  );
}
