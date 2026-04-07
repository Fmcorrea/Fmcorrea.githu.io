"use client";

import React, { useRef, useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { ImageOff, Loader2 } from 'lucide-react';

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
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(imageSrc);

  useEffect(() => {
    setCurrentSrc(imageSrc);
    setStatus('loading');
  }, [imageSrc]);

  useEffect(() => {
    if (containerRef.current) {
      onMeasure(id, containerRef.current.getBoundingClientRect());
    }
    const handleResize = () => {
      if (containerRef.current) onMeasure(id, containerRef.current.getBoundingClientRect());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onMeasure, id]);

  const handleError = () => {
    // Se o link da API falhar, tenta o caminho relativo como fallback
    if (currentSrc.startsWith('https://api.dyad.sh')) {
      const fileName = currentSrc.split('/').pop();
      setCurrentSrc(`/api/media/${fileName}`);
    } else {
      setStatus('error');
    }
  };

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
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
            <Loader2 className="animate-spin text-blue-400" size={32} />
          </div>
        )}
        
        {status !== 'error' ? (
          <img 
            src={currentSrc} 
            alt="Opção de jogo" 
            className={cn(
              "max-w-full max-h-full object-contain transition-opacity duration-300",
              status === 'loading' ? 'opacity-0' : 'opacity-100'
            )}
            onError={handleError}
            onLoad={() => setStatus('success')}
          />
        ) : (
          <div className="flex flex-col items-center text-slate-300">
            <ImageOff size={48} />
            <span className="text-xs font-bold mt-2">Erro ao carregar</span>
          </div>
        )}
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