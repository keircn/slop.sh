'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
      <div className='border-border/40 text-muted-foreground flex flex-col items-center gap-2 border-t pt-8 text-sm'>
        <p className='text-center'>
          Made with ❤️ by{' '}
          <a
            href='https://github.com/q4ow'
            target='_blank'
            rel='noopener noreferrer'
            className='hover:text-primary/80 text-primary transition-colors'
          >
            Keiran
          </a>
        </p>
        <p className='text-xs'>Last updated: 23rd May, 2025</p>
      </div>
    </motion.footer>
  );
}
