"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import posthog from "posthog-js";

export default function ExploreButton({
  className,
}: React.ComponentProps<"button">) {
  return (
    <Button id="explore-btn" size="lg" className={cn("", className)} asChild>
      <Link href="/events" onClick={() => posthog.capture("explore_button_clicked")}>
        Explore
        <motion.div
          animate={{ y: [1, 3, 1] }}
          transition={{
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <ChevronDown />
        </motion.div>
      </Link>
    </Button>
  );
}
