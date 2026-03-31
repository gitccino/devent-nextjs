import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ComponentName() {
  return (
    <section className="container-wrapper">
      <h1 className="font-logo mb-2">ERROR 404</h1>
      <h2 className="text-base text-muted-foreground">
        Could not find requested resource
      </h2>

      <Button size="lg" className="mt-6" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </section>
  );
}
