import styles from "./LocationFlower.module.css";

interface LocationFlowerProps {
  side: "left" | "right";
  className?: string;
}

export default function LocationFlower({
  side,
  className = "",
}: LocationFlowerProps) {
  const src =
    side === "left"
      ? "/ornaments/left_flower.png"
      : "/ornaments/right_flower.png";

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`${styles.flower} ${styles[side]} ${className}`.trim()}
      draggable={false}
    />
  );
}
