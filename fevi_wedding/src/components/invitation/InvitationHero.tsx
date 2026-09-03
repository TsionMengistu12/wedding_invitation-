import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import InvitationEntrance from "./InvitationEntrance";

interface InvitationHeroProps {
  guestName: string;
  invitationUrl: string;
}

export default function InvitationHero({
  guestName,
  invitationUrl,
}: InvitationHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  /*
   * Track how far the hero itself has been scrolled.
   *
   * start start:
   *   The top of the hero reaches the top of the viewport.
   *
   * end start:
   *   The bottom of the hero reaches the top of the viewport.
   */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /*
   * Mobile-first movement.
   *
   * The invitation drifts upward only gently while the guest scrolls,
   * then the announcement section emerges beneath it without a harsh
   * shrink-away effect.
   */
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7, 1],
    ["0vh", "-2vh", "-9vh", "-12vh"],
  );

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.995, 0.988]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.8, 1],
    [1, 1, 0.99, 0.97],
  );

  return (
    <section
      ref={heroRef}
      className="invitation-hero"
      aria-label={`Wedding invitation for ${guestName}`}
    >
      <motion.div
        className="invitation-hero__sticky"
        style={{
          y: rawY,
          scale,
          opacity,
        }}
      >
        <InvitationEntrance
          guestName={guestName}
          invitationUrl={invitationUrl}
        />
      </motion.div>
    </section>
  );
}
