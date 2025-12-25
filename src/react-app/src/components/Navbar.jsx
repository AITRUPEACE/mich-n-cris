// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronDown, Book, Type, Navigation, X } from 'lucide-react';
import { cn } from '../utils/cn';

const Navbar = ({ onGoToCover, onShowText, onJumpToPage, totalPages, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showJumpTo, setShowJumpTo] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowJumpTo(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleAction = (action) => {
    action();
    setIsOpen(false);
    setShowJumpTo(false);
  };

  return (
    <div 
      className="absolute inset-x-0 top-0 z-[100] flex justify-end items-start pointer-events-none"
      style={{ padding: '5px' }}
    >
      <div className="pointer-events-auto relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className={cn(
            "flex items-center gap-3 rounded-full transition-all duration-300",
            "bg-black/50 backdrop-blur-md border border-white/15 text-white/90 hover:text-white hover:bg-black/70",
            isOpen && "bg-black/80 border-amber-500/50 text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
          )}
          style={{ padding: '12px 24px' }}
        >
          <Menu className="w-5 h-5" />
          <span className="text-sm font-medium tracking-widest uppercase">Menu</span>
          <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-full right-0 mt-3 w-64 origin-top-right"
            >
              {/* Content - single container with border */}
              <div 
                className="relative rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                style={{
                  background: 'linear-gradient(to bottom, rgba(30, 30, 40, 0.98), rgba(10, 10, 15, 0.98))',
                  backdropFilter: 'blur(24px)',
                }}
              >
                {/* Header */}
                <div className="px-5 pt-5 pb-3">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/50">
                    Navigation
                  </p>
                </div>
                
                {/* Divider */}
                <div className="mx-3 h-px bg-white/10" />
                  
                {/* Menu items */}
                <div className="p-2">
                    <button
                      onClick={() => handleAction(onGoToCover)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center group-hover:from-amber-500/30 group-hover:to-amber-600/20 transition-all">
                        <Book className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Cover</span>
                        <span className="text-[10px] text-white/40">Return to start</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleAction(onShowText)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500/20 to-sky-600/10 flex items-center justify-center group-hover:from-sky-500/30 group-hover:to-sky-600/20 transition-all">
                        <Type className="w-4 h-4 text-sky-400" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Full Story</span>
                        <span className="text-[10px] text-white/40">Read all text</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setShowJumpTo(!showJumpTo)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group",
                        showJumpTo && "bg-white/5 text-white"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 flex items-center justify-center transition-all",
                          showJumpTo ? "from-violet-500/30 to-violet-600/20" : "group-hover:from-violet-500/30 group-hover:to-violet-600/20"
                        )}>
                          <Navigation className="w-4 h-4 text-violet-400" />
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium">Jump to Page</span>
                          <span className="text-[10px] text-white/40">Page {currentPage} of {totalPages - 1}</span>
                        </div>
                      </div>
                      <ChevronDown className={cn(
                        "w-4 h-4 text-white/40 transition-transform duration-300",
                        showJumpTo && "rotate-180 text-violet-400"
                      )} />
                    </button>

                    <AnimatePresence>
                      {showJumpTo && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="grid grid-cols-5 gap-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                              {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleAction(() => onJumpToPage(i))}
                                  className={cn(
                                    "aspect-square flex items-center justify-center text-xs font-medium rounded-lg transition-all duration-200",
                                    currentPage === i 
                                      ? "bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/30" 
                                      : "text-white/50 hover:bg-white/10 hover:text-white"
                                  )}
                                >
                                  {i === 0 ? '★' : i}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                {/* Footer */}
                <div className="mx-3 mb-3 h-px bg-white/10" />
                <div className="px-4 pb-4">
                  <p className="text-[10px] text-white/40 text-center">
                    Page {currentPage === 0 ? 'Cover' : currentPage} of {totalPages - 1}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;

