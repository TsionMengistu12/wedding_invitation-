import { QRCodeCanvas } from "qrcode.react";
import SectionDivider from "../ornaments/SectionDivider";
import styles from "./QrCheckInSection.module.css";
// import HeroBottomDecoration from "../ornaments/HeroBottomDecoration";

interface QrCheckInSectionProps {
  invitationUrl: string;
}

export default function QrCheckInSection({
  invitationUrl,
}: QrCheckInSectionProps) {
  return (
    <section
      className={styles.section}
      id="qr-check-in"
      aria-labelledby="check-in-title"
    >
      <div className={styles.frame}>
        <div className={styles.qr}>
          <QRCodeCanvas
            value={invitationUrl}
            size={164}
            level="H"
            includeMargin
          />
        </div>
        <div className={styles.copy}>
          <h2 id="check-in-title">Scan to Join Our Celebration</h2>
          <SectionDivider className={styles.divider} maxWidth="170px" />
          <p>
            Please scan this QR code at the entrance to let us know you’re here!
          </p>
          <p className={styles.thanks}>Thank you!</p>
        </div>
        {/* <HeroBottomDecoration /> */}
      </div>
    </section>
  );
}
