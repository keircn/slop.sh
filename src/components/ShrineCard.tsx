'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { useMobile } from '~/hooks/useMobile';
import {
  FaHeart as Heart,
  FaChevronRight,
  FaChevronLeft,
} from 'react-icons/fa6';

interface ImageData {
  url: string;
  caption: string;
}

const images: ImageData[] = [
  {
    url: '/clara/clara-1.jpg',
    caption: 'I love the way you smile',
  },
  {
    url: '/clara/clara-2.jpg',
    caption: 'I love the way you laugh',
  },
  {
    url: '/clara/clara-3.jpg',
    caption: 'I love the way you think',
  },
  {
    url: '/clara/clara-4.jpg',
    caption: 'I love the way you make me feel',
  },
  {
    url: '/clara/clara-5.jpg',
    caption: 'I love you',
  },
];

const aboutClara =
  "Clara is the most amazing person I've ever met. From her goofy smile to her brilliant mind, she makes my every day better just by being in it. I feel incredibly lucky to have her in my life - she's not just my partner, but my best friend and bestire. She is truly beautiful, and the past year and a half has been amazing thanks to her. I love you so much, Clara.";

export function ShrineCard() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { isMobile } = useMobile();

  const nextImage = () => {
    setIsFlipped(false);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setIsFlipped(false);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative mt-12 flex flex-col items-center justify-center ${isMobile ? 'px-4' : ''}`}
    >
      <Card className='bg-card relative w-full max-w-6xl overflow-hidden border-2 backdrop-blur-sm'>
        <div className='pointer-events-none absolute inset-0 opacity-5'>
          <div className='border-primary/30 absolute -top-12 -right-12 h-40 w-40 animate-pulse rounded-full border' />
          <div className='border-primary/20 absolute top-20 -right-8 h-24 w-24 animate-pulse rounded-full border' />
          <div className='border-primary/20 absolute -bottom-20 -left-20 h-60 w-60 animate-pulse rounded-full border' />
        </div>

        <CardContent className='mx-auto flex w-full flex-col items-center p-6 pt-4'>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='text-foreground mb-6 flex items-center justify-center space-x-2 text-center text-3xl font-bold'
          >
            <span>Clara Shrine</span>
            <Heart className='text-pink-300 transition-all hover:scale-105' />
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='mb-8'
          >
            <p className='text-foreground/80 px-4 text-center text-lg leading-relaxed italic'>
              {aboutClara}
            </p>
          </motion.div>

          <div className='mb-4 flex justify-center space-x-4'>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className='bg-primary/10 text-primary hover:bg-primary/20 rounded-2xl p-4 px-5 transition-colors'
              onClick={previousImage}
            >
              <FaChevronLeft />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className='bg-primary/10 text-primary hover:bg-primary/20 rounded-2xl p-4 px-5 transition-colors'
              onClick={toggleFlip}
            >
              <Heart />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className='bg-primary/10 text-primary hover:bg-primary/20 rounded-2xl p-4 px-5 transition-colors'
              onClick={nextImage}
            >
              <FaChevronRight />
            </motion.button>
          </div>

          <motion.div
            className='border-border relative aspect-square cursor-pointer overflow-hidden rounded-lg border'
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              className={`absolute inset-0 ${isFlipped ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: currentImageIndex === index ? 1 : 0,
                    transition: { duration: 0.5 },
                  }}
                  className={`absolute inset-0 ${currentImageIndex === index ? 'z-10' : 'z-0'}`}
                >
                  <Image
                    src={image.url}
                    alt={image.caption}
                    width={1242}
                    height={1242}
                    className='h-full w-full object-cover'
                    sizes='(max-width: 768px) 100vw, 50vw'
                    priority={index === 0}
                    quality={100}
                  />
                </motion.div>
              ))}
            </div>

            <div
              className={`absolute inset-0 ${isFlipped ? 'opacity-100' : 'opacity-0'} bg-card flex items-center justify-center transition-opacity duration-300`}
              style={{ transform: 'rotateY(180deg)' }}
            >
              <p className='text-primary p-8 text-center text-xl italic'>
                {images[currentImageIndex].caption}
              </p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
