"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import posthog from "posthog-js";
// import "@/app/globals.css";

export default function Navbar() {
  const routeOptions = [
    { label: "Events", href: "/event" },
    { label: "Create Events", href: "/" },
  ];

  return (
    <header className="z-50 navbar-container">
      <div className="navbar-wrapper px-4">
        <Link href="/" className="font-logo text-xl -tracking-widest">
          Devent
        </Link>

        <ul className="flex space-x-0">
          {routeOptions.map(({ label, href }) => (
            <li key={label}>
              <Button variant="link" asChild>
                <Link
                  href={href}
                  onClick={() =>
                    posthog.capture("nav_link_clicked", { label, href })
                  }
                >
                  {label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
