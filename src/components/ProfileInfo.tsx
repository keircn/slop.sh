'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BiCode } from 'react-icons/bi';
import { FaCoffee, FaDiscord, FaEnvelope, FaGithub } from 'react-icons/fa';
import { LuCalendarDays } from 'react-icons/lu';
import { Typewriter } from 'react-simple-typewriter';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { getAge } from '~/lib/utils';
import type { ProfileInfoProps } from '~/types/ProfileInfo';

export function ProfileInfo({
  name,
  title,
  bio,
  dateOfBirth,
  avatarUrl,
  links,
}: ProfileInfoProps) {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const slideIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Card className='w-full overflow-hidden'>
      <CardContent className='p-6'>
        <div className='flex flex-col space-y-8 md:flex-row md:items-start md:space-y-0 md:space-x-8 lg:space-x-12'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={fadeIn}
            transition={{ duration: 0.5 }}
            className='flex flex-col items-center space-y-4 md:w-auto md:flex-shrink-0'
          >
            <div className='relative ml-4'>
              <div className='from-primary/30 to-primary/10 absolute -inset-1.5 animate-pulse rounded-full bg-gradient-to-tr blur-sm' />
              <Avatar className='border-primary/20 relative h-36 w-36 border-4 lg:h-44 lg:w-44'>
                <AvatarImage
                  src={avatarUrl || '/placeholder.svg'}
                  alt={`${name}'s avatar`}
                />
                <AvatarFallback className='text-2xl font-bold lg:text-3xl'>
                  {name[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </motion.div>

          <div className='flex-1 space-y-2'>
            <motion.div
              initial='hidden'
              animate='visible'
              variants={slideIn}
              transition={{ delay: 0.2, duration: 0.4 }}
              className='space-y-2'
            >
              <h1 className='text-3xl font-bold tracking-tight md:text-4xl'>
                {name}
              </h1>
              <p className='text-primary text-xl font-medium lg:text-2xl'>
                <Typewriter words={[title]} />
              </p>
            </motion.div>

            {dateOfBirth && (
              <motion.div
                initial='hidden'
                animate='visible'
                variants={fadeIn}
                transition={{ delay: 0.3, duration: 0.4 }}
                className='text-muted-foreground flex items-center gap-2'
              >
                <LuCalendarDays size={16} />
                <span>{getAge(new Date(dateOfBirth))} years old</span>
              </motion.div>
            )}

            <motion.div
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <div className='prose prose-sm dark:prose-invert lg:prose-base'>
                <p className='text-muted-foreground leading-relaxed'>{bio}</p>
              </div>
            </motion.div>

            <motion.div
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className='flex flex-wrap gap-2'>
                {links.github && (
                  <Button variant='outline' size='icon' asChild>
                    <Link
                      href={links.github}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label='GitHub'
                    >
                      <FaGithub size={18} />
                    </Link>
                  </Button>
                )}

                {links.discord && (
                  <Button variant='outline' size='icon' asChild>
                    <Link
                      href={links.discord}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label='Discord'
                    >
                      <FaDiscord size={18} />
                    </Link>
                  </Button>
                )}

                {links.kofi && (
                  <Button variant='outline' size='icon' asChild>
                    <Link
                      href={links.kofi}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label='Ko-fi'
                    >
                      <FaCoffee size={18} />
                    </Link>
                  </Button>
                )}

                {links.email && (
                  <Button variant='outline' size='icon' asChild>
                    <Link
                      href={links.email}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label='Email'
                    >
                      <FaEnvelope size={18} />
                    </Link>
                  </Button>
                )}

                <Button variant='outline' size='icon' asChild>
                  <Link
                    href='https://git.new/slop'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Source code'
                  >
                    <BiCode size={18} />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
