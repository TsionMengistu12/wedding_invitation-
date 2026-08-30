import styles from "./AnnouncementHeader.module.css";

interface AnnouncementHeaderProps {
  /**
   * Maximum width of the artwork.
   *
   * Examples:
   *   maxWidth="1200px"
   *   maxWidth="90vw"
   *   maxWidth="75rem"
   */
  maxWidth?: string;

  /**
   * Optional class name for positioning/spacing
   * from the parent announcement section.
   */
  className?: string;

  /**
   * Width used on phones.
   * Defaults to 100%, so the ornament always fits
   * inside the viewport.
   */
  mobileWidth?: string;

  /**
   * Optional accessible label.
   *
   * Leave undefined when the header is purely decorative.
   */
  label?: string;
}

/**
 * Reusable announcement-section header ornament.
 *
 * This uses the supplied artwork containing the matching
 * left and right corner decorations.
 */
export default function AnnouncementHeader({
  maxWidth = "1200px",
  className = "",
  mobileWidth = "100%",
  label,
}: AnnouncementHeaderProps) {
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
        src="/images/ornaments/announcement-header.png"
        alt=""
        className={styles.image}
      />
    </div>
  );
}
