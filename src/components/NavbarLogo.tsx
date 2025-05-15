'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Image
              src='/slop-transparent.png'
              alt='Logo'
              width={50}
              height={50}
              className='transition-all duration-300 group-hover:brightness-110'
            />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
