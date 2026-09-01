"use client";

import { useEffect } from "react";
import { useWeddingMusic } from "../../hooks/useWeddingMusic";
import styles from "./WeddingMusic.module.css";

export default function WeddingMusic() {
  const { isPlaying, isMuted, toggleMute, play } = useWeddingMusic({
    src: "/music/Yehen_Laderege.ogg",
    volume: 0.35,
  });

  /**
   * Start the music when the guest begins interacting
   * with the invitation.
   *
   * We listen to several interaction types because
   * desktop and mobile browsers behave differently.
   */
  useEffect(() => {
    let hasStarted = false;
    let isStarting = false;

    const removeListeners = () => {
      window.removeEventListener("scroll", startMusic);
      window.removeEventListener("wheel", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
    };

    const startMusic = () => {
      if (hasStarted || isStarting) {
        return;
      }

      isStarting = true;

      void play().then((didStart) => {
        isStarting = false;
        if (didStart) {
          hasStarted = true;
          removeListeners();
        }
      });
    };

    // wheel/touchstart happen before a corresponding scroll, so they retain
    // the user gesture browsers require for audible playback.
    window.addEventListener("scroll", startMusic, { passive: true });
    window.addEventListener("wheel", startMusic, { passive: true });
    window.addEventListener("touchstart", startMusic, { passive: true });
    window.addEventListener("pointerdown", startMusic, { passive: true });
    window.addEventListener("keydown", startMusic);

    return () => {
      removeListeners();
    };
  }, [play]);

  return (
    <button
      type="button"
      className={styles.musicButton}
      onClick={toggleMute}
      aria-label={isMuted ? "Turn wedding music on" : "Mute wedding music"}
    >
      <span className={styles.icon}>{isMuted ? "🔇" : "♪"}</span>

      <span className={styles.text}>
        {isPlaying ? (isMuted ? "Music Off" : "Playing") : "Play Music"}
      </span>
    </button>
  );
}
