import { Suspense } from "react";
import ExploreButton from "@/components/landing/explore-btn";
import { FeatureEventsList } from "@/components/landing/events-list";
import { Asterisk } from "lucide-react";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function Home() {
  // const response = await fetch(`${BASE_URL}/api/events`);
  // const { events } = await response.json();
  // if (!events) return notFound();

  // "use cache";
  // cacheLife("hours");
  return (
    <>
      <section className="container-wrapper min-h-20">
        <h1 className="text-white font-logo -tracking-widest mb-2">Devent</h1>
        <h2>The Hub for every Devs</h2>
        <p className="text-muted-foreground text-center mt-4">
          Events You mustn&apos;t miss <br /> Hackathons, Meetup and
          Conferences. All in One Place
        </p>

        <ExploreButton className="mt-6" />
      </section>

      <section
        id="feature-events"
        className="container-wrapper flex flex-col items-start justify-start py-16"
      >
        <div className="flex flex-row gap-0.5 items-center mb-4">
          <Asterisk color="var(--warning)" size={24} />
          <h3 className="text-2xl font-semibold text-white">Feature Events</h3>
        </div>
        <Suspense fallback={<p>Loading events...</p>}>
          <FeatureEventsList />
        </Suspense>
      </section>
    </>
  );
}
