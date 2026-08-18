// Full-page ambient background: the same slow-drifting wave lines used in
// the header, extended behind the whole page (not just the header band).
// Fixed and behind all content, so it stays put while the page scrolls.
export default function PageBackground() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        opacity: 0.35,
        pointerEvents: "none",
        maskImage: "radial-gradient(80% 70% at 100% 0%, black, transparent 75%)",
        WebkitMaskImage: "radial-gradient(80% 70% at 100% 0%, black, transparent 75%)",
      }}
    >
      <g className="wave-line wave-line-1">
        <path
          d="M -200 340 C 100 300, 300 400, 600 340 S 1100 290, 1400 340 S 1800 400, 2000 340"
          fill="none"
          stroke="var(--brand-200)"
          strokeWidth="2"
        />
      </g>
      <g className="wave-line wave-line-2">
        <path
          d="M -200 220 C 150 260, 350 170, 650 220 S 1150 280, 1450 220 S 1850 170, 2050 220"
          fill="none"
          stroke="var(--brand-300)"
          strokeWidth="2"
          strokeDasharray="2 12"
        />
      </g>
      <g className="wave-line wave-line-3">
        <path
          d="M -200 120 C 120 170, 380 70, 680 120 S 1180 180, 1480 120 S 1880 70, 2080 120"
          fill="none"
          stroke="var(--brand-500)"
          strokeWidth="1.5"
          opacity="0.5"
        />
      </g>
      <g className="wave-line wave-line-4">
        <path
          d="M -200 60 C 100 20, 340 100, 640 60 S 1140 15, 1440 60 S 1840 100, 2040 60"
          fill="none"
          stroke="var(--brand-100)"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
