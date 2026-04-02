"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number; // ms per character, default 100
  variance?: number; // 0–1 randomness, default 0.4
  repeat?: number; // last N chars to delete and retype after full text is typed
  speedOnRepeat?: number; // ms per character during delete/retype loop, default 200
}

export default function Typewriter({
  text,
  className,
  speed = 100,
  variance = 0.4,
  repeat = 0,
  speedOnRepeat = 200,
}: TypewriterProps) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(() => {
    setCount(0);
    const len = text.length;
    const repeatStart = repeat > 0 ? Math.max(0, len - repeat) : len;
    let i = 0;
    let phase: "type" | "delete" | "retype" = "type";

    function tick() {
      if (rafRef.current) clearTimeout(rafRef.current);
      const jitter = 1 + (Math.random() * 2 - 1) * variance;

      if (phase === "type") {
        const delay = speed * jitter;
        if (i < len) {
          i++;
          setCount(i);
          rafRef.current = setTimeout(tick, delay);
        } else if (repeat > 0) {
          phase = "delete";
          rafRef.current = setTimeout(tick, speedOnRepeat * 4);
        }
      } else if (phase === "delete") {
        const delay = speedOnRepeat * jitter * 0.6; // delete faster
        if (i > repeatStart) {
          i--;
          setCount(i);
          rafRef.current = setTimeout(tick, delay);
        } else {
          phase = "retype";
          rafRef.current = setTimeout(tick, speedOnRepeat * 2);
        }
      } else if (phase === "retype") {
        const delay = speedOnRepeat * jitter;
        if (i < len) {
          i++;
          setCount(i);
          rafRef.current = setTimeout(tick, delay);
        } else {
          // loop forever
          phase = "delete";
          rafRef.current = setTimeout(tick, speedOnRepeat * 4);
        }
      }
    }

    rafRef.current = setTimeout(tick, speed);
    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [text, speed, variance, repeat, speedOnRepeat]);

  const done = repeat === 0 && count >= text.length;

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {!done && (
        <motion.span
          aria-hidden="true"
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.45,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "linear",
          }}
        >
          {count !== 0 && "|"}
        </motion.span>
      )}
    </span>
  );
}
