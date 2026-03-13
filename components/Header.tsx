
import React from 'react';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center space-y-2 select-none"
    >
      <h1 className="text-7xl font-bold tracking-tighter text-black sm:text-8xl">
        JustPDFIt
      </h1>
      <div className="space-y-1">
        <h2 className="text-2xl font-light tracking-widest uppercase text-gray-500">
          PDF, Powered by AI
        </h2>
        <p className="text-sm font-medium tracking-wide text-gray-400 italic">
          A Document Transformation Experience
        </p>
      </div>
    </motion.header>
  );
};
