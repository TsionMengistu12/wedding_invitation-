import InvitationCard from "./InvitationCard";

interface InvitationEntranceProps {
  guestName: string;
  invitationUrl: string;
}

export default function InvitationEntrance({
  guestName,
  invitationUrl,
}: InvitationEntranceProps) {
  return (
    <div className="invitation-entrance">
      <div className="invitation-entrance__frame">
        <img
          className="invitation-entrance__corner invitation-entrance__corner--tl"
          src="/assets/ornaments/top_corner.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="invitation-entrance__corner invitation-entrance__corner--tr"
          src="/assets/ornaments/top_corner.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="invitation-entrance__corner invitation-entrance__corner--bl"
          src="/assets/ornaments/top_corner.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="invitation-entrance__corner invitation-entrance__corner--br"
          src="/assets/ornaments/top_corner.png"
          alt=""
          aria-hidden="true"
        />

        <div className="invitation-entrance__card-shell">
          <InvitationCard
            guestName={guestName}
            invitationUrl={invitationUrl}
          />
        </div>

        <img
          className="invitation-entrance__bottom-floral"
          src="/assets/ornaments/background4.png"
          alt=""
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
