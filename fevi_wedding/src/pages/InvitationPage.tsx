import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../lib/supabase";
import WishesSection from "../components/WishesSection";
import "../styles/invitation.css";

interface Guest {
  name: string;
  guest_limit: number;
}
export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishOpen, setWishOpen] = useState(false);
  useEffect(() => {
    async function loadInvitation() {
      if (!token) {
        setError("Invalid invitation.");
        setLoading(false);
        return;
      }
      try {
        const { data, error: invitationError } = await supabase.rpc(
          "get_invitation_by_token",
          { token_value: token },
        );
        if (invitationError) throw invitationError;
        if (!data?.length) {
          setError("This invitation could not be found.");
          return;
        }
        setGuest(data[0]);
      } catch (requestError) {
        console.error(requestError);
        setError("We couldn't load this invitation.");
      } finally {
        setLoading(false);
      }
    }
    loadInvitation();
  }, [token]);
  if (loading)
    return (
      <main className="invitation-loading">Opening your invitation...</main>
    );
  if (error || !guest || !token)
    return (
      <main className="invitation-loading">
        {error || "Invitation not found."}
      </main>
    );
  const invitationUrl = `${window.location.origin}/invite/${token}`;
  return (
    <main className="invitation-page">
      <section className="invitation-hero">
        <img
          className="top-corner-ornament"
          src="/assets/ornaments/top_corner.png"
          alt=""
          aria-hidden="true"
        />

        <div className="hero-inner">
          <img
            className="hero-cross"
            src="/assets/ornaments/cross.svg"
            alt=""
            aria-hidden="true"
          />

          <p className="scripture">
            &ldquo;The Lord has done great things for us, and we are filled with
            joy.&rdquo;
            <br />
            <span>&mdash; Psalm 126:3</span>
          </p>

          <div className="hero-copy">
            <p>
              Dear <strong>{guest.name}</strong>,
            </p>

            <p>
              we joyfully announce the holy matrimony of our beloved children,
            </p>

            <h2>
              Feven Semaw
              <span>and</span>
              Mr. Abenezer Alemayehu
            </h2>

            <p>
              who will be united in Holy Matrimony on{" "}
              <strong>September 13, 2026 G.C.</strong> at{" "}
              <strong>CMC Debre Mitmak Sealite Mihret Church.</strong>
            </p>

            <p>
              As they begin this beautiful journey together, we warmly invite
              you to join us for a{" "}
              <strong>dinner celebration at Friendship Park at 11:00 LT</strong>
              . We would be honored to share this special day with you and
              celebrate together in love, joy, and fellowship.
            </p>

            <p className="signature">
              With love and gratitude,
              <br />
              <strong>
                Mrs Helen Adane
                <br />
                and
                <br />
                Ato Semaw Nigatu
              </strong>
            </p>
          </div>
        </div>

        <div className="couple-portrait">
          <div className="portrait-haze" />

          <img src="/assets/couples/p1.jpg" alt="Feven and Abenezer" />
        </div>

        <div className="hero-ribbon" />

        <div className="hero-bottom">
          <img
            className="hero-flower hero-flower-left"
            src="/assets/ornaments/left_flower.svg"
            alt=""
            aria-hidden="true"
          />

          <img
            className="hero-seal"
            src="/assets/ornaments/seal.png"
            alt=""
            aria-hidden="true"
          />

          <img
            className="hero-flower hero-flower-right"
            src="/assets/ornaments/right_flower.svg"
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>
      <section className="event-card">
        <p className="section-eyebrow">SAVE THE DATE</p>
        <h2>September 13, 2026</h2>
        <img
          className="event-separator"
          src="/assets/ornaments/smaller_separator.svg"
          alt=""
        />
        <div>
          <p>
            <b>Holy Matrimony</b>
            <br />
            CMC Debre Mitmak Sealite Mihret Church
          </p>
          <p>
            <b>Dinner Celebration &middot; 11:00 LT</b>
            <br />
            Friendship Park
          </p>
        </div>
      </section>
      <section className="ticket-section">
        <div className="ticket">
          <p className="section-eyebrow">YOUR PERSONAL INVITATION</p>
          <h2>{guest.name}</h2>
          <p>You are invited to celebrate with us.</p>
          <div className="guest-allowance">
            <span>GUEST ALLOWANCE</span>
            <strong>
              {guest.guest_limit === 1
                ? "You"
                : `You + ${guest.guest_limit - 1}`}
            </strong>
          </div>
          <QRCodeCanvas
            value={invitationUrl}
            size={160}
            level="M"
            includeMargin
          />
          <p className="ticket-footer">
            PLEASE PRESENT THIS INVITATION AT THE ENTRANCE
          </p>
        </div>
      </section>
      <section className="wishes-section">
        <p className="section-eyebrow">WORDS FOR THE COUPLE</p>
        <h2>Leave us a little love</h2>
        <button
          className="primary-button"
          type="button"
          onClick={() => setWishOpen(true)}
        >
          LEAVE A WISH
        </button>
      </section>
      <footer className="invitation-footer">
        With love, <strong>Feven &amp; Abenezer</strong>
      </footer>
      {wishOpen && (
        <div
          className="wish-modal"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) =>
            event.currentTarget === event.target && setWishOpen(false)
          }
        >
          <div className="wish-modal-card">
            <button
              className="wish-modal-close"
              type="button"
              aria-label="Close"
              onClick={() => setWishOpen(false)}
            >
              &times;
            </button>
            <WishesSection token={token} guestName={guest.name} />
          </div>
        </div>
      )}
    </main>
  );
}
