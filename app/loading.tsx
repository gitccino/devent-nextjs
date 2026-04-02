"use client";

import { Suspense, useState } from "react";
import Typewriter from "@/components/motion/typewriter";
import { TYPEWRITER_WORDS } from "@/lib/constants";

function RandomTypewriter() {
  const [text] = useState(
    () =>
      `${TYPEWRITER_WORDS[Math.floor(Math.random() * TYPEWRITER_WORDS.length)]}...`,
  );
  return (
    <Typewriter
      text={text ?? "Loading..."}
      speed={100}
      speedOnRepeat={400}
      repeat={4}
      className="text-muted-foreground"
    />
  );
}

export default function Loading() {
  return (
    <div className="container-wrapper">
      <Suspense>
        <RandomTypewriter />
      </Suspense>
    </div>
  );
}
