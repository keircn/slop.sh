'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '~/context/AudioContext';

interface EntranceOverlayProps {
  onEnter?: () => void;
}

export function EntranceOverlay({ onEnter }: EntranceOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { setHasInteracted, setAudioEnabled } = useAudio();

  const handleEnter = () => {
    setIsVisible(false);
    setHasInteracted(true);
    setAudioEnabled(true);
    if (onEnter) onEnter();
  };

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-background fixed inset-0 z-[100] flex items-center justify-center'
          onClick={handleEnter}
          style={{ cursor: 'pointer' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.5,
              type: 'spring',
              stiffness: 100,
            }}
            className='max-w-2xl translate-y-[-40vh] p-8 text-center'
          >
            <h1 className='mb-4 text-4xl font-bold'>Welcome to slop.sh</h1>
            <p className='text-muted-foreground mb-8 text-xl'>Click anywhere</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
