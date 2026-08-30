import { MotionValue, motion, useTransform } from "framer-motion";

import InvitationCard from "./InvitationCard";

interface EnvelopeProps {
  scrollProgress: MotionValue<number>;
  guestName: string;
  invitationUrl: string;
}

export default function Envelope({
  scrollProgress,
  guestName,
  invitationUrl,
}: EnvelopeProps) {
  const flapRotate = useTransform(scrollProgress, [0, 0.65], [0, -170]);
  const cardY = useTransform(scrollProgress, [0, 0.72], ["0%", "-42%"]);
  const cardScale = useTransform(scrollProgress, [0, 0.72], [1, 0.97]);
  const envelopeOpacity = useTransform(scrollProgress, [0.72, 1], [1, 0]);

  return (
    <motion.div
      className="envelope"
      style={{
        opacity: envelopeOpacity,
      }}
    >
      <motion.div
        className="envelope__card"
        style={{
          y: cardY,
          scale: cardScale,
        }}
      >
        <InvitationCard
          guestName={guestName}
          invitationUrl={invitationUrl}
        />
      </motion.div>

      <div className="envelope__body">
        <div className="envelope__left" />
        <div className="envelope__right" />
        <div className="envelope__bottom" />
      </div>

      <motion.div
        className="envelope__flap"
        style={{
          rotateX: flapRotate,
        }}
      />
    </motion.div>
  );
}
