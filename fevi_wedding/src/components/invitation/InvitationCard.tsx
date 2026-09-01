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
        src="https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/couple/front.JPG?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvY291cGxlL2Zyb250LkpQRyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODgyNTEzMDYsImV4cCI6MTgwMzgwMzMwNn0.nL6PCYpM7gNB7fHABQNgAuKSp0WjCOKCqhPnqE-7pyY"
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
