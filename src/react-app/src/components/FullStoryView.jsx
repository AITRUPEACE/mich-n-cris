// src/components/FullStoryView.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { storyPages, storyMeta } from '../data/story';
import { cn } from '../utils/cn';

const FullStoryView = ({ onClose }) => {
  // Filter out cover page for the story text
  const storyContent = storyPages.filter(p => p.type !== 'cover');
  
  // Group pages into chapters (every 7 pages is a new "chapter" for visual breaks)
  const chapterSize = 7;
  const chapters = [];
  for (let i = 0; i < storyContent.length; i += chapterSize) {
    chapters.push(storyContent.slice(i, i + chapterSize));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] overflow-y-auto"
      style={{
        backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png"), linear-gradient(to bottom, #f5e6c8, #ecdbb4, #e8d4a8)`,
        backgroundColor: '#f5e6c8',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 p-4 rounded-full bg-[#3e2723]/10 hover:bg-[#3e2723]/20 transition-all z-[210] border border-[#3e2723]/10 hover:scale-110 active:scale-95"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-[#3e2723]" />
      </button>

      {/* Main content container with generous padding */}
      <div className="max-w-3xl mx-auto px-12 sm:px-16 py-20 sm:py-28">
        
        {/* Title Section */}
        <header className="mb-24 text-center">
          <div className="mb-8">
            <div className="inline-block px-6 py-2 border-t border-b border-[#3e2723]/20">
              <span className="text-xs uppercase tracking-[0.5em] text-[#5d4037]/60 font-medium">
                {storyMeta.volume}
              </span>
            </div>
          </div>
          
          <h1 className="font-title text-4xl sm:text-5xl md:text-6xl mb-6 text-[#2d1b18] tracking-wide leading-tight">
            {storyMeta.title}
          </h1>
          
          <h2 className="font-title text-xl sm:text-2xl text-[#5d4037]/80 italic tracking-wide">
            {storyMeta.subtitle}
          </h2>
          
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="w-16 h-px bg-[#3e2723]/20" />
            <div className="text-2xl text-[#3e2723]/30">✦</div>
            <div className="w-16 h-px bg-[#3e2723]/20" />
          </div>
        </header>

        {/* Story Content */}
        <article className="text-[#3e2723]">
          {chapters.map((chapter, chapterIndex) => (
            <section key={chapterIndex} className="mb-20">
              {/* Chapter divider (except first) */}
              {chapterIndex > 0 && (
                <div className="flex items-center justify-center gap-6 mb-16 mt-8">
                  <div className="w-12 h-px bg-[#3e2723]/15" />
                  <span className="text-xs uppercase tracking-[0.4em] text-[#5d4037]/40">
                    ❧
                  </span>
                  <div className="w-12 h-px bg-[#3e2723]/15" />
                </div>
              )}
              
              {/* Paragraphs */}
              <div className="space-y-8">
                {chapter.map((page, pageIndex) => {
                  const isFirstParagraph = chapterIndex === 0 && pageIndex === 0;
                  const globalIndex = chapterIndex * chapterSize + pageIndex;
                  
                  return (
                    <motion.div
                      key={page.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: globalIndex * 0.02 }}
                      className="relative group"
                    >
                      {/* Page number indicator on hover */}
                      <span className="absolute -left-10 sm:-left-14 top-1 text-[9px] text-[#5d4037]/30 font-mono opacity-0 group-hover:opacity-100 transition-all duration-300 select-none">
                        {globalIndex + 1}
                      </span>
                      
                      <p
                        className={cn(
                          "font-story text-lg sm:text-xl md:text-[1.35rem] leading-[1.9] sm:leading-[2] tracking-wide text-justify",
                          isFirstParagraph 
                            ? "first-letter:text-6xl sm:first-letter:text-7xl first-letter:font-title first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:text-[#2d1b18] first-letter:leading-[0.8]" 
                            : "indent-12 sm:indent-16"
                        )}
                        style={{
                          textIndent: isFirstParagraph ? 0 : undefined,
                          hyphens: 'auto',
                        }}
                      >
                        {page.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </article>

        {/* Footer */}
        <footer className="mt-24 pt-16 border-t border-[#3e2723]/10 text-center">
          <div className="mb-10 flex items-center justify-center">
            <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#3e2723]/15" />
            <div className="mx-6 text-2xl text-[#3e2723]/25">❦</div>
            <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#3e2723]/15" />
          </div>
          
          <p className="font-title text-lg uppercase tracking-[0.5em] text-[#5d4037]/50 mb-4">
            The End
          </p>
          <p className="text-sm italic text-[#5d4037]/40">
            Thank you for reading
          </p>
          
          <div className="mt-12 pb-8">
            <div className="inline-block px-8 py-3 border border-[#3e2723]/10 rounded-full">
              <span className="text-xs uppercase tracking-[0.3em] text-[#5d4037]/40">
                {storyMeta.title} · {storyMeta.subtitle}
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Decorative page edges */}
      <div className="fixed inset-y-0 left-0 w-6 bg-gradient-to-r from-[#3e2723]/5 to-transparent pointer-events-none" />
      <div className="fixed inset-y-0 right-0 w-6 bg-gradient-to-l from-[#3e2723]/5 to-transparent pointer-events-none" />
      <div className="fixed top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#3e2723]/5 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default FullStoryView;
