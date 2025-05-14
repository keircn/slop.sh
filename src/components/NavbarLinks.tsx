'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface NavbarLinksProps {
  variants?: Variants;
}

const links = [
  { href: '/contact', label: 'Contact' },
  { href: '/clara', label: 'Clara' },
] as const;

export function NavbarLinks({ variants }: NavbarLinksProps) {
  return (
    <div className='ml-6 hidden items-center space-x-6 md:flex'>
      {links.map((link) => (
        <motion.a
          key={link.href}
          href={link.href}
          className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'
          variants={variants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {link.label}
        </motion.a>
      ))}
    </div>
  );
}
