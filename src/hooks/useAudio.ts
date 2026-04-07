"use client";

import { useRef, useEffect, useState } from 'react';

export const useAudio = () => {
  const bgMusic = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const victorySound = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Inicialização simples
    bgMusic.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"); // Link alternativo estável
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.2;

    successSound.current = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg");
    errorSound.current = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flick.ogg");
    victorySound.current = new Audio("https://actions.google.com/sounds/v1/human_voices/applause_clapping_and_cheering.ogg");

    return () => {
      bgMusic.current?.pause();
      bgMusic.current = null;
    };
  }, []);

  const playBg = () => {
    if (!isMuted && bgMusic.current) {
      bgMusic.current.play().catch(() => {
        console.log("Aguardando interação para tocar música.");
      });
    }
  };

  const playSuccess = () => {
    if (!isMuted && successSound.current) {
      successSound.current.currentTime = 0;
      successSound.current.play().catch(() => {});
    }
  };

  const playError = () => {
    if (!isMuted && errorSound.current) {
      errorSound.current.currentTime = 0;
      errorSound.current.play().catch(() => {});
    }
  };

  const playVictory = () => {
    if (!isMuted && victorySound.current) {
      bgMusic.current?.pause();
      victorySound.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      bgMusic.current?.pause();
    } else {
      bgMusic.current?.play().catch(() => {});
    }
  };

  return { playBg, playSuccess, playError, playVictory, toggleMute, isMuted };
};