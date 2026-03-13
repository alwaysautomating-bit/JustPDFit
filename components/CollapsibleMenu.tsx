
import React, { useState } from 'react';
import { View } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, Info, Zap, HelpCircle } from 'lucide-react';

interface Props {
  onNavigate: (view: View) => void;
  currentView: View;
}

export const CollapsibleMenu: React.FC<Props> = ({ onNavigate, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'about', label: 'About', icon: <Info className="w-5 h-5" /> },
    { id: 'how-it-works', label: 'How It Works', icon: <Zap className="w-5 h-5" /> },
    { id: 'why-use-it', label: 'Why Use It', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const handleNav = (view: View) => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed top-8 left-8 p-3 bg-white border border-gray-200 rounded-full shadow-sm z-[60] hover:bg-gray-50 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 bg-[#111827] z-[80] shadow-2xl p-12 flex flex-col"
            >
              <div className="flex justify-between items-center mb-16">
                <span className="text-white font-bold text-xl tracking-tighter">JustPDFIt</span>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 space-y-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className={`flex items-center space-x-4 w-full text-left text-lg font-medium tracking-wide transition-all group ${
                      currentView === item.id 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${currentView === item.id ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-500 group-hover:bg-gray-700 group-hover:text-gray-300'}`}>
                      {item.icon}
                    </div>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-auto">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                  V 2.5 — Enterprise Edition
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
