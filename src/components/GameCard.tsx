"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface GameCardProps {
  imageSrc: string;
  label: string;
  onClick: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  disabled?: boolean;
}

const GameCard = ({ 
  imageSrc, 
  label, 
  onClick, 
  isSelected, 
  isCorrect, 
  isWrong,
  disabled 
}: GameCardProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative group overflow-hidden rounded-3xl border-8 transition-all duration-300 transform hover:scale-105 active:scale-95",
        "bg-white shadow-xl",
        isSelected ? "border-blue-400" : "border-white",
        isCorrect && "border-green-500 ring-8 ring-green-200",
        isWrong && "border-red-500 ring-8 ring-red-200 opacity-70",
        !disabled && "hover:shadow-2xl"
      )}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={imageSrc} 
          alt={label} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className={cn(
        "p-4 text-center font-bold text-2xl uppercase tracking-wider",
        isCorrect ? "text-green-600" : isWrong ? "text-red-600" : "text-slate-700"
      )}>
        {label}
      </div>
      
      {isCorrect && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 pointer-events-none">
          <span className="text-6xl">🌟</span>
        </div>
      )}
    </button>
  );
};

export default GameCard;