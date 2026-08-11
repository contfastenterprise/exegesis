import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CurvedCarouselProps {
  images: string[];
  autoPlayInterval?: number;
}

export const CurvedCarousel: React.FC<CurvedCarouselProps> = ({ 
  images = [],
  autoPlayInterval = 3000
}) => {
  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=60'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!displayImages || displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [displayImages, autoPlayInterval]);

  if (!displayImages || displayImages.length === 0) {
    return null;
  }

  // Calculate positions for 5 visible items: center, left1, left2, right1, right2
  const getVisibleItems = () => {
    const len = displayImages.length;
    if (len === 0) return [];
    
    // For small arrays, just show them normally or duplicate
    if (len < 3) {
      return displayImages.map((img, i) => ({ img, offset: i - currentIndex, index: i }));
    }

    const items = [];
    // Show 5 items: -2, -1, 0, 1, 2
    for (let offset = -2; offset <= 2; offset++) {
      let index = (currentIndex + offset) % len;
      if (index < 0) index += len;
      items.push({ img: displayImages[index], offset, index, originalIndex: index });
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  return (
    <div className="relative w-full h-64 sm:h-80 md:h-96 flex items-center justify-center overflow-hidden [perspective:1200px] my-8">
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center [transform-style:preserve-3d]">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleItems.map((item) => {
            
            // Calculate transforms based on offset from center (-2, -1, 0, 1, 2)
            const isCenter = item.offset === 0;
            const isEdge = Math.abs(item.offset) === 2;
            const isAdjacent = Math.abs(item.offset) === 1;
            
            let rotateY = 0;
            let translateZ = 0;
            let translateX = 0;
            let scale = 1;
            let zIndex = 0;
            let opacity = 1;

            // Values tuned to look like the reference image
            if (isCenter) {
              rotateY = 0;
              translateZ = 50;
              translateX = 0;
              scale = 1;
              zIndex = 30;
              opacity = 1;
            } else if (item.offset === -1) {
              rotateY = 25;
              translateZ = -50;
              translateX = -180; // shift left
              scale = 0.9;
              zIndex = 20;
              opacity = 0.9;
            } else if (item.offset === 1) {
              rotateY = -25;
              translateZ = -50;
              translateX = 180; // shift right
              scale = 0.9;
              zIndex = 20;
              opacity = 0.9;
            } else if (item.offset === -2) {
              rotateY = 45;
              translateZ = -150;
              translateX = -320;
              scale = 0.75;
              zIndex = 10;
              opacity = 0.6;
            } else if (item.offset === 2) {
              rotateY = -45;
              translateZ = -150;
              translateX = 320;
              scale = 0.75;
              zIndex = 10;
              opacity = 0.6;
            }

            return (
              <motion.div
                key={`${item.index}-${item.offset}`} // unique key for animations
                initial={{ 
                  opacity: 0, 
                  x: item.offset > 0 ? 300 : -300, 
                  z: -300,
                  rotateY: item.offset > 0 ? -40 : 40,
                  scale: 0.5 
                }}
                animate={{
                  opacity,
                  x: translateX,
                  z: translateZ,
                  rotateY,
                  scale,
                }}
                exit={{ 
                  opacity: 0,
                  x: item.offset < 0 ? 300 : -300, 
                  z: -300,
                  rotateY: item.offset < 0 ? -40 : 40,
                  scale: 0.5 
                }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="absolute w-[50%] sm:w-[40%] md:w-[28%] lg:w-[25%] aspect-[3/4] sm:aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl origin-center"
                style={{ zIndex, willChange: 'transform, opacity' }}
              >
                <img 
                  src={item.img} 
                  alt={`Carousel ${item.index}`} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
