import { useParams } from "react-router-dom";
import InvitationHero from "../components/invitation/InvitationHero";
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
        <AnnouncementSection
          guestName={guest.name}
          announcementType={guest.announcement_type}
        />
        <LocationSection />
        <GallarySection />
        <WishesSection token={normalizedToken} defaultAuthorName={guest.name} />
        <QrCheckInSection invitationUrl={getInvitationUrl(normalizedToken)} />
      </div>
      <WeddingMusic />
    </main>
  );
}
