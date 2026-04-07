"use client";

import React, { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import DraggableWord from '@/components/DraggableWord';
import ImageDropZone from '@/components/ImageDropZone';
import GameHeader from '@/components/GameHeader';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { Sparkles, RefreshCcw, Trophy } from 'lucide-react';

const LEVELS = [
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
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/88888888888888888888888888888888.png" 
      },
      { 
        word: "TRISTE", 
        targetId: "triste", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/99999999999999999999999999999999.png" 
      }
    ]
  }
];

const Index = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [assignments, setAssignments] = useState<Record<string, string | null>>({});
  const [dropZones, setDropZones] = useState<Record<string, DOMRect>>({});
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [score, setScore] = useState(0);

  const currentLevel = LEVELS[currentLevelIdx];

  const handleMeasure = useCallback((id: string, rect: DOMRect) => {
    setDropZones(prev => ({ ...prev, [id]: rect }));
  }, []);

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
          showSuccess(`Muito bem!`);
          
          if (Object.keys(newAssignments).length === currentLevel.pairs.length) {
            setScore(prev => prev + 20);
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 }
            });
            
            setTimeout(() => {
              if (currentLevelIdx < LEVELS.length - 1) {
                setCurrentLevelIdx(prev => prev + 1);
                setAssignments({});
                setDropZones({});
              } else {
                setGameState('finished');
              }
            }, 2000);
          }
        }
      } else {
        showError("Ups! Tenta outra vez!");
      }
    }
  };

  const resetGame = () => {
    setCurrentLevelIdx(0);
    setAssignments({});
    setGameState('playing');
    setScore(0);
    setDropZones({});
  };

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

  return (
    <div className="min-h-screen bg-sky-50 py-8 px-4 flex flex-col items-center overflow-hidden">
      <div className="max-w-4xl w-full">
        <GameHeader 
          currentLevel={currentLevelIdx + 1} 
          totalLevels={LEVELS.length} 
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
          {currentLevel.pairs.map((pair) => (
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
          {currentLevel.pairs.map((pair) => (
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