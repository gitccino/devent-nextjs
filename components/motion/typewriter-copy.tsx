"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number; // ms per character, default 40
  variance?: number; // 0–1 randomness, default 0.4
}

export default function Typewriter({
  text,
  className,
  speed = 40,
  variance = 0.4,
}: TypewriterProps) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    setCount(0);

    let i = 0;

    function tick() {
      if (i >= text.length) return;
      i++;
      setCount(i);
      const jitter = 1 + (Math.random() * 2 - 1) * variance;
      rafRef.current = setTimeout(tick, speed * jitter);
    }

    rafRef.current = setTimeout(tick, speed);
    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [text, speed, variance]);

  const done = count >= text.length;

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
          |
        </motion.span>
      )}
    </span>
  );
}
