// src/components/StoryEngine.jsx
// Story engine with improved navigation UX and multi-frame page support

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StoryPage from './StoryPage';
import CoverPage from './CoverPage';
import PageFlipper from './PageFlipper';
import Navbar from './Navbar';
import FullStoryView from './FullStoryView';
import { storyPages } from '../data/story';
import { cn } from '../utils/cn';

const StoryEngine = ({ className }) => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [pageComplete, setPageComplete] = useState({});
  const [showFullStory, setShowFullStory] = useState(false);
  
  const currentPageData = storyPages[page];
  const nextPageData = storyPages[page + 1];
  const prevPageData = storyPages[page - 1];
  
  // Check if current page is complete
  const isCurrentPageComplete = pageComplete[page] === true;
  
  const handlePageComplete = useCallback((pageIndex) => {
    setPageComplete(prev => ({ ...prev, [pageIndex]: true }));
  }, []);
  
  const handlePageChange = useCallback((newPage, newDirection) => {
    // For multi-frame pages, only block FORWARD navigation if not complete
    const currentPage = storyPages[page];
    if (newDirection > 0 && currentPage && currentPage.type === 'multi-frame') {
      if (!pageComplete[page]) {
        return; // Block forward navigation until page is complete
      }
    }
    
    if (newPage >= 0 && newPage < storyPages.length) {
      setPage([newPage, newDirection]);
    }
  }, [page, pageComplete]);
  
  const renderPageContent = (data, pageIndex) => {
    if (!data) return null;
    if (data.type === 'cover') return <CoverPage pageData={data} />;
    return (
      <StoryPage 
        pageData={data} 
        pageIndex={pageIndex !== undefined ? pageIndex : page}
        onComplete={() => handlePageComplete(pageIndex !== undefined ? pageIndex : page)}
      />
    );
  };
  
  return (
    <div className={cn(
      "relative w-full h-full bg-black overflow-hidden flex flex-col",
      className
    )}>
      <Navbar 
        onGoToCover={() => handlePageChange(0, -1)}
        onShowText={() => setShowFullStory(true)}
        onJumpToPage={(index) => handlePageChange(index, index > page ? 1 : -1)}
        totalPages={storyPages.length}
        currentPage={page}
      />

      <AnimatePresence>
        {showFullStory && (
          <FullStoryView onClose={() => setShowFullStory(false)} />
        )}
      </AnimatePresence>

      {/* Book container */}
      <div className="flex-1 relative w-full min-h-0">
        <PageFlipper
          currentPage={page}
          totalPages={storyPages.length}
          onPageChange={handlePageChange}
          canNavigate={isCurrentPageComplete || currentPageData?.type !== 'multi-frame'}
          nextPageContent={renderPageContent(nextPageData, page + 1)}
          prevPageContent={renderPageContent(prevPageData, page - 1)}
        >
          {renderPageContent(currentPageData, page)}
        </PageFlipper>
      </div>
      
      {/* Bottom navigation bar - safe area for mobile browsers */}
      <div 
        className="relative z-50 bg-gradient-to-t from-black via-black/95 to-transparent pt-4 px-4"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
      >
        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto mb-3">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500/80 to-amber-400/60 rounded-full"
              initial={false}
              animate={{ width: `${((page + 1) / storyPages.length) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
        
        {/* Page dots */}
        <div className="flex items-center justify-center gap-1">
          {storyPages.map((pageData, idx) => {
            const isActive = idx === page;
            const isCover = pageData.type === 'cover';
            
            return (
              <button
                key={idx}
                onClick={() => handlePageChange(idx, idx > page ? 1 : -1)}
                className={cn(
                  "relative group transition-all duration-300 rounded-full",
                  "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-black",
                  isActive ? "mx-1" : "mx-0"
                )}
                aria-label={`Go to ${isCover ? 'cover' : `page ${idx + 1}`}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Dot */}
                <motion.div
                  className={cn(
                    "rounded-full transition-colors duration-200",
                    isActive 
                      ? "bg-white" 
                      : "bg-white/30 group-hover:bg-white/50 group-active:bg-white/60"
                  )}
                  animate={{
                    width: isActive ? 24 : 8,
                    height: 8,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
                
                {/* Tooltip on hover (desktop) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute -top-8 left-1/2 -translate-x-1/2 hidden sm:block"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                    >
                      <div className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded text-[10px] text-white/70 whitespace-nowrap border border-white/10">
                        {isCover ? 'Cover' : `Page ${idx + 1}`}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
        
        {/* Page counter */}
        <div className="flex items-center justify-center mt-2">
          <span className="text-white/40 text-xs font-story tabular-nums tracking-wide">
            Page {page + 1}
            <span className="text-white/20 mx-1.5">·</span>
            <span className="text-white/30">{storyPages.length} pages</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoryEngine;
