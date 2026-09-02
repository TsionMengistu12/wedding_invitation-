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
        src="https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/ornament/section-divider.png?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvb3JuYW1lbnQvc2VjdGlvbi1kaXZpZGVyLnBuZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODgzMjQxNjIsImV4cCI6MTgwMzg3NjE2Mn0.ljWLVPegaHEtw8lAfXzZwz3TR_JoSnv8RmDplMmgbPM"
        alt=""
        className={styles.image}
      />
    </div>
  );
}
