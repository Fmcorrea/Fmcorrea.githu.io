"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface GameCardProps {
  imageSrc: string;
  label: string; // Usado apenas para acessibilidade (alt text)
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
        "relative group overflow-hidden rounded-[2rem] border-[6px] transition-all duration-300 transform hover:scale-105 active:scale-95",
        "bg-white shadow-xl aspect-square flex flex-col items-center justify-center p-2",
        isSelected ? "border-blue-400" : "border-white",
        isCorrect && "border-green-500 ring-8 ring-green-200",
        isWrong && "border-red-500 ring-8 ring-red-200 opacity-70",
        !disabled && "hover:shadow-2xl"
      )}
    >
      <div className="w-full h-full overflow-hidden rounded-2xl">
        <img 
          src={imageSrc} 
          alt={label} 
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>
      
      {/* Removido o texto que identificava a resposta */}
      
      {isCorrect && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/10 pointer-events-none">
          <span className="text-7xl animate-bounce">🌟</span>
        </div>
      )}
    </button>
  );
};

export default GameCard;