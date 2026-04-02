import { Suspense } from "react";
import { EventsList } from "@/components/landing/events-list";
import Loading from "../loading";

export default function EventsPage() {
  return (
    <main className="container-wrapper justify-start">
      <div className="flex flex-col items-center mb-10">
        <h1 className="tracking-tighter text-3xl">All Events</h1>
        <p className="text-muted-foreground">
          Discover events, find your next experience, and secure your spot.
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <EventsList />
      </Suspense>
    </main>
  );
}
