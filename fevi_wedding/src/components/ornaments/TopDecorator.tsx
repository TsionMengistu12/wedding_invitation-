import styles from "./TopDecorator.module.css";

interface TopDecoratorProps {
  /** Optional additional class name for page-specific positioning. */
  className?: string;

  /** Controls the maximum width on larger screens. */
  maxWidth?: string;

  /** Optional alt text. Keep empty when the ornament is purely decorative. */
  alt?: string;
}

/**
 * Reusable top wedding-invitation ornament.
 *
 * The ornament is responsive because the image keeps its natural aspect
 * ratio while its width is controlled with CSS clamp(). It can therefore
 * be used on desktop, tablet, and mobile without stretching the artwork.
 */
export default function TopDecorator({
  className = "",
  maxWidth = "640px",
  alt = "",
}: TopDecoratorProps) {
  return (
    <div
      className={`${styles.wrapper} ${className}`.trim()}
      style={{ "--ornament-max-width": maxWidth } as React.CSSProperties}
    >
      <img
        src="/ornaments/top-decorator.png"
        alt={alt}
        aria-hidden={alt ? undefined : true}
        className={styles.image}
      />
    </div>
  );
}
