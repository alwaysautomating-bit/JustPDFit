
import React from 'react';
import { motion } from 'motion/react';

export const AboutPage: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl text-center space-y-12"
    >
      <h1 className="text-7xl font-bold tracking-tighter text-black uppercase">About</h1>
      <div className="space-y-8">
        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light">
          JustPDFIt is a modern document transformation platform designed to help teams seamlessly convert documents into PDFs using AI-powered workflows.
        </p>
        <p className="text-lg text-gray-400 leading-relaxed font-medium tracking-wide">
          Built with enterprise needs in mind, JustPDFIt delivers consistency, reliability, and confidence at scale.
        </p>
      </div>
      <div className="pt-12">
        <div className="w-16 h-[1px] bg-gray-200 mx-auto"></div>
      </div>
    </motion.div>
  );
};
