"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface DraggableWordProps {
  id: string;
  text: string;
  onDragEnd: (id: string, info: any) => void;
  onDragStart?: () => void;
  disabled?: boolean;
}

const DraggableWord = ({ id, text, onDragEnd, onDragStart, disabled }: DraggableWordProps) => {
  return (
    <motion.div
      drag={!disabled}
      dragSnapToOrigin
      onDragStart={onDragStart}
      onDragEnd={(_, info) => onDragEnd(id, info)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95, cursor: 'grabbing' }}
      className={`
        px-8 py-4 bg-white border-4 border-blue-400 rounded-2xl shadow-lg
        text-3xl font-black text-blue-600 cursor-grab select-none
        ${disabled ? 'opacity-50 cursor-default' : 'hover:bg-blue-50'}
      `}
    >
      {text}
    </motion.div>
  );
};

export default DraggableWord;