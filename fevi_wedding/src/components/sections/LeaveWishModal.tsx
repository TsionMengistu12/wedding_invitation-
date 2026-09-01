import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Heart, PenLine, Send, X } from "lucide-react";
import SectionDivider from "../ornaments/SectionDivider";

import styles from "../invitation/InvitationEntrance.module.css";

interface LeaveWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { name: string; message: string }) => void | Promise<void>;
  defaultName?: string;
  submitError?: string;
  cornerOrnament?: string;
  bottomOrnament?: string;
}

export default function LeaveWishModal({
  isOpen,
  onClose,
  onSubmit,
  defaultName = "",
  submitError = "",
  cornerOrnament = "/ornaments/wish_popup_corner.png",
  bottomOrnament,
}: LeaveWishModalProps) {
  const [name, setName] = useState(defaultName);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(defaultName);
    setMessage("");
  }, [defaultName, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !message.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.({
        name: name.trim(),
        message: message.trim(),
      });

      setName(defaultName);
      setMessage("");
      onClose();
    } catch {
      // Parent sets submitError for display.
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="wish-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="wish-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-wish-title"
      >
        <button
          type="button"
          className="wish-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.4} />
        </button>

        <div className="wish-modal-background" aria-hidden="true" />

        {cornerOrnament && (
          <img
            src={cornerOrnament}
            className="wish-modal-border-ornament"
            alt=""
            aria-hidden="true"
          />
        )}

        <div className="wish-modal-scroll">
          <div className="wish-modal-content">
            <header className="wish-modal-header">
              <div className="wish-modal-title-icon">
                <PenLine size={16} strokeWidth={1.35} />
              </div>

            <h2 id="leave-wish-title">Leave Your Wish</h2>

            <SectionDivider className={styles.divider} maxWidth="400px" />

            <p>
              Share your love and blessings
              <br />
              with the happy couple.
            </p>
            </header>

            <form className="wish-form" onSubmit={handleSubmit}>
            <div className="wish-field">
              <label htmlFor="wish-name">Your Name</label>

              <input
                id="wish-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your Name"
                maxLength={80}
                required
                autoComplete="name"
              />
            </div>

            <div className="wish-field">
              <label htmlFor="wish-message">Your Message</label>

              <textarea
                id="wish-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write your wishes for the couple..."
                maxLength={700}
                required
              />

              <span className="wish-character-count">{message.length}/700</span>
            </div>

            {submitError && (
              <p className="wish-form-error" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="wish-submit-button"
              disabled={isSubmitting || !name.trim() || !message.trim()}
            >
              <span>{isSubmitting ? "Sending..." : "Send Wish"}</span>

              <Send size={15} strokeWidth={1.45} />

              <Heart
                className="wish-submit-heart"
                size={14}
                strokeWidth={1.3}
              />
            </button>
            </form>

            {bottomOrnament && (
              <div className="wish-bottom-ornament">
                <img src={bottomOrnament} alt="" aria-hidden="true" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
