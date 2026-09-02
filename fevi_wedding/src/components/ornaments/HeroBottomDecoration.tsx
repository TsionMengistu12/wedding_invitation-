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
        src="https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/ornament/gold_band.png?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvb3JuYW1lbnQvZ29sZF9iYW5kLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODgzMjQwOTYsImV4cCI6MTgwMzg3NjA5Nn0.9VK8T90gQU2ZtbuU4oe0BCXVqoQk9bfbTrMEDFMgUIc"
        alt=""
        draggable={false}
      />
      <img
        className={styles.seal}
        src="/ornaments/cross_seal.png"
        alt=""
        draggable={false}
      />
    </div>
  );
}
