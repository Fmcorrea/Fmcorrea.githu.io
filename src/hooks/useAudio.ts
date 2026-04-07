"use client";

import { useRef, useEffect, useState } from 'react';

export const useAudio = () => {
  const bgMusic = useRef<HTMLAudioElement | null>(null);
  const successSound = useRef<HTMLAudioElement | null>(null);
  const errorSound = useRef<HTMLAudioElement | null>(null);
  const victorySound = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const initAudio = (url: string, volume = 1, loop = false) => {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.loop = loop;
      // Evita que erros de carregamento quebrem a aplicação
      audio.addEventListener('error', (e) => {
        console.warn("Não foi possível carregar o áudio:", url, e);
      });
      return audio;
    };

    // Links atualizados e mais estáveis
    bgMusic.current = initAudio("https://assets.mixkit.co/music/preview/mixkit-games-world-606.mp3", 0.3, true);
    successSound.current = initAudio("https://assets.mixkit.co/sfx/preview/mixkit-winning-chime-2015.mp3", 0.5);
    errorSound.current = initAudio("https://assets.mixkit.co/sfx/preview/mixkit-falling-hit-on-slender-wood-744.mp3", 0.4);
    victorySound.current = initAudio("https://assets.mixkit.co/sfx/preview/mixkit-stadium-crowd-light-applause-524.mp3", 0.6);

    return () => {
      if (bgMusic.current) {
        bgMusic.current.pause();
        bgMusic.current.src = "";
      }
    };
  }, []);

  const playBg = () => {
    if (!isMuted && bgMusic.current && bgMusic.current.readyState >= 2) {
      bgMusic.current.play().catch(() => {});
    }
  };

  const playSuccess = () => {
    if (!isMuted && successSound.current && successSound.current.readyState >= 2) {
      successSound.current.currentTime = 0;
      successSound.current.play().catch(() => {});
    }
  };

  const playError = () => {
    if (!isMuted && errorSound.current && errorSound.current.readyState >= 2) {
      errorSound.current.currentTime = 0;
      errorSound.current.play().catch(() => {});
    }
  };

  const playVictory = () => {
    if (!isMuted && victorySound.current && victorySound.current.readyState >= 2) {
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
      playBg();
    }
  };

  return { playBg, playSuccess, playError, playVictory, toggleMute, isMuted };
};