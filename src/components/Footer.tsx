'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa6';
import { LatestCommitData } from '~/lib/github-cache';
import Link from 'next/link';

export function Footer() {
  const [latestCommit, setLatestCommit] = useState<LatestCommitData | null>(null);

  useEffect(() => {
    fetch('/api/github/latest-commit')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.date) {
          const formattedDate = new Date(data.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          setLatestCommit({ ...data, date: formattedDate });
        } else {
          setLatestCommit(null);
        }
      })
      .catch(() => setLatestCommit(null));
  }, []);

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
        <Link
          href='https://github.com/q4ow'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-primary/80 text-primary transition-colors'
        >
          Keiran
        </Link>
        <div className="w-full flex justify-center mt-1">
          {latestCommit ? (
            <span className="text-muted-foreground">
              Last updated: {latestCommit.date} (<Link
                href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'q4ow'}/${process.env.NEXT_PUBLIC_REPO_NAME || 'slop.sh'}/commit/${latestCommit.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary/80 text-muted-foreground transition-colors"
                title={latestCommit.message}
              >
                {latestCommit.hash}
              </Link>)
            </span>
          ) : (
            <span>Last updated: 23rd May, 2025</span>
          )}
        </div>
      </div>
    </motion.footer>
  );
}
