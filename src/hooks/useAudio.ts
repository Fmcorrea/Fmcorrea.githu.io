"use client";

import { useRef, useEffect, useState, useCallback } from 'react';

export const useAudio = () => {
  const bgMusic = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const victorySound = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    bgMusic.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3");
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.15;

    successSound.current = new Audio("https://actions.google.com/sounds/v1/cartoon/pop.ogg");
    errorSound.current = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flick.ogg");
    victorySound.current = new Audio("https://actions.google.com/sounds/v1/human_voices/applause_clapping_and_cheering.ogg");

    return () => {
      if (bgMusic.current) {
        bgMusic.current.pause();
        bgMusic.current = null;
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (isMuted || !window.speechSynthesis) return;

    // Cancela qualquer narração em curso para não sobrepor
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT';
    utterance.rate = 0.9; // Um pouco mais lento para ser claro para crianças
    utterance.pitch = 1.1; // Tom ligeiramente mais agudo e amigável

    // Tenta encontrar especificamente uma voz de Portugal
    const voices = window.speechSynthesis.getVoices();
    const ptPTVoice = voices.find(v => v.lang === 'pt-PT' || v.lang === 'pt_PT');
    if (ptPTVoice) {
      utterance.voice = ptPTVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  const playBg = () => {
    if (!isMuted && bgMusic.current) {
      bgMusic.current.play().catch(() => {});
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
      window.speechSynthesis.cancel();
    } else {
      bgMusic.current?.play().catch(() => {});
    }
  };

  return { playBg, playSuccess, playError, playVictory, toggleMute, isMuted, speak };
};