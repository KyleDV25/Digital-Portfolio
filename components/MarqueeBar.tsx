interface Props {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  accent?: "volt" | "plasma" | "ice" | "blood";
  separator?: string;
  className?: string;
}

const ACCENT_COLORS: Record<string, string> = {
  volt: "text-volt",
  plasma: "text-plasma",
  ice: "text-ice",
  blood: "text-blood",
};

export function MarqueeBar({
  items,
  direction = "left",
  accent = "volt",
  separator = "*",
  className = "",
}: Props) {
  const doubled = [...items, ...items];
  const accentClass = ACCENT_COLORS[accent];

  return (
    <div className={`marquee-wrapper py-3 border-y border-smoke overflow-hidden ${className}`}>
      <div
        className={`marquee-content ${direction === "right" ? "marquee-content-reverse" : ""}`}
        aria-hidden="true"
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-4">
            <span className="font-label text-[0.7rem] tracking-widest uppercase text-ghost whitespace-nowrap">
              {item}
            </span>
            <span className={`${accentClass} text-xs`}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
