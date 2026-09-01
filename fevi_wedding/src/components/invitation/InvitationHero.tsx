import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

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
   * The invitation slowly travels upward as the guest scrolls.
   * This gives the feeling that the cover is being pushed upward
   * and the announcement section is being revealed underneath it.
   */
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.85, 1],
    ["0vh", "-8vh", "-22vh"],
  );

  /*
   * Slightly smooth the scroll movement so the invitation
   * doesn't feel mechanically attached to the finger/wheel.
   */
  const y = useSpring(rawY, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  /*
   * Very subtle scale-down while leaving the hero.
   * This is intentionally restrained so the invitation
   * still feels like a printed wedding card.
   */
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  /*
   * Fade only slightly.
   * We do NOT want the hero disappearing completely.
   * The announcement should feel like it is taking over
   * from underneath.
   */
  const opacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0.94]);

  return (
    <section
      ref={heroRef}
      className="invitation-hero"
      aria-label={`Wedding invitation for ${guestName}`}
    >
      <motion.div
        className="invitation-hero__sticky"
        style={{
          y,
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
