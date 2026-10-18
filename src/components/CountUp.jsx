import { useEffect, useRef, useState } from "react";

const NUM = /-?[\d,]*\.?\d+/;

/** Animates the first number found in `value` from its previous value to the new one. */
export default function CountUp({ value, duration = 900 }) {
  const str = String(value);
  const m = str.match(NUM);
  const target = m ? parseFloat(m[0].replaceAll(",", "")) : null;
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (target === null) return undefined;
    if (reduced) return undefined;
    const start = performance.now();
    const a = from.current;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const v = a + (target - a) * (1 - Math.pow(1 - t, 3));
      from.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  if (!m) return str;
  const decimals = (m[0].split(".")[1] || "").length;
  const num = (reduced ? target : shown).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: m[0].includes(","),
  });
  return (
    <span className="tabular-nums">
      {str.slice(0, m.index)}
      {num}
      {str.slice(m.index + m[0].length)}
    </span>
  );
}
