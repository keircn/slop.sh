'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LuMenu } from 'react-icons/lu';
import { AudioPlayer } from '~/components/AudioPlayer';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';

function NavbarLogo() {
  return (
    <motion.div
      className='relative'
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link href='/' className='group relative z-10 flex items-center gap-2'>
        <motion.div
          className='relative overflow-hidden rounded-lg p-2'
          transition={{ duration: 0.2 }}
        >
          <motion.span
            className='from-primary to-primary/70 bg-gradient-to-r bg-clip-text font-mono text-2xl font-bold tracking-tight text-transparent'
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Keiran
          </motion.span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='bg-background/50 border-border/50 backdrop-blur-sm md:hidden'
        >
          <LuMenu className='h-4 w-4' />
        </Button>
      </SheetTrigger>
      <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='mt-8 flex flex-col gap-6'
        >
          <nav className='flex flex-col gap-4'>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className='hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-lg font-medium transition-colors'
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          variants={navVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
          className='fixed top-0 right-0 left-0 z-50 w-full'
        >
          <motion.div
            className='mx-auto max-w-[1215px] px-4 sm:px-6 lg:px-8'
            layoutId='navbar-container'
          >
            <motion.div
              className='bg-background/80 border-border/50 relative mt-4 rounded-2xl border shadow-lg shadow-black/5 backdrop-blur-xl'
              transition={{ duration: 0.2 }}
            >
              <div className='flex items-center justify-between px-6 py-4'>
                <motion.div
                  variants={itemVariants}
                  className='flex h-full items-center'
                >
                  <NavbarLogo />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className='flex h-full items-center gap-4'
                >
                  <div className='hidden items-center gap-4 md:flex'>
                    <AudioPlayer audioSrc='/audio/music.mp3' />
                  </div>

                  {/* <MobileMenu /> */}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
