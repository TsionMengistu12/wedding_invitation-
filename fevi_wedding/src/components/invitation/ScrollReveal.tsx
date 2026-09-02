import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
}

/** Reveals each invitation section once it approaches the viewport. */
export default function ScrollReveal({ children }: ScrollRevealProps) {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = revealRef.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      element.classList.add("scroll-reveal--visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("scroll-reveal--visible");
          return;
        }

        // Once a section has fully passed above the viewport, reset it. It
        // will rise in again when a guest scrolls back up through the page.
        if (entry.boundingClientRect.bottom <= 0) {
          element.classList.remove("scroll-reveal--visible");
        }
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={revealRef} className="scroll-reveal">
      {children}
    </div>
  );
}
