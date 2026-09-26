import { useRef, type CSSProperties, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Extra delay in seconds */
  delay?: number;
  /** Rise distance in px */
  y?: number;
  /** Seconds between each [data-motion] child */
  stagger?: number;
};

/**
 * Scroll entrance. The wrapper rises as one piece, unless it contains
 * [data-motion] children — those rise in sequence.
 * data-motion="scale" also eases in from a slightly smaller size.
 */
export function Reveal({
  children,
  className = "",
  style,
  delay = 0,
  y = 36,
  stagger = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  registerGsap();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      const items = [...el.querySelectorAll<HTMLElement>("[data-motion]")];
      const targets = items.length > 0 ? items : [el];

      for (const node of targets) {
        const scale = node.dataset.motion === "scale";
        gsap.set(node, {
          opacity: 0,
          y: scale ? 20 : y,
          scale: scale ? 0.96 : 1,
          transformOrigin: "50% 50%",
        });
      }

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.05,
        delay,
        stagger: items.length > 1 ? stagger : 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 84%",
          once: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
