interface OrnamentProps {
  className?: string;
}

export default function Ornament({ className = "" }: OrnamentProps) {
  return (
    <div className={`ornament ${className}`}>
      <span />
      <span className="ornament-symbol">❦</span>
      <span />
    </div>
  );
}
