
import React from 'react';
import { motion } from 'motion/react';
import { Upload, Cpu, FileDown, CheckCircle2 } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: 'Step 1',
      title: 'Upload',
      action: 'Upload your document',
      sub: 'Select a supported file to begin the transformation process.',
      icon: <Upload className="w-6 h-6" />
    },
    {
      num: 'Step 2',
      title: 'Process',
      action: 'AI processes your document',
      sub: 'Our system intelligently prepares your content for PDF output.',
      icon: <Cpu className="w-6 h-6" />
    },
    {
      num: 'Step 3',
      title: 'Transform',
      action: 'Receive your PDF',
      sub: 'Download a finalized document optimized for modern workflows.',
      icon: <FileDown className="w-6 h-6" />
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-4xl text-center space-y-16"
    >
      <div className="space-y-4">
        <h1 className="text-7xl font-bold tracking-tighter text-black uppercase">How It Works</h1>
        <p className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-[0.3em]">
          A streamlined, AI-powered document transformation workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
        {steps.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="space-y-6 p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                {s.num}
              </span>
              <div className="text-gray-300 group-hover:text-emerald-500 transition-colors">
                {s.icon}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-[#111827] tracking-tight">{s.action}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
        No configuration required.
      </p>
    </motion.div>
  );
};
