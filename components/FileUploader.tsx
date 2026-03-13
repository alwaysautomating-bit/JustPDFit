
import React from 'react';
import { Status } from '../App';
import { motion } from 'motion/react';
import { Upload, FileCheck, Loader2 } from 'lucide-react';

interface Props {
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileName: string | null;
  status: Status;
  triggerFileInput: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const FileUploader: React.FC<Props> = ({ 
  onFileSelect, 
  fileName, 
  status, 
  triggerFileInput, 
  fileInputRef 
}) => {
  const isUploading = status === 'uploading';

  return (
    <div className="w-full">
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={onFileSelect}
        className="hidden"
        accept=".txt,.md,.rtf,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      />
      
      <motion.div 
        whileHover={status === 'idle' || status === 'error' ? { scale: 1.01, borderColor: '#10b981' } : {}}
        whileTap={status === 'idle' || status === 'error' ? { scale: 0.99 } : {}}
        onClick={status === 'idle' || status === 'error' ? triggerFileInput : undefined}
        className={`w-full border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-500 ${
          status === 'idle' || status === 'error'
          ? 'border-gray-200 bg-white cursor-pointer shadow-sm' 
          : 'border-emerald-100 bg-emerald-50 cursor-default'
        }`}
      >
        <motion.div 
          animate={fileName ? { rotate: 0, scale: 1.1 } : { rotate: -3, scale: 1 }}
          className={`mb-4 p-4 rounded-2xl transition-all duration-500 ${fileName ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-50 text-gray-300'}`}
        >
          {isUploading ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : fileName ? (
            <FileCheck className="w-10 h-10" />
          ) : (
            <Upload className="w-10 h-10" />
          )}
        </motion.div>
        
        <p className="text-xl font-bold text-[#111827] tracking-tight text-center">
          {isUploading ? 'Validating Document...' : fileName ? fileName : 'Select Document'}
        </p>
        
        <p className="text-[10px] text-gray-400 mt-3 uppercase tracking-[0.2em] font-bold text-center">
          Enterprise Formats: PDF, DOCX, DOC, TXT, MD
        </p>
      </motion.div>
    </div>
  );
};
