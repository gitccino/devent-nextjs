"use client";

import { useState } from "react";
import Typewriter from "@/components/motion/typewriter";
import { TYPEWRITER_WORDS } from "@/lib/constants";

export default function DevPage() {
  const [verb] = useState(
    () => TYPEWRITER_WORDS[Math.floor(Math.random() * TYPEWRITER_WORDS.length)],
  );
  return (
    <div className="container-wrapper">
      <Typewriter
        text={`${verb}...`}
        speed={100}
        speedOnRepeat={400}
        repeat={4}
        className="text-muted-foreground"
      />
    </div>
  );
}
