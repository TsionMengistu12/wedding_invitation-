interface CornerOrnamentProps {
  src: string;

  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";

  className?: string;
}

export default function CornerOrnament({
  src,
  position,
  className = "",
}: CornerOrnamentProps) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`corner-ornament corner-ornament--${position} ${className}`}
    />
  );
}
