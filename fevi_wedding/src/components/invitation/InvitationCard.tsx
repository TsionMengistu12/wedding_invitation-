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
        src="/assets/couples/p1.jpg"
        alt="Feven and Abenezer"
        className="invitation-card__photo"
      />

      <div className="invitation-card__photo-overlay" />

      <div className="invitation-card__circle">
        {/* <div className="circle-decoration circle-decoration--top">
          <span>⌒</span>
        </div> */}

        <div className="invitation-card__content">
          {/* <p className="invitation-card__greeting">HELLO, {guestName}</p> */}

          {/* <p className="invitation-card__subtitle">
            We invite you to attend our wedding
          </p> */}

          {/* <h1 className="invitation-card__names">
            FEVEN &
            <br />
            ABENEZER
          </h1> */}

          <div className="invitation-card__qr">
            <QRCodeCanvas
              value={invitationUrl}
              size={96}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>

        {/* <div className="circle-decoration circle-decoration--bottom">
          <span>✿</span>
        </div> */}
      </div>
    </article>
  );
}
