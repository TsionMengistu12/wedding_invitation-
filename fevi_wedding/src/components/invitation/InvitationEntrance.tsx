import { useEffect, useState } from "react";

import CoupleArchFrame from "../ornaments/CoupleArchFrame";
import HeroOrnaments from "../ornaments/HeroOrnaments";
import SectionDivider from "../ornaments/SectionDivider";
import ScrollIndicator from "./ScrollIndicator";

import styles from "./InvitationEntrance.module.css";

interface InvitationEntranceProps {
  guestName: string;
  invitationUrl: string;
}

const weddingDate = new Date("2026-09-13T11:00:00+03:00");

export default function InvitationEntrance({
  guestName,
}: InvitationEntranceProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const seconds = Math.max(
    0,
    Math.floor((weddingDate.getTime() - now.getTime()) / 1000),
  );

  const values = [
    [Math.floor(seconds / 86400), "Days"],
    [Math.floor((seconds % 86400) / 3600), "Hours"],
    [Math.floor((seconds % 3600) / 60), "Minutes"],
    [seconds % 60, "Seconds"],
  ];

  return (
    <div
      className={styles.heroInvitation}
      aria-label={`Wedding invitation for ${guestName}`}
    >
      {/* =====================================================
          LEFT / TOP CONTENT
      ===================================================== */}
      <div className={styles.copy}>
        <div className={styles.opening}>
          <img
            className={styles.cross}
            src="https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/ornament/cross1.jpg?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvb3JuYW1lbnQvY3Jvc3MxLmpwZyIsInNjb3BlIjoiZG93bmxvYWQiLCJpYXQiOjE3ODg0MjYzMTQsImV4cCI6MTc5MTAxODMxNH0.HH5gLWxigFnOdudyPAe5CV3ojbdG_U94iwwL5mz2VSk"
            alt=""
            aria-hidden="true"
          />

          <p className={styles.scripture}>
            &ldquo;The Lord has done great things for us,
            <br />
            and we are filled with joy.&rdquo;
            <span>&mdash; Psalm 126:3</span>
          </p>
        </div>

        <div className={styles.details}>
          {/* <p className={styles.greeting}>Together with their families</p> */}

          <h1>
            Feven <span>&amp;</span> Abenezer
          </h1>

          <SectionDivider className={styles.divider} maxWidth="280px" />

          <p className={styles.date}>September 13, 2026</p>

          <p className={styles.heart}>&hearts;</p>

          {/* =================================================
              COUNTDOWN
              Now directly below the date.
          ================================================= */}
          <div
            className={styles.countdown}
            aria-label="Countdown to the wedding"
          >
            {values.map(([value, label]) => (
              <div key={String(label)}>
                <strong>{String(value).padStart(2, "0")}</strong>

                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* <p className={styles.personalGreeting}>
            We would be honored to celebrate this beautiful day with you.
          </p> */}
        </div>
      </div>

      {/* =====================================================
          COUPLE PHOTO
      ===================================================== */}
      <div className={styles.portrait}>
        <CoupleArchFrame
          className={styles.arch}
          imageSrc="https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/couple/front1.jpg?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvY291cGxlL2Zyb250MS5qcGciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg4NDE5NDIzLCJleHAiOjE3OTEwMTE0MjN9.F7WmjAXpU7w8DTL3SyPWZ69lhx70jOIic7ZZ4w7t484"
          alt="Feven and Abenezer"
        />
      </div>

      <p className={styles.mobileHeart} aria-hidden="true">
        &hearts;
      </p>

      {/* The mobile layout places the countdown after the portrait so it
          remains readable above the bottom ornament. */}
      <div
        className={`${styles.countdown} ${styles.mobileCountdown}`}
        aria-label="Countdown to the wedding"
      >
        {values.map(([value, label]) => (
          <div key={`mobile-${String(label)}`}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.mobileGoldBand} aria-hidden="true" />

      <ScrollIndicator />

      <HeroOrnaments />
    </div>
  );
}
