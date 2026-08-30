import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import InvitationEntrance from "./InvitationEntrance";
import ScrollIndicator from "./ScrollIndicator";

interface InvitationHeroProps {
  guestName: string;
  invitationUrl: string;
}

export default function InvitationHero({
  guestName,
  invitationUrl,
}: InvitationHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0.25, 0.78], ["0%", "-10%"]);
  const contentScale = useTransform(scrollYProgress, [0.25, 0.78], [1, 0.93]);
  const contentOpacity = useTransform(scrollYProgress, [0.28, 0.72], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={heroRef} className="invitation-hero">
      <motion.div
        className="invitation-hero__sticky"
        style={{
          y: contentY,
          scale: contentScale,
          opacity: contentOpacity,
        }}
      >
        <InvitationEntrance
          guestName={guestName}
          invitationUrl={invitationUrl}
        />
      </motion.div>

      <ScrollIndicator opacity={indicatorOpacity} />
    </section>
  );
}
