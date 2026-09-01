import { QRCodeCanvas } from "qrcode.react";

interface InvitationCardProps {
  guestName: string;
  invitationUrl: string;
}

export default function InvitationCard({
  guestName,
  invitationUrl,
}: InvitationCardProps) {
  return (
    <article className="invitation-card">
      <img
        src="/couple/front.JPG"
        alt={`Feven and Abenezer's invitation for ${guestName}`}
        className="invitation-card__photo"
      />

      <div className="invitation-card__photo-overlay" />

      <div className="invitation-card__circle">
        <div className="invitation-card__content">
          <div className="invitation-card__qr">
            <QRCodeCanvas
              value={invitationUrl}
              size={136}
              level="H"
              includeMargin
            />
          </div>
        </div>
      </div>
    </article>
  );
}
