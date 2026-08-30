"use client";

import { useEffect } from "react";
import { useWeddingMusic } from "@/hooks/useWeddingMusic.ts";
import styles from "./WeddingMusic.module.css";

export default function WeddingMusic() {
  const { isPlaying, isMuted, toggleMute, play } = useWeddingMusic({
    src: "/music/wedding-song.mp3",
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

    const startMusic = async () => {
      if (hasStarted) {
        return;
      }

      hasStarted = true;

      await play();

      /**
       * Once the first interaction has happened,
       * we no longer need these listeners.
       */
      window.removeEventListener("scroll", startMusic);
      window.removeEventListener("wheel", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("pointerdown", startMusic);
    };

    window.addEventListener("scroll", startMusic, {
      passive: true,
      once: true,
    });

    window.addEventListener("wheel", startMusic, {
      passive: true,
      once: true,
    });

    window.addEventListener("touchstart", startMusic, {
      passive: true,
      once: true,
    });

    window.addEventListener("pointerdown", startMusic, {
      passive: true,
      once: true,
    });

    return () => {
      window.removeEventListener("scroll", startMusic);
      window.removeEventListener("wheel", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("pointerdown", startMusic);
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
