
import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { TransformVisual } from './components/TransformVisual';
import { FileUploader } from './components/FileUploader';
import { ProgressIndicator } from './components/ProgressIndicator';
import { SupportChat } from './components/SupportChat';
import { LaunchScreen } from './components/LaunchScreen';
import { CollapsibleMenu } from './components/CollapsibleMenu';
import { AboutPage } from './components/AboutPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { WhyUseItPage } from './components/WhyUseItPage';
import { aiEnhanceDocument, DocumentPayload } from './services/geminiService';
import { generatePDF } from './utils/pdfHelper';

export type Status = 'idle' | 'uploading' | 'processing' | 'generating' | 'completed' | 'error';
export type View = 'home' | 'about' | 'how-it-works' | 'why-use-it';

const App: React.FC = () => {
  const [isLaunching, setIsLaunching] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [status, setStatus] = useState<Status>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePayload, setFilePayload] = useState<DocumentPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus('uploading');
    setError(null);
    setFilePayload(null);
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isDocx = extension === 'docx';
    const isPdf = extension === 'pdf';
    const isDoc = extension === 'doc';
    const isText = ['txt', 'md', 'rtf', 'csv'].includes(extension || '');

    try {
      if (isDocx) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (!result.value.trim()) throw new Error("Document appears to be empty.");
        setFilePayload({ data: result.value, mimeType: 'text/plain', isText: true });
        setStatus('idle');
      } else if (isPdf || isDoc) {
        const reader = new FileReader();
        const mime = isPdf ? 'application/pdf' : 'application/msword';
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          setFilePayload({ data: base64, mimeType: mime, isText: false });
          setStatus('idle');
          if (isDoc) {
            setError("Legacy .doc detected. AI will attempt structural extraction.");
          }
        };
        reader.onerror = () => { throw new Error(`Failed to read ${extension?.toUpperCase()} file.`); };
        reader.readAsDataURL(file);
      } else if (isText) {
        const text = await file.text();
        setFilePayload({ data: text, mimeType: 'text/plain', isText: true });
        setStatus('idle');
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          setFilePayload({ data: base64, mimeType: file.type || 'application/octet-stream', isText: false });
          setStatus('idle');
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.error("File selection error:", err);
      setError(err.message || "File format not recognized. Please use .docx, .doc, or .pdf.");
      setStatus('error');
      setFileName(null);
    }
  };

  const startTransformation = async () => {
    if (!filePayload) {
      setError("Please select a valid document first.");
      return;
    }
    try {
      setStatus('processing');
      setError(null);
      const enhancedContent = await aiEnhanceDocument(filePayload);
      setStatus('generating');
      await generatePDF(enhancedContent, fileName || 'transformed-document.pdf');
      setStatus('completed');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err: any) {
      console.error("Transformation error:", err);
      setError(err.message || "AI was unable to parse this specific document structure.");
      setStatus('error');
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  if (isLaunching) {
    return <LaunchScreen onComplete={() => setIsLaunching(false)} />;
  }

  const isWorking = status === 'processing' || status === 'generating';

  const renderContent = () => {
    switch(currentView) {
      case 'about': return <AboutPage />;
      case 'how-it-works': return <HowItWorksPage />;
      case 'why-use-it': return <WhyUseItPage />;
      default: return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-4xl flex flex-col items-center space-y-12 mt-16"
        >
          <Header />
          <TransformVisual isProcessing={isWorking} />
          
          <div className="w-full max-w-md space-y-8 flex flex-col items-center">
            <FileUploader 
              onFileSelect={handleFileSelect}
              fileName={fileName}
              status={status}
              triggerFileInput={triggerFileInput}
              fileInputRef={fileInputRef}
            />

            <motion.button
              whileHover={status === 'idle' && filePayload ? { scale: 1.05 } : {}}
              whileTap={status === 'idle' && filePayload ? { scale: 0.95 } : {}}
              onClick={startTransformation}
              disabled={status !== 'idle' || !filePayload}
              className={`group relative flex flex-col items-center space-y-4 transition-all duration-300 ${
                (!filePayload || status !== 'idle') ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <AnimatePresence>
                {isWorking && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -inset-4 rounded-full border-2 border-dashed border-emerald-400 animate-[spin_8s_linear_infinite] opacity-30"
                  />
                )}
              </AnimatePresence>

              <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative overflow-hidden ${
                status === 'completed' ? 'bg-emerald-700' : isWorking ? 'bg-emerald-600 shadow-[0_0_40px_rgba(16,185,129,0.4)]' : 'bg-emerald-600 hover:bg-emerald-500'
              }`}>
                {isWorking && (
                  <motion.div 
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                )}
                
                <AnimatePresence mode="wait">
                  {status === 'completed' ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-white"
                    >
                      <Check className="w-16 h-16" strokeWidth={3} />
                    </motion.div>
                  ) : isWorking ? (
                    <motion.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white"
                    >
                      <Loader2 className="w-16 h-16 animate-spin" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sparkles"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-white"
                    >
                      <Sparkles className="w-16 h-16" strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <span className={`text-sm font-bold uppercase tracking-[0.3em] text-[#111827] transition-all duration-300 ${isWorking ? 'opacity-80' : 'opacity-100'}`}>
                {status === 'idle' ? 'Transform Document' : status === 'processing' ? 'AI Processing...' : status === 'generating' ? 'Generating PDF...' : status === 'completed' ? 'Success' : 'Transform Document'}
              </span>
            </motion.button>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest w-full flex items-center justify-center space-x-2 shadow-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <ProgressIndicator status={status} />
          </div>
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 transition-colors duration-500 selection:bg-emerald-100 selection:text-emerald-900">
      <CollapsibleMenu onNavigate={setCurrentView} currentView={currentView} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full flex flex-col items-center"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <footer className="mt-24 flex flex-col items-center space-y-1 text-gray-400 text-[10px] tracking-[0.2em] md:tracking-[0.4em] uppercase font-medium whitespace-nowrap text-center opacity-60">
        <p>Enterprise Standard • Secure SSL • AI-Optimized</p>
        <p>Built by Blue Dot Tech</p>
      </footer>

      <SupportChat />
    </div>
  );
};

export default App;
