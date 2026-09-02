"use client";

import { motion } from "framer-motion";
import type { AnnouncementType } from "../../types/invitation";
import SectionDivider from "../ornaments/SectionDivider";

import styles from "../invitation/InvitationEntrance.module.css";

interface InvitationLetterProps {
  guestName: string;
  announcementType: AnnouncementType;
}
const announcementContent = {
  bride: {
    mother: "Mrs Helen Adane",
    father: "Mr Semaw Nigatu",
  },
  groom: {
    mother: "Mrs Almaz Hailu",
    father: "Mr Alemayehu Ayele",
  },
};

export default function AnnouncementSection({
  guestName,
  announcementType,
}: InvitationLetterProps) {
  const parents = announcementContent[announcementType];

  return (
    <section className="announcement-section" id="invitation-details">
      <motion.div
        className="announcement-section__content"
        initial={{
          opacity: 0,
          y: 28,
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
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
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
        <h2 className="announcement-section__groom">Abenezer Alemayehu</h2>

        {/* Wedding information */}
        <p className="announcement-section__body">
          who will be united in Holy Matrimony on{" "}
          <strong>September 13, 2026 G.C.</strong>
          at <strong>CMC Debre Mitmak Sealite Mihret Church.</strong>
        </p>

        {/* Invitation */}
        <p className="announcement-section__body">
          As they begin this beautiful journey together, we invite you{" "}
          <strong>{guestName} </strong>
          to join us for a<strong>dinner celebration</strong> at{" "}
          <strong>Friendship Park</strong> at <strong>11:00 Local Time,</strong>
          following the Holy Matrimony.
        </p>

        <p className="announcement-section__body">
          We would be honored to share this special day with you and celebrate
          together.
        </p>

        {/* Final divider */}
        <SectionDivider className={styles.divider} maxWidth="400px" />

        {/* Parents */}
        <p className="announcement-section__gratitude">
          With love and gratitude,
        </p>

        <p className="announcement-section__parent">{parents.mother}</p>
        <p className="announcement-section__and">And</p>
        <p className="announcement-section__parent">{parents.father}</p>
      </motion.div>
    </section>
  );
}
