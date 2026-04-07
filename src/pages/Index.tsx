"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import DraggableWord from '@/components/DraggableWord';
import ImageDropZone from '@/components/ImageDropZone';
import GameHeader from '@/components/GameHeader';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { Sparkles, RefreshCcw, Trophy, Volume2, VolumeX, Play } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';

const LEVELS_DATA = [
  {
    id: 1,
    question: "Arrasta as palavras para os copos certos!",
    pairs: [
      { 
        word: "VAZIO", 
        targetId: "vazio", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/5e4ec9e7d27791fba3d61f4f40d0c60e.png" 
      },
      { 
        word: "CHEIO", 
        targetId: "cheio", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/590251b5c6986ab4865abfb4c63fdfae.png" 
      }
    ]
  },
  {
    id: 2,
    question: "Quem é a nova e quem é a velha?",
    pairs: [
      { 
        word: "NOVA", 
        targetId: "nova", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/b0128978a4ef2a7590550cb78a328b60.png" 
      },
      { 
        word: "VELHA", 
        targetId: "velha", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/cbaa12aba022b90c8b66795905b21f56.png" 
      }
    ]
  },
  {
    id: 3,
    question: "Como se sente a Alice?",
    pairs: [
      { 
        word: "FELIZ", 
        targetId: "feliz", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/852057a7f5032217a65416b23a13fb5a.png" 
      },
      { 
        word: "TRISTE", 
        targetId: "triste", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/815fabbf4652e02b3e1faa9942d1f7e8.png" 
      }
    ]
  },
  {
    id: 4,
    question: "Quem está perto e quem está longe?",
    pairs: [
      { 
        word: "PERTO", 
        targetId: "perto", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/1bc9efbbed2c06befd6e3f329ed06351.jpg" 
      },
      { 
        word: "LONGE", 
        targetId: "longe", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/73c3f0dd092aff084297b40f75916966.jpg" 
      }
    ]
  },
  {
    id: 5,
    question: "Quem é alto e quem é baixo?",
    pairs: [
      { 
        word: "ALTO", 
        targetId: "alto", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/eff9cb527b4e1656978a87de07b532e7.jpg" 
      },
      { 
        word: "BAIXO", 
        targetId: "baixo", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/a23e62200473fe4f153a140fb61903b6.jpg" 
      }
    ]
  },
  {
    id: 6,
    question: "Qual é o cabelo longo e qual é o curto?",
    pairs: [
      { 
        word: "LONGO", 
        targetId: "longo", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/0bec8a1d9fa5134f97e87c5d7ab1cfa7.jpg" 
      },
      { 
        word: "CURTO", 
        targetId: "curto", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/a46acbb4dd59329cbf618885284ec168.jpg" 
      }
    ]
  },
  {
    id: 7,
    question: "O livro está aberto ou fechado?",
    pairs: [
      { 
        word: "ABERTO", 
        targetId: "aberto", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/8160c2b71e429b18d52d2c32fbd7795c.jpg" 
      },
      { 
        word: "FECHADO", 
        targetId: "fechado", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/ae9bd54b20ea44966cfe039d434b5503.jpg" 
      }
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
  const { playBg, playSuccess, playError, playVictory, toggleMute, isMuted } = useAudio();
  const [shuffledLevels, setShuffledLevels] = useState<typeof LEVELS_DATA>([]);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, string | null>>({});
  const [dropZones, setDropZones] = useState<Record<string, DOMRect>>({});
  const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
  const [score, setScore] = useState(0);

  useEffect(() => {
    setShuffledLevels(shuffle(LEVELS_DATA));
  }, []);

  const currentLevel = shuffledLevels[currentLevelIdx];

  const displayPairs = useMemo(() => {
    if (!currentLevel) return [];
    return shuffle(currentLevel.pairs);
  }, [currentLevel]);

  const wordPairs = useMemo(() => {
    if (!currentLevel) return [];
    return shuffle(currentLevel.pairs);
  }, [currentLevel]);

  const handleMeasure = useCallback((id: string, rect: DOMRect) => {
    setDropZones(prev => ({ ...prev, [id]: rect }));
  }, []);

  const startGame = () => {
    setGameState('playing');
    playBg();
  };

  const handleDragEnd = (word: string, info: any) => {
    const dropPoint = { x: info.point.x, y: info.point.y };
    
    let foundTarget = null;
    for (const [id, rect] of Object.entries(dropZones)) {
      if (
        dropPoint.x >= rect.left && 
        dropPoint.x <= rect.right && 
        dropPoint.y >= rect.top && 
        dropPoint.y <= rect.bottom
      ) {
        foundTarget = id;
        break;
      }
    }

    if (foundTarget) {
      const pair = currentLevel.pairs.find(p => p.targetId === foundTarget);
      if (pair && pair.word === word) {
        if (!assignments[word]) {
          const newAssignments = { ...assignments, [word]: foundTarget };
          setAssignments(newAssignments);
          playSuccess();
          showSuccess(`Muito bem!`);
          
          if (Object.keys(newAssignments).length === currentLevel.pairs.length) {
            setScore(prev => prev + 20);
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
            
            setTimeout(() => {
              if (currentLevelIdx < shuffledLevels.length - 1) {
                setCurrentLevelIdx(prev => prev + 1);
                setAssignments({});
                setDropZones({});
              } else {
                playVictory();
                setGameState('finished');
              }
            }, 2000);
          }
        }
      } else {
        playError();
        showError("Ups! Tenta outra vez!");
      }
    }
  };

  const resetGame = () => {
    setShuffledLevels(shuffle(LEVELS_DATA));
    setCurrentLevelIdx(0);
    setAssignments({});
    setGameState('playing');
    setScore(0);
    setDropZones({});
    playBg();
  };

  if (gameState === 'start') {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border-8 border-blue-400 max-w-md w-full animate-in zoom-in duration-500">
          <Sparkles className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-4xl font-black text-slate-800 mb-4">Jogo dos Opostos</h1>
          <p className="text-xl text-slate-600 mb-8 font-bold">Estás pronto para aprender a brincar?</p>
          <Button 
            onClick={startGame}
            className="w-full py-8 text-2xl font-black rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg"
          >
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
          <Button 
            onClick={resetGame}
            className="w-full py-8 text-2xl font-black rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg"
          >
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
        <button 
          onClick={toggleMute}
          className="absolute -top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors z-50 border-2 border-slate-100"
        >
          {isMuted ? <VolumeX className="text-slate-400" /> : <Volume2 className="text-blue-500" />}
        </button>

        <GameHeader 
          currentLevel={currentLevelIdx + 1} 
          totalLevels={shuffledLevels.length} 
          score={score} 
        />

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2 flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400" />
            {currentLevel.question}
          </h2>
          <p className="text-slate-500 font-bold">Arrasta as palavras coloridas para as imagens!</p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-12 max-w-3xl mx-auto mb-12">
          {displayPairs.map((pair) => (
            <ImageDropZone
              key={`${currentLevel.id}-${pair.targetId}`}
              id={pair.targetId}
              imageSrc={pair.image}
              onMeasure={handleMeasure}
              isCorrect={!!assignments[pair.word]}
              assignedWord={assignments[pair.word] ? pair.word : null}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {wordPairs.map((pair) => (
            <DraggableWord
              key={`${currentLevel.id}-${pair.word}`}
              id={pair.word}
              text={pair.word}
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