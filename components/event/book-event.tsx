"use client";

import { useActionState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { bookEvent } from "@/actions/booking";
import { fireConfetti } from "@/lib/confetti";
import posthog from "posthog-js";

export default function BookEvent({ eventId }: { eventId: string }) {
  const [state, action, pending] = useActionState(bookEvent, null);

  useEffect(() => {
    if (!state?.success) return;
    fireConfetti();
    posthog.capture("event_booked", state.data);
  }, [state]);

  if (state?.success) {
    return <p className="mt-4 text-success">Thank you for signing up!</p>;
  }

  return (
    <div className="mt-4">
      <form action={action} className="flex flex-col gap-2" noValidate>
        <input type="hidden" name="eventId" value={eventId} />
        <Label htmlFor="email" className="text-base text-white px-1">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          className="rounded-none border border-border h-10"
          placeholder="placeholder@devent.co"
        />
        {state?.message && (
          <p className="px-1 text-xs text-destructive">{state.message}</p>
        )}
        <Button size="lg" type="submit" disabled={pending}>
          {pending ? "Booking..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
