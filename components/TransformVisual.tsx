
import React from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowRight, FileDown } from 'lucide-react';

interface Props {
  isProcessing: boolean;
}

export const TransformVisual: React.FC<Props> = ({ isProcessing }) => {
  return (
    <div className="flex items-center justify-center space-x-8 md:space-x-16">
      {/* Document Icon */}
      <motion.div 
        animate={{ 
          opacity: isProcessing ? 0.4 : 1,
          x: isProcessing ? 20 : 0,
          scale: isProcessing ? 0.9 : 1
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="relative"
      >
        <div className="w-20 h-24 bg-white border-2 border-gray-200 rounded-lg shadow-sm flex flex-col p-3 space-y-2">
          <div className="w-full h-2 bg-gray-100 rounded"></div>
          <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
          <div className="w-full h-2 bg-gray-100 rounded"></div>
          <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-[8px] font-bold text-white">DOC</span>
        </div>
      </motion.div>

      {/* Arrow Animation */}
      <div className="relative w-24 h-8 flex items-center justify-center">
        <motion.div 
          animate={{ 
            width: isProcessing ? "100%" : "40%",
            opacity: isProcessing ? 1 : 0.3
          }}
          className="h-1 bg-gray-300 rounded-full"
        />
        <motion.div 
          animate={{ 
            x: isProcessing ? 10 : -10,
            opacity: isProcessing ? 1 : 0.5
          }}
          transition={{ repeat: isProcessing ? Infinity : 0, duration: 1, repeatType: "reverse" }}
          className="absolute right-0"
        >
          <ArrowRight className={`w-6 h-6 ${isProcessing ? 'text-emerald-500' : 'text-gray-400'}`} />
        </motion.div>
        
        {isProcessing && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 h-1 bg-emerald-500 rounded-full opacity-50"
          />
        )}
      </div>

      {/* PDF Icon */}
      <motion.div 
        animate={{ 
          opacity: isProcessing ? 1 : 0.4,
          scale: isProcessing ? 1.1 : 1,
          x: isProcessing ? -20 : 0
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="relative"
      >
        <div className="w-20 h-24 bg-white border-2 border-red-100 rounded-lg shadow-md flex flex-col items-center justify-center p-3">
          <div className="w-full h-full border border-red-50 border-dashed rounded flex flex-col items-center justify-center">
             <div className="w-10 h-12 bg-red-50 rounded flex items-center justify-center">
                <span className="text-red-600 font-bold text-xs">PDF</span>
             </div>
          </div>
        </div>
        <motion.div 
          animate={{ y: isProcessing ? [0, -5, 0] : 0 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
        >
          <FileDown className="w-3 h-3 text-white" />
        </motion.div>
      </motion.div>
    </div>
  );
};
