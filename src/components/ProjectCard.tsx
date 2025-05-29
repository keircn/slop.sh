'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { LuExternalLink } from 'react-icons/lu';
import { Button } from '~/components/ui/button';
import { ProjectCardProps } from '~/types/ProjectCard';

export const ProjectCard = ({
  role,
  company,
  timeline,
  description,
  logo,
  website,
}: ProjectCardProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='bg-card/90 border-border/50 mx-auto w-full max-w-6xl rounded-lg border p-6 shadow-sm'
      >
        <div className='flex h-full flex-col gap-4 md:flex-row'>
          <div className='flex-shrink-0'>
            <div className='relative h-full min-h-[8rem] w-44 overflow-hidden rounded-md'>
              <Image
                src={logo}
                alt={`${company} logo`}
                fill
                className='object-contain'
              />
            </div>
          </div>

          <div className='flex-1 space-y-3'>
            <div>
              <h3 className='text-foreground text-2xl font-bold'>{role}</h3>
              <div className='flex items-center gap-2'>
                <span className='text-foreground/80 text-lg'>{company}</span>
                <span className='text-muted-foreground'>|</span>
                <span className='text-muted-foreground text-sm'>
                  {timeline}
                </span>
              </div>
            </div>

            <p className='text-foreground/80'>{description}</p>

            <div className='flex gap-3 pt-2'>
              {website && (
                <Button
                  variant='outline'
                  className='border-primary text-primary hover:bg-primary/10 hover:text-muted-foreground bg-transparent'
                  onClick={() => window.open(website, '_blank')}
                >
                  <LuExternalLink className='mr-2 h-4 w-4' />
                  Visit Website
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
