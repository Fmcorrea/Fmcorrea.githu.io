"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface GameHeaderProps {
  currentLevel: number;
  totalLevels: number;
  score: number;
}

const GameHeader = ({ currentLevel, totalLevels, score }: GameHeaderProps) => {
  const progress = (currentLevel / totalLevels) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full shadow-md">
          <Star className="text-white fill-white" size={24} />
          <span className="font-black text-white text-xl">{score}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-500 font-bold text-sm uppercase">Nível</span>
          <div className="text-3xl font-black text-blue-600">{currentLevel} / {totalLevels}</div>
        </div>
      </div>
      <div className="h-6 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner border-4 border-white">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default GameHeader;