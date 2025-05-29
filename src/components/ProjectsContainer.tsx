'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ProjectCard } from '~/components/ProjectCard';
import { ProjectsContainerProps } from '~/types/ProjectCard';

export const ProjectsContainer = ({
  title,
  projects,
}: ProjectsContainerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial='hidden'
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className='relative mt-12 flex flex-col justify-center'
    >
      <section className='w-full py-12'>
        <div className='container mx-auto px-4'>
          <motion.h2
            variants={itemVariants}
            className='text-foreground mb-8 text-center text-4xl font-bold'
          >
            {title}
          </motion.h2>
          <motion.div
            variants={containerVariants}
            className='grid gap-6 md:grid-cols-1 lg:grid-cols-1'
          >
            {projects.map((project, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};
