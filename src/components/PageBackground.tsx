import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseAlpha: number;
  speedFactor: number;
}

const GREEN_COLORS = [
  "#10b981",
  "#35a97c",
  "#059669",
  "#178f63",
  "#66c99f",
];

const GREY_COLORS = [
  "#94a3b8",
  "#cbd5e1",
  "#64748b",
  "#475569",
  "#334155",
];

// Full-page ambient background: interactive particles following cursor
// overlayed on top of subtle drifting wave lines.
export default function PageBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      active: false,
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Generate 50 particles (mix of green and grey, with varied sizes up to 10px)
    const particleCount = 50;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isGreen = Math.random() > 0.45;
      const palette = isGreen ? GREEN_COLORS : GREY_COLORS;
      const color = palette[Math.floor(Math.random() * palette.length)];
      // Wide range of speed factors (0.3 to 2.8) so each dot moves at its own unique speed
      const speedFactor = 0.3 + Math.random() * 2.5;

      // ~20% of particles get larger radii (7px to 11px), the rest range from 2px to 6.5px
      const isLarge = Math.random() < 0.2;
      const radius = isLarge ? 7.0 + Math.random() * 4.0 : 2.0 + Math.random() * 4.5;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5 * speedFactor,
        vy: (Math.random() - 0.5) * 1.5 * speedFactor,
        radius,
        color,
        baseAlpha: isLarge ? 0.35 + Math.random() * 0.3 : 0.2 + Math.random() * 0.45,
        speedFactor,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Repulsion / scatter away from cursor when mouse is nearby
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const scatterRadius = 180;

          if (distSq < scatterRadius * scatterRadius && distSq > 0) {
            const dist = Math.sqrt(distSq);
            // Outward force pushing particles away, scaled by each dot's speed factor
            const force = ((scatterRadius - dist) / scatterRadius) * 1.2 * p.speedFactor;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Mild velocity dampening so particles glide and scatter fluidly
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Ensure ongoing ambient drift scaled by individual speed factor
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed < 0.3 * p.speedFactor) {
          p.vx += (Math.random() - 0.5) * 0.2 * p.speedFactor;
          p.vy += (Math.random() - 0.5) * 0.2 * p.speedFactor;
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Render dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.baseAlpha;
        ctx.fill();

        // Soft outer halo for larger particles
        if (p.radius > 4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.baseAlpha * 0.25;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
      <svg
        aria-hidden
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: -2,
          opacity: 0.25,
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
    </>
  );
}
