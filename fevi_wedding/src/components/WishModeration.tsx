import { useCallback, useEffect, useState } from "react";
import { Check, Heart, X } from "lucide-react";

import {
  approveWish,
  fetchPendingWishes,
  getErrorMessage,
  rejectWish,
  WISH_REFRESH_INTERVAL_MS,
} from "../services/wishes";
import type { PendingWish } from "../types/wish";

function formatWishDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function WishModeration() {
  const [wishes, setWishes] = useState<PendingWish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadPendingWishes = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError("");

    try {
      const pendingWishes = await fetchPendingWishes();
      setWishes(pendingWishes);
    } catch (requestError) {
      console.error(requestError);
      setError(getErrorMessage(requestError, "Could not load pending wishes."));
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const initialLoadTimer = window.setTimeout(() => {
      void loadPendingWishes();
    }, 0);

    const refreshTimer = window.setInterval(() => {
      void loadPendingWishes(false);
    }, WISH_REFRESH_INTERVAL_MS);

    return () => {
      window.clearTimeout(initialLoadTimer);
      window.clearInterval(refreshTimer);
    };
  }, [loadPendingWishes]);

  async function handleApprove(wishId: string) {
    setProcessingId(wishId);
    setError("");
    setSuccess("");

    try {
      const result = await approveWish(wishId);

      if (!result?.success) {
        setError(result?.message || "Could not approve this wish.");
        return;
      }

      setWishes((current) => current.filter((wish) => wish.id !== wishId));
      setSuccess("Wish approved and now visible on the invitation.");
    } catch (requestError) {
      console.error(requestError);
      setError(getErrorMessage(requestError, "Could not approve this wish."));
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(wishId: string) {
    setProcessingId(wishId);
    setError("");
    setSuccess("");

    try {
      const result = await rejectWish(wishId);

      if (!result?.success) {
        setError(result?.message || "Could not reject this wish.");
        return;
      }

      setWishes((current) => current.filter((wish) => wish.id !== wishId));
      setSuccess("Wish rejected.");
    } catch (requestError) {
      console.error(requestError);
      setError(getErrorMessage(requestError, "Could not reject this wish."));
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <section className="wish-moderation">
      <div className="wish-moderation__header">
        <div>
          <p className="section-eyebrow">Guest messages</p>
          <h2>Wish Moderation</h2>
          <p className="wish-moderation__intro">
            Review wishes before they appear on the invitation page.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() => void loadPendingWishes()}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="upload-message is-error">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="upload-message is-success">
          <p>{success}</p>
        </div>
      )}

      <div className="wish-moderation__stats">
        <div className="stat-card">
          <span>Pending review</span>
          <strong>{wishes.length}</strong>
        </div>
      </div>

      {loading ? (
        <p className="wish-moderation__empty">Loading pending wishes...</p>
      ) : wishes.length === 0 ? (
        <div className="wish-moderation__empty-card">
          <Heart size={22} strokeWidth={1.4} />
          <p>No wishes waiting for approval.</p>
        </div>
      ) : (
        <div className="wish-moderation__list">
          {wishes.map((wish) => (
            <article className="wish-moderation__card" key={wish.id}>
              <div className="wish-moderation__meta">
                <div>
                  <strong>{wish.author_name}</strong>
                  {wish.guest_name && (
                    <span>Invitation guest: {wish.guest_name}</span>
                  )}
                </div>

                <time dateTime={wish.created_at}>
                  {formatWishDate(wish.created_at)}
                </time>
              </div>

              <p className="wish-moderation__message">{wish.wish_message}</p>

              <div className="wish-moderation__actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => handleApprove(wish.id)}
                  disabled={processingId === wish.id}
                >
                  <Check size={14} strokeWidth={1.8} />
                  Approve
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleReject(wish.id)}
                  disabled={processingId === wish.id}
                >
                  <X size={14} strokeWidth={1.8} />
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
