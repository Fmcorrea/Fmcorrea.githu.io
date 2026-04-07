"use client";

import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface ImageDropZoneProps {
  id: string;
  imageSrc: string;
  isCorrect?: boolean;
  isWrong?: boolean;
  assignedWord?: string | null;
  onMeasure: (id: string, rect: DOMRect) => void;
}

const ImageDropZone = ({ id, imageSrc, isCorrect, isWrong, assignedWord, onMeasure }: ImageDropZoneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      onMeasure(id, containerRef.current.getBoundingClientRect());
    }
    // Re-medir se a janela mudar de tamanho
    window.addEventListener('resize', () => {
      if (containerRef.current) onMeasure(id, containerRef.current.getBoundingClientRect());
    });
  }, [onMeasure, id]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full aspect-square bg-white rounded-[2.5rem] border-8 transition-all duration-300 flex flex-col items-center justify-center p-4 shadow-xl",
        isCorrect ? "border-green-500 ring-8 ring-green-100" : 
        isWrong ? "border-red-500 animate-shake" : "border-slate-100"
      )}
    >
      <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-3xl bg-slate-50">
        <img 
          src={imageSrc} 
          alt="Opção de jogo" 
          className="max-w-full max-h-full object-contain"
          style={{ display: 'block', minWidth: '100px', minHeight: '100px' }}
          onLoad={(e) => {
            // Garante que a imagem seja visível em navegadores que podem ter problemas de renderização
            (e.target as HTMLImageElement).style.opacity = '1';
          }}
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