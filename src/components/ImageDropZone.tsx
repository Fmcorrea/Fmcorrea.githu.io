"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface ImageDropZoneProps {
  id: string;
  imageSrc: string;
  isCorrect?: boolean;
  assignedWord?: string | null;
}

const ImageDropZone = ({ id, imageSrc, isCorrect, assignedWord }: ImageDropZoneProps) => {
  return (
    <div 
      // O atributo data-target-id é essencial para a detecção do drop no Index.tsx
      data-target-id={id}
      className={cn(
        "relative w-full aspect-square bg-white rounded-[2.5rem] border-8 transition-all duration-300 flex flex-col items-center justify-center p-4 shadow-xl",
        isCorrect ? "border-green-500 ring-8 ring-green-100 scale-105" : "border-slate-100"
      )}
    >
      <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-3xl bg-slate-50 pointer-events-none">
        <img 
          src={imageSrc} 
          alt="Alvo do jogo" 
          className="max-w-full max-h-full object-contain"
          loading="eager"
        />
      </div>

      {assignedWord && (
        <div className="absolute bottom-4 bg-blue-500 text-white px-6 py-2 rounded-full font-black text-xl shadow-lg animate-in zoom-in">
          {assignedWord}
        </div>
      )}

      {isCorrect && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/10 pointer-events-none rounded-[2.5rem]">
          <span className="text-8xl animate-bounce">⭐</span>
        </div>
      )}
    </div>
  );
};

export default ImageDropZone;