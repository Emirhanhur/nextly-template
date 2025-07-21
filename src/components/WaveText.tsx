import React, { useRef } from "react";
import { useInView } from "framer-motion";

type WaveTextProps = {
  text: string;
  className?: string;
  delayPerChar?: number; // saniye cinsinden gecikme
  delay?: number; // scroll ile görünür olunca toplam gecikme
  y?: number; // opsiyonel, scroll efekti için
  once?: boolean;
};

const WaveText: React.FC<WaveTextProps> = ({
  text,
  className = "",
  delayPerChar = 0.06,
  delay = 0,
  y = 40,
  once = true,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-block", whiteSpace: "pre-line" }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: isInView ? 1 : 0,
            transform: isInView ? "none" : `translateY(${y}px) scale(0.95)` ,
            transition: `opacity 0.5s cubic-bezier(0.4,0,0.2,1) ${delay + i * delayPerChar}s, transform 0.5s cubic-bezier(0.4,0,0.2,1) ${delay + i * delayPerChar}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default WaveText; 