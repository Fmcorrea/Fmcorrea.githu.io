"use client";

import { useRef, useEffect, useState } from 'react';

export const useAudio = () => {
  const bgMusic = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const victorySound = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Música de fundo estilo "joguinho simples"
    bgMusic.current = new Audio("https://cdn.pixabay.com/audio/2021/11/23/audio_0998a81308.mp3");
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.2;

    successSound.current = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3");
    errorSound.current = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_c8c8a73484.mp3");
    victorySound.current = new Audio("https://cdn.pixabay.com/audio/2021/08/04/audio_bb630a0517.mp3");

    return () => {
      bgMusic.current?.pause();
    };
  }, []);

  const playBg = () => {
    if (!isMuted) bgMusic.current?.play().catch(() => {});
  };

  const playSuccess = () => {
    if (!isMuted) {
      successSound.current!.currentTime = 0;
      successSound.current?.play();
    }
  };

  const playError = () => {
    if (!isMuted) {
      errorSound.current!.currentTime = 0;
      errorSound.current?.play();
    }
  };

  const playVictory = () => {
    if (!isMuted) {
      bgMusic.current?.pause();
      victorySound.current?.play();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      bgMusic.current?.pause();
    } else {
      bgMusic.current?.play().catch(() => {});
    }
  };

  return { playBg, playSuccess, playError, playVictory, toggleMute, isMuted };
};