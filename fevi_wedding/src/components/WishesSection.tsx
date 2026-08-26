import { useState } from "react";
import { submitWish } from "../services/wishes";

interface WishesSectionProps {
  token: string;
  guestName: string;
  onClose?: () => void;
}

export default function WishesSection({
  token,
  guestName,
}: WishesSectionProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!message.trim()) {
      setError("Please write a message first.");
      return;
    }

    setLoading(true);

    try {
      const result = await submitWish(token, message);

      if (!result?.[0]?.success) {
        setError(result?.[0]?.message || "Something went wrong.");
        return;
      }

      setSubmitted(true);
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("We couldn't send your wish. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section>
        <h2>Thank You, {guestName} 💌</h2>

        <p>Your beautiful wishes have been received.</p>

        <p>Thank you for being part of their special day.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Leave a Wish 💌</h2>

      <p>Write something special for the happy couple.</p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your wishes here..."
          maxLength={500}
          rows={5}
        />

        <div>{message.length}/500</div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send My Wishes 💌"}
        </button>
      </form>
    </section>
  );
}
