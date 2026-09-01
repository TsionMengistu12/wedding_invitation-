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
      if (!started)
        void play().then((ok) => {
          started = ok;
        });
    };
    window.addEventListener("pointerdown", start, { passive: true });
    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("wheel", start, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("touchstart", start);
      window.removeEventListener("wheel", start);
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
