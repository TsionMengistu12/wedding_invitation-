import { useParams } from "react-router-dom";

import InvitationHero from "../components/invitation/InvitationHero";
import AnnouncementSection from "../components/sections/AnnouncementSection";
import LocationSection from "../components/sections/LocationSection";
import GallarySection from "../components/sections/GallarySection";
import WishesSection from "../components/sections/WishesSection";

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

  if (loading) {
    return (
      <main className="invitation-loading">Opening your invitation...</main>
    );
  }

  if (error || !guest || !token) {
    return (
      <main className="invitation-loading">
        {error || "Invitation not found."}
      </main>
    );
  }

  const normalizedToken = normalizeInvitationToken(token);
  const invitationUrl = getInvitationUrl(normalizedToken);

  return (
    <main className="invitation-page">
      <InvitationHero guestName={guest.name} invitationUrl={invitationUrl} />

      <div className="invitation-sections">
        <AnnouncementSection guestName={guest.name} />
        <LocationSection />
        <GallarySection />
        <WishesSection
          token={normalizedToken}
          defaultAuthorName={guest.name}
        />
      </div>
    </main>
  );
}
