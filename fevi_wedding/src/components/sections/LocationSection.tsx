"use client";

import { motion } from "framer-motion";
import { Church, MapPin, Navigation } from "lucide-react";
// import LocationFlower from "../ornaments/LocationFlower";
import SectionDivider from "../ornaments/SectionDivider";

import styles from "../invitation/InvitationEntrance.module.css";

export default function LocationSection() {
  return (
    <section className="location-section">
      {/* =====================================================
          DECORATIVE FLORAL ORNAMENTS
      ====================================================== */}

      {/* <LocationFlower side="left" />
      <LocationFlower side="right" /> */}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <motion.div
        className="location-section__content"
        initial={{
          opacity: 0,
          y: 35,
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
          ease: "easeOut",
        }}
      >
        {/* =================================================
            SECTION TITLE
        ================================================== */}

        <div className="location-section__heading">
          <h2>The Day</h2>
          <SectionDivider className={styles.divider} maxWidth="400px" />

          {/* <div className="location-section__heading-divider">
            <span />
            <span className="location-section__diamond">◆</span>
            <span />
          </div> */}
        </div>

        {/* =================================================
            LOCATION INFORMATION

            On desktop:
            
            Ceremony | divider | Reception

            On mobile:

            Ceremony
               |
            Reception
        ================================================== */}

        <div className="location-section__locations">
          {/* =================================================
              MORNING CHURCH CEREMONY
          ================================================== */}

          <motion.article
            className="location-card"
            initial={{
              opacity: 0,
              x: -25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
          >
            <div className="location-card__icon">
              <Church strokeWidth={1.4} size={48} />
            </div>

            <h3>Morning Church Ceremony</h3>

            <p className="location-card__time">
              4:00 AM <br /> morning 10:00 Local Time
            </p>

            <p className="location-card__address">
              CMC Debre Mitmak Sealite Mihret Church
              <br />
              Addis Ababa, Ethiopia
            </p>
          </motion.article>

          {/* =================================================
              CENTER DIVIDER
          ================================================== */}

          <div
            className="location-section__vertical-divider"
            aria-hidden="true"
          >
            {/* <span className="divider-line" />
            <span className="divider-ornament">❦</span>
           <span className="divider-line" /> */}
          </div>

          {/* =================================================
              RECEPTION VENUE
          ================================================== */}

          <motion.article
            className="location-card"
            initial={{
              opacity: 0,
              x: 25,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >
            <div className="location-card__icon">
              <MapPin strokeWidth={1.4} size={48} />
            </div>

            <h3>Reception Venue</h3>

            <p className="location-card__time">
              5:00 PM <br /> After noon 11:00 Local Time
            </p>

            <p className="location-card__venue">Friendship Park</p>

            <p className="location-card__address">Addis Ababa, Ethiopia</p>
          </motion.article>
        </div>

        {/* =================================================
            VIEW LOCATION BUTTON
        ================================================== */}

        <motion.a
          href="https://www.google.com/maps/search/?api=1&query=Friendship+Park%2C+Addis+Ababa%2C+Ethiopia"
          target="_blank"
          rel="noopener noreferrer"
          className="location-section__button"
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
        >
          <span>View Location</span>

          <Navigation size={17} strokeWidth={1.6} />
        </motion.a>
      </motion.div>
    </section>
  );
}
