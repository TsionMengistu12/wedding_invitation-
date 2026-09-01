import styles from "./FloralSeal.module.css";

interface FloralSealProps {
  /**
   * Controls the maximum rendered size.
   *
   * Examples:
   *   maxWidth="420px"
   *   maxWidth="30rem"
   *   maxWidth="45vw"
   */
  maxWidth?: string;

  /**
   * Optional additional class name.
   * The parent section can use this for positioning.
   */
  className?: string;

  /**
   * Optional width on very small screens.
   * Defaults to 82vw.
   */
  mobileWidth?: string;

  /**
   * Optional accessible label.
   *
   * Leave undefined if the ornament is purely decorative.
   */
  label?: string;
}

/**
 * Reusable floral wax-seal ornament.
 *
 * The artwork is kept in:
 * /public/images/ornaments/floral-seal.png
 *
 * The component preserves the original aspect ratio and scales
 * down automatically on smaller screens.
 */
export default function FloralSeal({
  maxWidth = "420px",
  className = "",
  mobileWidth = "82vw",
  label,
}: FloralSealProps) {
  return (
    <div
      className={`${styles.wrapper} ${className}`}
      style={
        {
          "--max-width": maxWidth,
          "--mobile-width": mobileWidth,
        } as React.CSSProperties
      }
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <img
        src="/ornaments/floral-seal.png"
        alt=""
        className={styles.image}
      />
    </div>
  );
}
