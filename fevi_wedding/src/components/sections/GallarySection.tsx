"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import "../../styles/gallarySection.css";

// ============================================================
// GALLERY BACKGROUND
// ============================================================
//
// Put your background image inside the `public` folder.
//
// Example:
//
// public/
// └── images/
//     └── gallery/
//         └── gallery-background.png
//
// Then use:
//
// "/images/gallery/gallery-background.png"
//
// If you don't want a background image, simply use:
// ""
// ============================================================

const galleryBackground = "/ornaments/background.jpg";

// ============================================================
// TYPES
// ============================================================

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

// ============================================================
// WEDDING PHOTOS
// ============================================================

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/couple/center.JPG?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvY291cGxlL2NlbnRlci5KUEciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg4MjUxMTEyLCJleHAiOjE4MDM4MDMxMTJ9.Y41WW2nzuRWAJaQxRaMvuWMrFm7KI8bTXhvy58TFCic",
    alt: "Feven and Abenezer",
  },
  {
    id: 2,
    src: "https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/couple/one.JPG?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvY291cGxlL29uZS5KUEciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg4MjUxNDM4LCJleHAiOjE4MDM4MDM0Mzh9.g3siWkEuG5Xc0FhS2IfClA0-mOwg50AemL4bHE23ssw",
    alt: "Feven and Abenezer",
  },
  {
    id: 3,
    src: "https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/couple/three.JPG?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvY291cGxlL3RocmVlLkpQRyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODgyNTE0NjksImV4cCI6MTgwMzgwMzQ2OX0.Ugp8fyLE21McW3WYmA0cjbS0wQ9ImYYKbx86MRfNYsg",
    alt: "Feven and Abenezer",
  },
  {
    id: 4,
    src: "https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/couple/two.JPG?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvY291cGxlL3R3by5KUEciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg4MjUxNTA0LCJleHAiOjE4MDM4MDM1MDR9.30oKs4rOwu-YXjMv-7PuUkglGAD2SGuxcvujLGclyBI",
    alt: "Feven and Abenezer",
  },
  {
    id: 5,
    src: "https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/couple/four.JPG?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvY291cGxlL2ZvdXIuSlBHIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4ODI1MTUzMiwiZXhwIjoxODAzODAzNTMyfQ.QjvOHczRz7n1WX-gVKga_JRGOuO7KrZiYh1z4wAKmBw",
    alt: "Feven and Abenezer",
  },
];

// ============================================================
// COMPONENT
// ============================================================

export default function GallerySection() {
  // ----------------------------------------------------------
  // ACTIVE SLIDESHOW PHOTO
  // ----------------------------------------------------------

  const [activeIndex, setActiveIndex] = useState(0);

  // ----------------------------------------------------------
  // LIGHTBOX
  //
  // null = closed
  // number = selected image
  // ----------------------------------------------------------

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // ----------------------------------------------------------
  // THUMBNAIL STRIP
  // ----------------------------------------------------------

  const thumbnailsRef = useRef<HTMLDivElement | null>(null);

  // ==========================================================
  // KEEP ACTIVE THUMBNAIL VISIBLE
  // ==========================================================

  useEffect(() => {
    const thumbnailStrip = thumbnailsRef.current;
    const thumbnail = thumbnailStrip?.children[activeIndex] as
      | HTMLElement
      | undefined;

    if (!thumbnailStrip || !thumbnail) {
      return;
    }

    // Only move the gallery's horizontal thumbnail strip. Using
    // element.scrollIntoView() here can also scroll the document vertically,
    // pulling a guest from the invitation down to this section when the
    // slideshow advances automatically.
    const targetLeft =
      thumbnail.offsetLeft + thumbnail.offsetWidth / 2 - thumbnailStrip.clientWidth / 2;

    thumbnailStrip.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, [activeIndex]);

  // Keep the gallery feeling alive without requiring guests to interact.
  // The active thumbnail and progress line both derive from activeIndex, so
  // they always move in lockstep with the centre photograph.
  useEffect(() => {
    if (selectedIndex !== null) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % galleryImages.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [selectedIndex]);

  // ==========================================================
  // OPEN LIGHTBOX
  // ==========================================================

  const openImage = (index: number) => {
    setSelectedIndex(index);

    document.body.style.overflow = "hidden";
  };

  // ==========================================================
  // CLOSE LIGHTBOX
  // ==========================================================

  const closeImage = () => {
    setSelectedIndex(null);

    document.body.style.overflow = "";
  };

  // ==========================================================
  // NEXT MAIN PHOTO
  // ==========================================================

  const showNext = () => {
    setActiveIndex((current) => {
      return (current + 1) % galleryImages.length;
    });
  };

  // ==========================================================
  // PREVIOUS MAIN PHOTO
  // ==========================================================

  const showPrevious = () => {
    setActiveIndex((current) => {
      return current === 0 ? galleryImages.length - 1 : current - 1;
    });
  };

  // ==========================================================
  // LIGHTBOX NEXT
  // ==========================================================

  const showNextLightbox = () => {
    if (selectedIndex === null) {
      return;
    }

    setSelectedIndex(
      selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1,
    );
  };

  // ==========================================================
  // LIGHTBOX PREVIOUS
  // ==========================================================

  const showPreviousLightbox = () => {
    if (selectedIndex === null) {
      return;
    }

    setSelectedIndex(
      selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1,
    );
  };

  // ==========================================================
  // SELECT THUMBNAIL
  // ==========================================================

  const selectPhoto = (index: number) => {
    setActiveIndex(index);
  };

  // ==========================================================
  // KEYBOARD CONTROLS
  // ==========================================================

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedIndex === null) {
        return;
      }

      if (event.key === "Escape") {
        closeImage();
      }

      if (event.key === "ArrowLeft") {
        showPreviousLightbox();
      }

      if (event.key === "ArrowRight") {
        showNextLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  // ==========================================================
  // CLEAN UP BODY SCROLL
  // ==========================================================

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          GALLERY SECTION
      ======================================================= */}

      <section
        className="gallery-section"
        id="memories"
        style={
          galleryBackground
            ? {
                backgroundImage: `
                  linear-gradient(
                    rgba(245, 235, 221, 0.28),
                    rgba(245, 235, 221, 0.28)
                  ),
                  url("${galleryBackground}")
                `,
              }
            : undefined
        }
      >
        {/* ----------------------------------------------------
            DECORATIVE TEXTURE
        ----------------------------------------------------- */}

        <div className="gallery-section__texture" aria-hidden="true" />

        {/* ----------------------------------------------------
            CORNER DECORATIONS
        ----------------------------------------------------- */}

        {/* <div
          className="
            gallery-section__corner
            gallery-section__corner--left
          "
          aria-hidden="true"
        />

        <div
          className="
            gallery-section__corner
            gallery-section__corner--right
          "
          aria-hidden="true"
        /> */}

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
              EYEBROW
          =================================================== */}

          {/* <div className="gallery-section__eyebrow">
            <span className="gallery-section__eyebrow-line" />

            <span>OUR STORY IN PICTURES</span>

            <span className="gallery-section__eyebrow-line" />
          </div> */}

          {/* ==================================================
              TITLE
          =================================================== */}

          <div className="gallery-section__heading">
            <h2>Gallery</h2>

            {/* <p>Every photograph holds a moment, every moment tells our story</p> */}

            {/* <div
              className="gallery-section__heading-ornament"
              aria-hidden="true"
            >
              <span />
              <b>•</b>
              <span />
            </div> */}
          </div>

          {/* ==================================================
              SLIDESHOW
          =================================================== */}

          <div className="gallery-slideshow">
            {/* ------------------------------------------------
                MAIN PHOTO
            ------------------------------------------------- */}

            <div className="gallery-main-photo">
              {/* Previous */}
              <button
                type="button"
                className="
                  gallery-main-photo__arrow
                  gallery-main-photo__arrow--left
                "
                onClick={showPrevious}
                aria-label="Previous photograph"
              >
                <ChevronLeft size={27} strokeWidth={1.4} />
              </button>
              {/* Main image */}
              {/* <AnimatePresence mode="wait">
                <motion.button
                  key={galleryImages[activeIndex].id}
                  type="button"
                  className="gallery-main-photo__button"
                  onClick={() => openImage(activeIndex)}
                  initial={{
                    opacity: 0,
                    x: `${slideDirection * 7}%`,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: `${slideDirection * -7}%`,
                  }}
                  transition={{
                    duration: 0.65,
                    ease: "easeInOut",
                  }}
                  aria-label={`Open ${galleryImages[activeIndex].alt}`}
                >
                  <span className="gallery-main-photo__frame">
                    <img
                      src={galleryImages[activeIndex].src}
                      alt={galleryImages[activeIndex].alt}
                      className="gallery-main-photo__image"
                    />

                    {/* Zoom indicator */}
              {/* <span className="gallery-main-photo__zoom">
                      <span>↗</span>
                    </span>
                  </span>
                </motion.button>
              </AnimatePresence> */}{" "}
              */
              <AnimatePresence initial={false}>
                <motion.button
                  key={galleryImages[activeIndex].id}
                  type="button"
                  className="gallery-main-photo__button"
                  onClick={() => openImage(activeIndex)}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    opacity: {
                      duration: 1.1,
                      ease: "easeInOut",
                    },
                  }}
                  aria-label={`Open ${galleryImages[activeIndex].alt}`}
                >
                  <span className="gallery-main-photo__frame">
                    <img
                      src={galleryImages[activeIndex].src}
                      alt={galleryImages[activeIndex].alt}
                      className={
                        activeIndex === 1
                          ? "gallery-main-photo__image gallery-main-photo__image--normal"
                          : "gallery-main-photo__image gallery-main-photo__image--bottom-center"
                      }
                    />

                    <span className="gallery-main-photo__zoom">
                      <span>↗</span>
                    </span>
                  </span>
                </motion.button>
              </AnimatePresence>
              {/* Next */}
              <button
                type="button"
                className="
                  gallery-main-photo__arrow
                  gallery-main-photo__arrow--right
                "
                onClick={showNext}
                aria-label="Next photograph"
              >
                <ChevronRight size={27} strokeWidth={1.4} />
              </button>
            </div>

            {/* =================================================
                THUMBNAILS
            ================================================== */}

            <div
              ref={thumbnailsRef}
              className="gallery-thumbnails"
              aria-label="Gallery photographs"
            >
              {galleryImages.map((image, index) => (
                <motion.button
                  key={image.id}
                  type="button"
                  className={
                    index === activeIndex
                      ? "gallery-thumbnail gallery-thumbnail--active"
                      : "gallery-thumbnail"
                  }
                  onClick={() => selectPhoto(index)}
                  whileHover={{
                    y: -4,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  aria-label={`Show photograph ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                >
                  <span className="gallery-thumbnail__frame">
                    <img
                      src={image.src}
                      alt=""
                      className="gallery-thumbnail__image"
                    />
                  </span>
                </motion.button>
              ))}
            </div>

            {/* =================================================
                SLIDESHOW INDICATOR
            ================================================== */}

            <div className="gallery-progress" aria-hidden="true">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={
                    index === activeIndex
                      ? "gallery-progress__item gallery-progress__item--active"
                      : "gallery-progress__item"
                  }
                  onClick={() => selectPhoto(index)}
                  aria-label={`Show photograph ${index + 1}`}
                />
              ))}
            </div>

            {/* =================================================
                BOTTOM ORNAMENT
            ================================================== */}

            {/* <div className="gallery-bottom-ornament" aria-hidden="true">
              <span />
              <b>✦</b>
              <span />
            </div> */}
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
            aria-label="Enlarged wedding photograph"
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
            {/* Background */}

            <button
              type="button"
              className="gallery-lightbox__backdrop"
              onClick={closeImage}
              aria-label="Close gallery"
            />

            {/* Close */}

            <button
              type="button"
              className="gallery-lightbox__close"
              onClick={closeImage}
              aria-label="Close image"
            >
              <X size={27} strokeWidth={1.4} />
            </button>

            {/* Previous */}

            <button
              type="button"
              className="
                gallery-lightbox__navigation
                gallery-lightbox__navigation--previous
              "
              onClick={showPreviousLightbox}
              aria-label="Previous image"
            >
              <ChevronLeft size={38} strokeWidth={1.2} />
            </button>

            {/* Image */}

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                className="gallery-lightbox__image-wrapper"
                initial={{
                  opacity: 0,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                }}
              >
                <img
                  src={galleryImages[selectedIndex].src}
                  alt={galleryImages[selectedIndex].alt}
                  className="gallery-lightbox__image"
                />
              </motion.div>
            </AnimatePresence>

            {/* Next */}

            <button
              type="button"
              className="
                gallery-lightbox__navigation
                gallery-lightbox__navigation--next
              "
              onClick={showNextLightbox}
              aria-label="Next image"
            >
              <ChevronRight size={38} strokeWidth={1.2} />
            </button>

            {/* Counter */}

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
