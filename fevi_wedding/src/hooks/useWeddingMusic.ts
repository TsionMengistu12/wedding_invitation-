"use client";
import {useCallback, useEffect, useRef, useState} from "react";

interface UseWeddingMusicOptions {
  src: string;
  volume?: number;
}

interface UseWeddingMusicReturn {
  isPlaying: boolean;
  isMuted: boolean;
  play: () => Promise<boolean>;
  pause: () => void;
  toggleMute: () => Promise<void>;
}
/**
 * Controls the wedding invitation background music.
 *
 * The hook:
 * - creates the audio element
 * - waits for the guest's first interaction
 * - allows the music to start when scrolling begins
 * - keeps the music looping
 * - provides play/pause/mute controls
 */
export function useWeddingMusic({
  src,
  volume = 0.35,
}: UseWeddingMusicOptions): UseWeddingMusicReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  /**
   * Create the audio object once.
   */
  useEffect(() => {
    const audio = new Audio(src);

    audio.loop = true;
    audio.volume = volume;
    audio.preload = "auto";

    audioRef.current = audio;

    /**
     * Keep React's state synchronized with the audio element.
     */
    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();

      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);

      audioRef.current = null;
    };
  }, [src, volume]);

  /**
   * Start the music.
   *
   * play() returns a Promise because the browser may reject
   * playback if its autoplay policy doesn't allow it.
   */
  const play = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current;

    if (!audio) {
      return false;
    }

    try {
      await audio.play();
      return true;
    } catch (error) {
      console.log("Browser blocked automatic music playback.", error);
      return false;
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggleMute = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    // Before the first scroll, the bottom control acts as an explicit play
    // button. Once playback has started it becomes the expected mute control.
    if (audio.paused) {
      audio.muted = false;
      setIsMuted(false);
      await play();
      return;
    }

    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);

    if (!nextMuted && audio.paused) {
      await play();
    }
  }, [play]);

  return {
    isPlaying,
    isMuted,
    play,
    pause,
    toggleMute,
  };
}
