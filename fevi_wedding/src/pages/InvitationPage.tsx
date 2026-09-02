import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import InvitationHero from "../components/invitation/InvitationHero";
import ScrollReveal from "../components/invitation/ScrollReveal";
import WeddingMusic from "../components/music/WeddingMusic";
import AnnouncementSection from "../components/sections/AnnouncementSection";
import LocationSection from "../components/sections/LocationSection";
import GallarySection from "../components/sections/GallarySection";
import WishesSection from "../components/sections/WishesSection";
import QrCheckInSection from "../components/sections/QrCheckInSection";
import { useInvitationGuest } from "../hooks/useInvitationGuest";
import {
  getInvitationUrl,
  normalizeInvitationToken,
} from "../utils/invitationUrl";
import "../styles/invitation.css";
import "../styles/announcementSection.css";
import "../styles/locationSection.css";
import "../styles/guestSection.css";

export default function InvitationPage() {
  const { token } = useParams<{ token: string }>();
  const { guest, loading, error } = useInvitationGuest(token);

  useLayoutEffect(() => {
    if (loading) return;

    // This page should always open at the start, rather than at a browser-
    // restored position from a previous visit.
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousRestoration;
    };
  }, [loading]);
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
  const normalizedToken = normalizeInvitationToken(token);
  return (
    <main className="invitation-page">
      <InvitationHero
        guestName={guest.name}
        invitationUrl={getInvitationUrl(normalizedToken)}
      />
      <div className="invitation-sections">
        <ScrollReveal>
          <AnnouncementSection
            guestName={guest.name}
            announcementType={guest.announcement_type}
          />
        </ScrollReveal>
        <ScrollReveal>
          <LocationSection />
        </ScrollReveal>
        <ScrollReveal>
          <GallarySection />
        </ScrollReveal>
        <ScrollReveal>
          <WishesSection
            token={normalizedToken}
            defaultAuthorName={guest.name}
          />
        </ScrollReveal>
        <ScrollReveal>
          <QrCheckInSection invitationUrl={getInvitationUrl(normalizedToken)} />
        </ScrollReveal>
      </div>
      <WeddingMusic />
    </main>
  );
}
