'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa6';

export function Footer() {
  const footerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.footer
      className='mx-auto mt-auto w-full max-w-5xl px-4 pb-8'
      initial='initial'
      animate='animate'
      variants={footerVariants}
    >
      <div className='border-border/40 text-muted-foreground flex flex-wrap items-center justify-center gap-1 border-t pt-8 text-sm'>
        <span>Made with</span>
        <FaHeart className='text-red-500' />
        <span>by</span>
        <a
          href='https://github.com/q4ow'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-primary/80 text-primary transition-colors'
        >
          Keiran
        </a>
        <div className="w-full flex justify-center mt-1">
          <span>Last updated: 23rd May, 2025</span>
        </div>
      </div>
    </motion.footer>
  );
}
