import type { CSSProperties } from "react";
import styles from "./CoupleArchFrame.module.css";

interface CoupleArchFrameProps {
  /**
   * The couple's photograph.
   */
  imageSrc: string;

  /**
   * Transparent arch frame.
   */
  frameSrc?: string;

  /**
   * Width of the entire frame.
   */
  width?: string;

  /**
   * Maximum width on large screens.
   */
  maxWidth?: string;

  /**
   * Width of the image inside the frame.
   *
   * This allows us to compensate for the
   * transparent padding in the PNG.
   */
  imageInset?: string;

  /**
   * Optional className.
   */
  className?: string;

  /**
   * Alternative text for accessibility.
   */
  alt?: string;
}

export default function CoupleArchFrame({
  imageSrc,
  frameSrc = "/ornaments/arch_frame.png",

  width = "min(34vw, 480px)",
  maxWidth = "480px",

  imageInset = "3.8%",

  className = "",
  alt = "The couple",
}: CoupleArchFrameProps) {
  const cssVariables = {
    "--arch-width": width,
    "--arch-max-width": maxWidth,
    "--arch-image-inset": imageInset,
  } as CSSProperties;

  return (
    <div className={`${styles.container} ${className}`} style={cssVariables}>
      {/* ============================================
          COUPLE PHOTOGRAPH
          ============================================ */}

      <div className={styles.photoWrapper}>
        <img
          src={imageSrc}
          alt={alt}
          className={styles.photo}
          draggable={false}
        />
      </div>

      {/* ============================================
          TRANSPARENT ARCH FRAME

          This sits ABOVE the photograph.
          The transparent center allows the
          photograph underneath to show through.
          ============================================ */}

      <img
        src={frameSrc}
        alt=""
        className={styles.frame}
        draggable={false}
        aria-hidden="true"
      />
    </div>
  );
}
