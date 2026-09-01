import type { CSSProperties } from "react";
import styles from "./HeroBottomDecoration.module.css";

interface HeroBottomDecorationProps {
  /** Additional class name for section-specific positioning. */
  className?: string;

  /** Width of the floral seal at its largest size. */
  sealWidth?: string;
}

/**
 * Full-width gold band with the floral wax-seal ornament centered over it.
 * This intentionally owns the visual transition at the end of the hero.
 */
export default function HeroBottomDecoration({
  className = "",
  sealWidth = "min(27vw, 290px)",
}: HeroBottomDecorationProps) {
  return (
    <div
      className={`${styles.decoration} ${className}`}
      style={{ "--hero-seal-width": sealWidth } as CSSProperties}
      aria-hidden="true"
    >
      <img
        className={styles.band}
        src="/ornaments/gold_band.png"
        alt=""
        draggable={false}
      />
      {/* <img
        className={styles.seal}
        src="/ornaments/cross_seal.png"
        alt=""
        draggable={false}
      /> */}
    </div>
  );
}
