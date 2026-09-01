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
      /**
       * The browser blocked playback.
       *
       * We intentionally don't throw the error because this
       * shouldn't break the wedding invitation.
       */
      console.log("Browser blocked automatic music playback.", error);
      return false;
    }
  }, []);

  /**
   * Pause the music.
   */
  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  /**
   * Toggle mute without stopping the song.
   */
  const toggleMute = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.muted) {
      audio.muted = false;
      setIsMuted(false);

      /*
       * If the song wasn't playing, try to start it.
       */
      if (audio.paused) {
        await play();
      }
    } else {
      audio.muted = true;
      setIsMuted(true);
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
