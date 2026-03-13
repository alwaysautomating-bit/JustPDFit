
import React from 'react';
import { Status } from '../App';
import { motion } from 'motion/react';

interface Props {
  status: Status;
}

export const ProgressIndicator: React.FC<Props> = ({ status }) => {
  if (status === 'idle' || status === 'error') return null;

  const getProgress = () => {
    switch(status) {
      case 'uploading': return 25;
      case 'processing': return 60;
      case 'generating': return 85;
      case 'completed': return 100;
      default: return 0;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-2"
    >
      <div className="flex justify-between items-end">
        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Transformation Progress</span>
        <span className="text-xs font-mono font-bold text-emerald-600">{getProgress()}%</span>
      </div>
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${getProgress()}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
        />
      </div>
    </motion.div>
  );
};
