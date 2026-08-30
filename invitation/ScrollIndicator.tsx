import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";

interface ScrollIndicatorProps {
  opacity?: MotionValue<number>;
}

export default function ScrollIndicator({ opacity }: ScrollIndicatorProps) {
  return (
    <motion.div
      className="scroll-indicator"
      style={opacity ? { opacity } : undefined}
      initial={opacity ? undefined : { opacity: 0 }}
      animate={opacity ? undefined : { opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
    >
      <motion.div
        className="scroll-indicator__arrow"
        animate={{ y: [0, 7, 0] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        ↓
      </motion.div>

      <span className="scroll-indicator__text">SCROLL</span>

      <motion.div
        className="scroll-indicator__line"
        animate={{ scaleY: [0.65, 1, 0.65] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
