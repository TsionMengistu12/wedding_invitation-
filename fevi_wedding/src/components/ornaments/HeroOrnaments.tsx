import type { CSSProperties } from "react";
import styles from "./HeroOrnaments.module.css";

interface HeroOrnamentsProps {
  /**
   * Complete bottom decoration.
   *
   * This is ONE image containing:
   * - left flowers
   * - right flowers
   * - central lace decoration
   * - ribbons
   */
  src?: string;

  /**
   * Desktop width.
   *
   * Examples:
   * "1000px"
   * "80vw"
   * "90%"
   */
  width?: string;

  /**
   * Maximum width so the ornament
   * doesn't become enormous on large screens.
   */
  maxWidth?: string;

  /**
   * Distance from the bottom of the hero.
   */
  bottom?: string;

  /**
   * Scale used on smaller screens.
   *
   * 0.7 means 70% of the desktop size.
   */
  mobileScale?: number;

  /**
   * Additional CSS class if you want
   * to customize a particular instance.
   */
  className?: string;
}

export default function HeroOrnaments({
  src = "/ornaments/hero_decorator.png",
  width = "78vw",
  maxWidth = "1050px",
  bottom = "-5px",
  mobileScale = 0.72,
  className = "",
}: HeroOrnamentsProps) {
  const cssVariables = {
    "--hero-ornament-width": width,
    "--hero-ornament-max-width": maxWidth,
    "--hero-ornament-bottom": bottom,
    "--hero-ornament-mobile-scale": mobileScale,
  } as CSSProperties;

  return (
    <div
      className={`${styles.container} ${className}`}
      style={cssVariables}
      aria-hidden="true"
    >
      <img src={src} alt="" className={styles.image} draggable={false} />
    </div>
  );
}
