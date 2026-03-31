import { Suspense } from "react";
import ExploreButton from "@/components/landing/explore-btn";
import EventsList from "@/components/events-list";
import "@/app/globals.css";

export default function Home() {
  return (
    <>
      <section className="container-wrapper">
        <h1 className="text-white font-logo -tracking-widest mb-2">Devent</h1>
        <h2>The Hub for every Devs</h2>
        <p className="text-muted-foreground text-center mt-4">
          Events You mustn&apos;t miss <br /> Hackathons, Meetup and
          Conferences. All in One Place
        </p>

        <ExploreButton className="mt-6" />
      </section>

      <section className="container-wrapper">
        <Suspense fallback={<p>Loading events...</p>}>
          <EventsList />
        </Suspense>
      </section>
    </>
  );
}
