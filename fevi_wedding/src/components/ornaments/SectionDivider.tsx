import styles from "./SectionDivider.module.css";

interface SectionDividerProps {
  /**
   * Optional additional class name so the parent section
   * can control positioning/margins without changing the component.
   */
  className?: string;

  /**
   * Maximum width of the divider.
   * Examples: "520px", "80%", "32rem".
   */
  maxWidth?: string;

  /**
   * Optional accessible label.
   * Decorative dividers normally don't need one.
   */
  label?: string;
}

/**
 * Reusable decorative divider for the wedding invitation.
 *
 * The actual artwork lives in:
 * /public/images/ornaments/section-divider.png
 *
 * Keeping the artwork inside this component means every section
 * can use exactly the same divider consistently.
 */
export default function SectionDivider({
  className = "",
  maxWidth = "520px",
  label,
}: SectionDividerProps) {
  return (
    <div
      className={`${styles.divider} ${className}`}
      style={{ maxWidth }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <img
        src="/images/ornaments/section-divider.png"
        alt=""
        className={styles.image}
      />
    </div>
  );
}
