import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, PenLine, Quote } from "lucide-react";

import LeaveWishModal from "./LeaveWishModal";
import {
  fetchApprovedWishes,
  getErrorMessage,
  submitWish,
  WISH_REFRESH_INTERVAL_MS,
} from "../../services/wishes";
import type { Wish } from "../../types/wish";
import "../../styles/wishesSection.css";
import "../../styles/LeaveWishModal.css";

interface WishesSectionProps {
  token: string;
  defaultAuthorName?: string;
}

export default function WishesSection({
  token,
  defaultAuthorName = "",
}: WishesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const loadWishes = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setLoadError("");

    try {
      const approvedWishes = await fetchApprovedWishes();
      setWishes(approvedWishes);
    } catch (error) {
      console.error(error);
      setLoadError("We couldn't load wishes right now.");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void loadWishes();
    }, 0);

    const refreshTimer = window.setInterval(() => {
      void loadWishes(false);
    }, WISH_REFRESH_INTERVAL_MS);

    return () => {
      window.clearTimeout(initialLoadTimer);
      window.clearInterval(refreshTimer);
    };
  }, [loadWishes]);

  useEffect(() => {
    const carousel = scrollRef.current;
    if (!carousel) {
      return;
    }

    const updateScrollIndicators = () => {
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

      setCanScrollLeft(carousel.scrollLeft > 1);
      setCanScrollRight(carousel.scrollLeft < maxScrollLeft - 1);
    };

    updateScrollIndicators();
    carousel.addEventListener("scroll", updateScrollIndicators, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updateScrollIndicators);
    resizeObserver.observe(carousel);

    return () => {
      carousel.removeEventListener("scroll", updateScrollIndicators);
      resizeObserver.disconnect();
    };
  }, [wishes, loading, loadError]);

  const scrollCards = (direction: "left" | "right") => {
    if (!scrollRef.current) {
      return;
    }

    const amount = scrollRef.current.clientWidth * 0.75;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  async function handleSubmitWish(data: { name: string; message: string }) {
    setSubmitError("");

    try {
      const result = await submitWish(token, data.message, data.name);

      if (!result?.success) {
        throw new Error(result?.message || "Something went wrong.");
      }

      // The submitted wish is pending, but refresh existing approved cards.
      await loadWishes(false);
    } catch (error) {
      const message = getErrorMessage(error, "We couldn't send your wish.");
      setSubmitError(message);
      throw error;
    }
  }

  return (
    <>
      <section className="wishes-section">
        <div className="wishes-texture" aria-hidden="true" />

        <div className="wishes-container">
          <div className="wishes-heading">
            {/* <span className="wishes-heading-line" /> */}

            <div className="wishes-heading-content">
              {/* <MessageCircleHeart
                className="wishes-heading-icon"
                size={18}
                strokeWidth={1.4}
              /> */}

              <h2>Wishes for the Happy Couple</h2>

              <p>Share your love and blessings with the newlyweds</p>
            </div>

            <span className="wishes-heading-line" />
          </div>

          <div className="wishes-carousel-wrapper">
            {canScrollLeft && (
              <button
                type="button"
                className="wishes-arrow wishes-arrow-left"
                onClick={() => scrollCards("left")}
                aria-label="Previous wishes"
              >
                <ChevronLeft size={19} strokeWidth={1.5} />
              </button>
            )}

            <div
              className="wishes-carousel"
              ref={scrollRef}
              role="region"
              aria-label="Wedding wishes"
              tabIndex={0}
            >
              {loading && (
                <p className="wishes-status-message">Loading wishes...</p>
              )}

              {!loading && loadError && (
                <p className="wishes-status-message wishes-status-message--error">
                  {loadError}
                </p>
              )}

              {!loading && !loadError && wishes.length === 0 && (
                <p className="wishes-status-message">
                  Be the first to leave a wish for the couple.
                </p>
              )}

              {!loading &&
                !loadError &&
                wishes.map((wish) => (
                  <article className="wish-card" key={wish.id}>
                    <div className="wish-quote" aria-hidden="true">
                      <Quote size={19} strokeWidth={1.8} />
                    </div>

                    <p className="wish-message">{wish.wish_message}</p>

                    <div className="wish-footer">
                      <span className="wish-author">— {wish.author_name}</span>

                      <Heart
                        className="wish-heart"
                        size={17}
                        strokeWidth={1.35}
                      />
                    </div>
                  </article>
                ))}
            </div>

            {canScrollRight && (
              <button
                type="button"
                className="wishes-arrow wishes-arrow-right"
                onClick={() => scrollCards("right")}
                aria-label="Next wishes"
              >
                <ChevronRight size={19} strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="leave-wish-wrapper">
            <button
              type="button"
              className="leave-wish-button"
              onClick={() => {
                setSubmitError("");
                setModalOpen(true);
              }}
            >
              <span>Leave Your Wish</span>

              <PenLine
                size={17}
                strokeWidth={1.45}
                className="leave-wish-icon"
              />
            </button>
          </div>

          {/* <p className="wishes-bottom-text">
            Wishes are reviewed before appearing here.
          </p> */}
        </div>
      </section>

      <LeaveWishModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSubmitError("");
        }}
        onSubmit={handleSubmitWish}
        defaultName={defaultAuthorName}
        submitError={submitError}
        cornerOrnament="/ornaments/wish_popup_corner.png"
        bottomOrnament="/ornaments/section-divider.png"
      />
    </>
  );
}
