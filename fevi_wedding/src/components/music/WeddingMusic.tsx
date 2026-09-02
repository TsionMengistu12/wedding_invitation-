"use client";
import { useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { useWeddingMusic } from "../../hooks/useWeddingMusic";
import styles from "./WeddingMusic.module.css";
export default function WeddingMusic() {
  const { isPlaying, isMuted, toggleMute, play } = useWeddingMusic({
    src: "https://ovkrkjdlqqxaqyjcsjtz.supabase.co/storage/v1/object/sign/fevi_wedding_media/music/Yhen_Laderege.mp3?token=eyJraWQiOiI4ZTg0OTI1MC03MzAyLTQ4OTYtYjgwNS1iZWU3ZTdlNTJkNjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmZXZpX3dlZGRpbmdfbWVkaWEvbXVzaWMvWWhlbl9MYWRlcmVnZS5tcDMiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg4MjU0MDg5LCJleHAiOjE4MDM4MDYwODl9.otZzHeAuNkI0WYCNWlDeakkSpLRrcTRmjhrXR2xmDSU",
    volume: 0.35,
  });
  useEffect(() => {
    let started = false;

    const start = () => {
      if (started) {
        return;
      }

      void play().then((didStart) => {
        started = didStart;
      });
    };

    // Do not start on a tap or page load. The first deliberate scroll gesture
    // is both respectful to the guest and accepted by mobile audio policies.
    window.addEventListener("wheel", start, { passive: true });
    window.addEventListener("touchmove", start, { passive: true });

    return () => {
      window.removeEventListener("wheel", start);
      window.removeEventListener("touchmove", start);
    };
  }, [play]);
  const label = isMuted
    ? "Turn music on"
    : isPlaying
      ? "Mute music"
      : "Play music";
  return (
    <button
      type="button"
      className={styles.musicButton}
      onClick={toggleMute}
      aria-label={label}
      title={label}
    >
      {isMuted ? <VolumeX /> : isPlaying ? <Volume2 /> : <Play />}
    </button>
  );
}
