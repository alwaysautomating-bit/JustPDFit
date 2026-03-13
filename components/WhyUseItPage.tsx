
import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export const WhyUseItPage: React.FC = () => {
  const points = [
    'Enterprise-ready output',
    'AI-powered processing',
    'Consistent results',
    'Zero learning curve',
    'Leadership-approved workflows'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl text-center space-y-16"
    >
      <h1 className="text-7xl font-bold tracking-tighter text-black uppercase">Why Use It</h1>
      
      <ul className="space-y-6 inline-block text-left">
        {points.map((p, i) => (
          <motion.li 
            key={i} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center space-x-4 text-xl md:text-2xl font-light text-gray-700"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span>{p}</span>
          </motion.li>
        ))}
      </ul>

      <div className="pt-12">
        <p className="text-sm text-gray-400 italic font-medium tracking-wide">
          Because PDFs are still required.
        </p>
      </div>
    </motion.div>
  );
};
