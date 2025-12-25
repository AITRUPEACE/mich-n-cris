// src/hooks/usePageFlip.js
// Custom hook for calculating page flip physics and drag gestures

import { useState, useCallback, useRef } from 'react';

/**
 * Calculates the page curl effect based on drag position
 * @param {number} dragX - Horizontal drag distance (negative = dragging left)
 * @param {number} dragY - Vertical drag distance
 * @param {number} pageWidth - Width of the page
 * @returns {object} Transform values for the page curl effect
 */
export function calculatePageCurl(dragX, dragY, pageWidth) {
  // Normalize drag to percentage (0 to 1)
  const dragProgress = Math.min(1, Math.max(0, Math.abs(dragX) / pageWidth));
  
  // Calculate rotation angle (0 to 180 degrees)
  const rotateY = dragProgress * 180;
  
  // Calculate shadow intensity based on curl amount
  const shadowIntensity = Math.sin(dragProgress * Math.PI) * 0.5;
  
  // Calculate slight perspective tilt based on Y drag
  const rotateX = (dragY / 500) * 5;
  
  // Scale slightly during flip for depth effect
  const scale = 1 - (dragProgress * 0.05);
  
  // Calculate corner curl (more curl as page turns)
  const cornerCurl = dragProgress * 30;
  
  return {
    rotateY,
    rotateX,
    scale,
    shadowIntensity,
    cornerCurl,
    progress: dragProgress
  };
}

/**
 * Custom hook for managing page flip state and gestures
 */
export function usePageFlip({ 
  totalPages, 
  initialPage = 0,
  flipThreshold = 0.4, // 40% drag to trigger flip
  onPageChange 
}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [flipDirection, setFlipDirection] = useState(0); // -1 = prev, 1 = next
  const containerRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  
  // Check if we can go to next/previous page
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrev = currentPage > 0;
  
  // Handle drag start
  const handleDragStart = useCallback((e) => {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    
    dragStartRef.current = { x: clientX, y: clientY };
    setIsDragging(true);
    setDragOffset({ x: 0, y: 0 });
  }, []);
  
  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;
    
    // Determine direction based on drag
    if (deltaX < -10 && canGoNext) {
      setFlipDirection(1); // Next page
    } else if (deltaX > 10 && canGoPrev) {
      setFlipDirection(-1); // Previous page
    }
    
    setDragOffset({ x: deltaX, y: deltaY });
  }, [isDragging, canGoNext, canGoPrev]);
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    const containerWidth = containerRef.current?.offsetWidth || 800;
    const dragProgress = Math.abs(dragOffset.x) / containerWidth;
    
    // Check if drag exceeded threshold
    if (dragProgress >= flipThreshold) {
      if (flipDirection === 1 && canGoNext) {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        onPageChange?.(newPage, 1);
      } else if (flipDirection === -1 && canGoPrev) {
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        onPageChange?.(newPage, -1);
      }
    }
    
    // Reset drag state
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setFlipDirection(0);
  }, [isDragging, dragOffset, flipThreshold, flipDirection, currentPage, canGoNext, canGoPrev, onPageChange]);
  
  // Direct page navigation
  const goToPage = useCallback((pageIndex) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      const direction = pageIndex > currentPage ? 1 : -1;
      setCurrentPage(pageIndex);
      onPageChange?.(pageIndex, direction);
    }
  }, [totalPages, currentPage, onPageChange]);
  
  // Go to next page
  const nextPage = useCallback(() => {
    if (canGoNext) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage, 1);
    }
  }, [canGoNext, currentPage, onPageChange]);
  
  // Go to previous page
  const prevPage = useCallback(() => {
    if (canGoPrev) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      onPageChange?.(newPage, -1);
    }
  }, [canGoPrev, currentPage, onPageChange]);
  
  return {
    currentPage,
    isDragging,
    dragOffset,
    flipDirection,
    canGoNext,
    canGoPrev,
    containerRef,
    handlers: {
      onDragStart: handleDragStart,
      onDragMove: handleDragMove,
      onDragEnd: handleDragEnd,
    },
    actions: {
      goToPage,
      nextPage,
      prevPage,
    }
  };
}

export default usePageFlip;


