"use client";

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import GameCard from '@/components/GameCard';
import GameHeader from '@/components/GameHeader';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';
import { Sparkles, RefreshCcw, Trophy } from 'lucide-react';

// Definição dos níveis do jogo com as imagens enviadas
const LEVELS = [
  {
    id: 1,
    question: "Qual copo está CHEIO?",
    correctAnswer: "cheio",
    options: [
      { 
        id: "vazio", 
        label: "Vazio", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/5e4ec9e7d27791fba3d61f4f40d0c60e.png" 
      },
      { 
        id: "cheio", 
        label: "Cheio", 
        image: "dyad-media://media/peaceful-shiba-flip/.dyad/media/590251b5c6986ab4865abfb4c63fdfae.png" 
      }
    ]
  }
];

const Index = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'wrong' | 'finished'>('playing');
  const [score, setScore] = useState(0);

  const currentLevel = LEVELS[currentLevelIdx];

  const handleOptionClick = (optionId: string) => {
    if (gameState !== 'playing') return;

    setSelectedId(optionId);
    
    if (optionId === currentLevel.correctAnswer) {
      setGameState('correct');
      setScore(prev => prev + 10);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#60A5FA', '#A78BFA', '#F472B6', '#FBBF24']
      });
      showSuccess("Muito bem! Você acertou!");
    } else {
      setGameState('wrong');
      showError("Ops! Tente de novo!");
      setTimeout(() => {
        setGameState('playing');
        setSelectedId(null);
      }, 1500);
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setSelectedId(null);
      setGameState('playing');
    } else {
      setGameState('finished');
    }
  };

  const resetGame = () => {
    setCurrentLevelIdx(0);
    setSelectedId(null);
    setGameState('playing');
    setScore(0);
  };

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl border-8 border-yellow-400 max-w-md w-full animate-in zoom-in duration-500">
          <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-5xl font-black text-slate-800 mb-4">PARABÉNS!</h1>
          <p className="text-2xl text-slate-600 mb-8 font-bold">Você completou todos os desafios!</p>
          <div className="text-4xl font-black text-blue-600 mb-8">Pontos: {score}</div>
          <Button 
            onClick={resetGame}
            className="w-full py-8 text-2xl font-black rounded-2xl bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all"
          >
            <RefreshCcw className="mr-3" /> JOGAR DE NOVO
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <GameHeader 
          currentLevel={currentLevelIdx + 1} 
          totalLevels={LEVELS.length} 
          score={score} 
        />

        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-yellow-400" />
            {currentLevel.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {currentLevel.options.map((option) => (
            <GameCard
              key={option.id}
              imageSrc={option.image}
              label={option.label}
              onClick={() => handleOptionClick(option.id)}
              isSelected={selectedId === option.id}
              isCorrect={gameState === 'correct' && option.id === currentLevel.correctAnswer}
              isWrong={gameState === 'wrong' && option.id === selectedId}
              disabled={gameState !== 'playing'}
            />
          ))}
        </div>

        {gameState === 'correct' && (
          <div className="mt-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Button 
              onClick={nextLevel}
              className="px-12 py-8 text-2xl font-black rounded-2xl bg-green-500 hover:bg-green-600 shadow-xl hover:scale-105 transition-all"
            >
              PRÓXIMO DESAFIO ➔
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;