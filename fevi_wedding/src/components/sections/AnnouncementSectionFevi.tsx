"use client";

import { motion } from "framer-motion";

interface InvitationLetterProps {
  guestName: string;
}

export default function AnnouncementSectionFevi({
  guestName,
}: InvitationLetterProps) {
  return (
    <section className="announcement-section">
      <motion.div
        className="announcement-section__content"
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
      >
        {/* Cross */}
        <div className="announcement-section__cross">✝</div>

        {/* Small decorative divider
        <div className="announcement-divider">
          <span>❦</span>
        </div> */}

        {/* Introduction */}
        <p className="announcement-section__intro">
          We joyfully announce
          <br />
          the wedding of our beloved children,
        </p>

        {/* Bride */}
        <h2 className="announcement-section__bride">Feven Semaw</h2>

        {/* And */}
        <p className="announcement-section__and">and</p>

        {/* Groom */}
        <h2 className="announcement-section__groom">Mr. Abenezer Alemayehu</h2>

        {/* Divider */}
        <div className="announcement-divider">
          <span>❦</span>
        </div>

        {/* Wedding information */}
        <p className="announcement-section__body">
          who will be united
          <br />
          in Holy Matrimony on <strong>September 13, 2026 G.C.</strong>
          <br />
          at <strong>CMC Debre Mitmak Sealite Mihret Church.</strong>
        </p>

        {/* Invitation */}
        <p className="announcement-section__body">
          As they begin this
          <br />
          beautiful journey together,
          <br />
          we invite you <strong>{guestName}</strong>
          <br />
          to join us for a
          <br />
          <strong>dinner celebration</strong> at{" "}
          <strong>Friendship Park</strong> at <strong>11:00 LT,</strong>
          <br />
          following the Holy Matrimony.
        </p>

        <p className="announcement-section__body">
          We would be honored to share this special day
          <br />
          with you and celebrate together.
        </p>

        {/* Final divider */}
        <div className="announcement-divider">
          <span>❦</span>
        </div>

        {/* Parents */}
        <p className="announcement-section__gratitude">
          With love and gratitude,
        </p>

        <p className="announcement-section__parent">W/o Helen Adane</p>

        <p className="announcement-section__and">And</p>

        <p className="announcement-section__parent">Ato Semaw Nigatu</p>
      </motion.div>
    </section>
  );
}
