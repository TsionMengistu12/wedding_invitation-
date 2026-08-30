"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import "../../styles/gallarySection.css";

// ============================================================
// TYPES
// ============================================================

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  rotation: number;
}

// ============================================================
// YOUR WEDDING PHOTOS
//
// Replace these paths with your actual photographs.
//
// Keeping the data separate from the JSX makes this component
// reusable and very easy to update.
// ============================================================

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/assets/couples/p1.jpg",
    alt: "Feven and Abenezer",
    rotation: -2,
  },
  {
    id: 2,
    src: "/assets/couples/p1.jpg",
    alt: "Feven and Abenezer",
    rotation: 1.5,
  },
  {
    id: 3,
    src: "/assets/couples/p1.jpg",
    alt: "Feven and Abenezer",
    rotation: -1,
  },
  {
    id: 4,
    src: "/assets/couples/p1.jpg",
    alt: "Feven and Abenezer",
    rotation: 2,
  },
  {
    id: 5,
    src: "/assets/couples/p1.jpg",
    alt: "Feven and Abenezer",
    rotation: -1.5,
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function GallerySection() {
  /*
   * null means that no image is currently enlarged.
   *
   * When an image is clicked, we store its index here.
   */
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // ==========================================================
  // OPEN IMAGE
  // ==========================================================

  const openImage = (index: number) => {
    setSelectedIndex(index);

    /*
     * Prevent the page underneath the lightbox
     * from scrolling.
     */
    document.body.style.overflow = "hidden";
  };

  // ==========================================================
  // CLOSE LIGHTBOX
  // ==========================================================

  const closeImage = () => {
    setSelectedIndex(null);

    /*
     * Restore normal page scrolling.
     */
    document.body.style.overflow = "";
  };

  // ==========================================================
  // PREVIOUS IMAGE
  // ==========================================================

  const showPrevious = () => {
    if (selectedIndex === null) {
      return;
    }

    setSelectedIndex(
      selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1,
    );
  };

  // ==========================================================
  // NEXT IMAGE
  // ==========================================================

  const showNext = () => {
    if (selectedIndex === null) {
      return;
    }

    setSelectedIndex(
      selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1,
    );
  };

  // ==========================================================
  // KEYBOARD NAVIGATION
  //
  // This is a nice little accessibility feature.
  //
  // Left arrow  → previous
  // Right arrow → next
  // Escape      → close
  // ==========================================================

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      closeImage();
    }

    if (event.key === "ArrowLeft") {
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }
  };

  return (
    <>
      {/* ======================================================
          GALLERY SECTION
      ======================================================= */}

      <section className="gallery-section" id="memories">
        {/* ----------------------------------------------------
            SUBTLE DECORATIVE BACKGROUND
        ----------------------------------------------------- */}

        <div className="gallery-section__texture" aria-hidden="true" />

        {/* ----------------------------------------------------
            MAIN CONTENT
        ----------------------------------------------------- */}

        <motion.div
          className="gallery-section__content"
          initial={{
            opacity: 0,
            y: 35,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
          }}
        >
          {/* ==================================================
              TITLE
          =================================================== */}

          <div className="gallery-section__heading">
            <h2>Our Memories</h2>

            <div className="gallery-section__divider" aria-hidden="true">
              <span />
              <span className="gallery-section__divider-symbol">❦</span>
              <span />
            </div>
          </div>

          {/* ==================================================
              PHOTO STRIP
          =================================================== */}

          <div className="gallery-section__photos">
            {galleryImages.map((image, index) => (
              <motion.button
                key={image.id}
                type="button"
                className="memory-photo"
                style={
                  {
                    "--rotation": `${image.rotation}deg`,
                  } as React.CSSProperties
                }
                onClick={() => openImage(index)}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -8,
                  rotate: 0,
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                aria-label={`Open memory ${index + 1}`}
              >
                {/* ------------------------------------------
                    PHOTOGRAPH FRAME
                ------------------------------------------- */}

                <span className="memory-photo__frame">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="memory-photo__image"
                  />
                </span>
              </motion.button>
            ))}
          </div>

          {/* ==================================================
              DOT INDICATORS

              These are intentionally NOT buttons/arrows.

              They visually tell the user there are multiple
              memories without making the gallery feel like a
              conventional carousel.
          =================================================== */}

          <div className="gallery-section__dots" aria-hidden="true">
            {galleryImages.map((image, index) => (
              <span
                key={image.id}
                className={
                  index === 0
                    ? "gallery-dot gallery-dot--active"
                    : "gallery-dot"
                }
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ======================================================
          LIGHTBOX
      ======================================================= */}

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            className="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            {/* =================================================
                CLOSE BUTTON
            ================================================== */}

            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={closeImage}
              aria-label="Close image"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            {/* =================================================
                PREVIOUS
            ================================================== */}

            <button
              type="button"
              className="
                gallery-lightbox__navigation
                gallery-lightbox__navigation--previous
              "
              onClick={showPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft size={36} strokeWidth={1.3} />
            </button>

            {/* =================================================
                IMAGE
            ================================================== */}

            <motion.div
              className="gallery-lightbox__image-wrapper"
              key={selectedIndex}
              initial={{
                opacity: 0,
                scale: 0.94,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.35,
              }}
            >
              <img
                src={galleryImages[selectedIndex].src}
                alt={galleryImages[selectedIndex].alt}
                className="gallery-lightbox__image"
              />
            </motion.div>

            {/* =================================================
                NEXT
            ================================================== */}

            <button
              type="button"
              className="
                gallery-lightbox__navigation
                gallery-lightbox__navigation--next
              "
              onClick={showNext}
              aria-label="Next image"
            >
              <ChevronRight size={36} strokeWidth={1.3} />
            </button>

            {/* =================================================
                IMAGE COUNTER

                Example:

                    2 / 5
            ================================================== */}

            <div className="gallery-lightbox__counter">
              {selectedIndex + 1}
              {" / "}
              {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
