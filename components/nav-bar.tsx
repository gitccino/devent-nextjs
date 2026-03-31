import Link from "next/link";
import { Button } from "@/components/ui/button";
// import "@/app/globals.css";

export default function Navbar() {
  const routeOptions = [
    { label: "Events", href: "/events" },
    { label: "Create Events", href: "/" },
  ];

  return (
    <header className="navbar-wrapper">
      <Link href="/" className="font-logo text-xl -tracking-widest">
        Devent
      </Link>

      <ul className="flex space-x-0">
        {routeOptions.map(({ label, href }) => (
          <li key={label}>
            <Button variant="link" asChild>
              <Link href={href}>{label}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </header>
  );
}
