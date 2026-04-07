"use client";

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import DraggableWord from '@/components/DraggableWord';
import ImageDropZone from '@/components/ImageDropZone';
import GameHeader from '@/components/GameHeader';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { Sparkles, RefreshCcw, Trophy, Volume2, VolumeX, Play, Loader2 } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { getSupabaseUrl } from '@/lib/utils';

// Imagens de alta qualidade para o jogo funcionar imediatamente
const LEVELS_DATA = [
  {
    id: 1,
    question: "Vazio ou Cheio?",
    pairs: [
      { word: "VAZIO", targetId: "vazio", image: "vazio.jpeg" },
      { word: "CHEIO", targetId: "cheio", image: "cheio.jpeg
" }
    ]
  },
  {
    id: 2,
    question: "Nova ou Velha?",
    pairs: [
      { word: "NOVA", targetId: "nova", image: "Branca de neve.png" },
      { word: "VELHA", targetId: "velha", image: "Bruxa.png" }
    ]
  },
  {
    id: 3,
    question: "Feliz ou Triste?",
    pairs: [
      { word: "FELIZ", targetId: "feliz", image: "Alice feliz.png" },
      { word: "TRISTE", targetId: "triste", image: "triste.jpeg" }
    ]
  },
  {
    id: 4,
    question: "Perto ou Longe?",
    pairs: [
      { word: "PERTO", targetId: "perto", image: "cinderela perto.jpg" },
      { word: "LONGE", targetId: "longe", image: "aurora longe.jpg" }
    ]
  },
  {
    id: 5,
    question: "Alto ou Baixo?",
    pairs: [
      { word: "ALTO", targetId: "alto", image: "alto.jpeg" },
      { word: "BAIXO", targetId: "baixo", image: "baixo.jpeg" }
    ]
  },
  {
    id: 6,
    question: "Longo ou Curto?",
    pairs: [
      { word: "LONGO", targetId: "longo", image: "longo.jpeg" },
      { word: "CURTO", targetId: "curto", image: "curto.jpeg" }
    ]
  },
  {
    id: 7,
    question: "Aberto ou Fechado?",
    pairs: [
      { word: "ABERTO", targetId: "aberto", image: "livro aberto.jpg" },
      { word: "FECHADO", targetId: "fechado", image: "livro fechado.jpg" }
    ]
  }
];

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Index = () => {
  const { playBg, playSuccess, playError, playVictory, toggleMute, isMuted, speak } = useAudio();
  const [shuffledLevels, setShuffledLevels] = useState<typeof LEVELS_DATA>([]);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, string | null>>({});
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);

  useEffect(() => {
    setShuffledLevels(shuffle(LEVELS_DATA));
  }, []);

  const currentLevel = shuffledLevels[currentLevelIdx];

  const displayPairs = useMemo(() => {
    if (!currentLevel) return [];
    return shuffle(currentLevel.pairs).map(p => ({
      ...p,
      image: getSupabaseUrl(p.image)
    }));
  }, [currentLevel]);

  const wordPairs = useMemo(() => {
    if (!currentLevel) return [];
    return shuffle(currentLevel.pairs);
  }, [currentLevel]);

  const startGame = () => {
    setGameState('playing');
    playBg();
  };

  const handleDragEnd = (word: string, info: any) => {
    // Usamos elementsFromPoint para obter TODOS os elementos sob o cursor
    // Isto permite-nos ignorar o cartão que estamos a arrastar e encontrar a zona de drop por baixo
    const elements = document.elementsFromPoint(info.point.x, info.point.y);
    
    // Procuramos o primeiro elemento que tenha o atributo data-target-id
    let foundTargetId: string | null = null;
    for (const el of elements) {
      const target = el.closest('[data-target-id]');
      if (target) {
        foundTargetId = target.getAttribute('data-target-id');
        break;
      }
    }

    if (foundTargetId) {
      const pair = currentLevel.pairs.find(p => p.targetId === foundTargetId);
      
      if (pair && pair.word === word) {
        if (!assignments[word]) {
          const newAssignments = { ...assignments, [word]: foundTargetId };
          setAssignments(newAssignments);
          playSuccess();
          showSuccess(`Muito bem!`);
          
          if (Object.keys(newAssignments).length === currentLevel.pairs.length) {
            setScore(prev => prev + 20);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            
            setTimeout(() => {
              if (currentLevelIdx < shuffledLevels.length - 1) {
                setCurrentLevelIdx(prev => prev + 1);
                setAssignments({});
              } else {
                playVictory();
                setGameState('finished');
              }
            }, 1500);
          }
        }
      } else {
        playError();
        showError("Ups! Tenta outra vez!");
      }
    }
  };

  if (shuffledLevels.length === 0) {
    return (
      <div className="min-h-screen bg-sky-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border-8 border-blue-400 max-w-md w-full animate-in zoom-in duration-500">
          <Sparkles className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-slate-800 mb-4">Jogo dos Opostos</h1>
          <p className="text-xl text-slate-600 mb-8 font-bold">Estás pronto para aprender a brincar?</p>
          <Button onClick={startGame} className="w-full py-8 text-2xl font-black rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg">
            <Play className="mr-3 fill-current" /> COMEÇAR
          </Button>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border-8 border-yellow-400 max-w-md w-full animate-in zoom-in duration-500">
          <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-5xl font-black text-slate-800 mb-4">UAU!</h1>
          <p className="text-2xl text-slate-600 mb-8 font-bold">Estás de parabéns!</p>
          <div className="text-4xl font-black text-blue-600 mb-8">Pontos: {score}</div>
          <Button onClick={() => window.location.reload()} className="w-full py-8 text-2xl font-black rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg">
            <RefreshCcw className="mr-3" /> JOGAR OUTRA VEZ
          </Button>
        </div>
      </div>
    );
  }

  if (!currentLevel) return null;

  return (
    <div className="min-h-screen bg-sky-50 py-8 px-4 flex flex-col items-center overflow-hidden">
      <div className="max-w-4xl w-full relative">
        <button onClick={toggleMute} className="absolute -top-4 right-4 p-3 bg-white rounded-full shadow-md z-50 border-2 border-slate-100">
          {isMuted ? <VolumeX className="text-slate-400" /> : <Volume2 className="text-blue-500" />}
        </button>

        <GameHeader currentLevel={currentLevelIdx + 1} totalLevels={shuffledLevels.length} score={score} />

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">{currentLevel.question}</h2>
          <p className="text-slate-500 font-bold">Arrasta as palavras para as imagens!</p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-12 max-w-3xl mx-auto mb-12">
          {displayPairs.map((pair) => (
            <ImageDropZone
              key={`${currentLevel.id}-${pair.targetId}`}
              id={pair.targetId}
              imageSrc={pair.image}
              isCorrect={Object.values(assignments).includes(pair.targetId)}
              assignedWord={Object.keys(assignments).find(key => assignments[key] === pair.targetId)}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {wordPairs.map((pair) => (
            <DraggableWord
              key={`${currentLevel.id}-${pair.word}`}
              id={pair.word}
              text={pair.word}
              onDragStart={() => speak(pair.word)}
              onDragEnd={handleDragEnd}
              disabled={!!assignments[pair.word]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;