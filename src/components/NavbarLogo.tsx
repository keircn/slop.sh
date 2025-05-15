'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NavbarVariantsProps } from '~/types/Navbar';

export function NavbarLogo({ variants }: NavbarVariantsProps) {
  return (
    <motion.div
      variants={variants}
      className='relative text-xl font-semibold'
      style={{ transform: 'none' }}
    >
      <div className='from-primary/60 via-primary/40 to-primary/20 absolute -inset-2 rounded-full bg-gradient-to-r opacity-50 blur-xl' />
      <Link
        href='/'
        className='group relative z-[1] flex cursor-pointer items-center gap-2'
        prefetch={false}
      >
        <div className='relative ml-4 overflow-hidden'>
          <div className='flex flex-col items-center'>
            <div className='relative font-mono text-3xl font-bold tracking-tighter'>
              <span className='text-primary hover:text-primary/80 relative z-10 transition-colors duration-300'>
                スロプ
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
