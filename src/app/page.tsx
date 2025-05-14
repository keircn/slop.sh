'use client';

import dynamic from 'next/dynamic';
import { HeaderCardProps } from '~/lib/data/home';
import { PageTransition } from '~/components/PageTransition';
import { Suspense } from 'react';
import { Card } from '~/components/ui/card';
import { Footer } from '~/components/Footer';
import { GitHubActivity } from '~/components/GitHubActivity';

const HeaderCard = dynamic(
  () =>
    import('~/components/HeaderCard').then((mod) => ({
      default: mod.HeaderCard,
    })),
  {
    loading: () => (
      <Card className='bg-primary/5 h-[600px] w-full animate-pulse' />
    ),
    ssr: false,
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProjectsContainer = dynamic(
  () =>
    import('~/components/ProjectsContainer').then((mod) => ({
      default: mod.ProjectsContainer,
    })),
  {
    loading: () => (
      <Card className='bg-primary/5 h-[400px] w-full animate-pulse' />
    ),
  }
);

export default function Home() {
  return (
    <PageTransition>
      <main className='relative flex min-h-screen w-full flex-col'>
        <div className='container mx-auto mt-16 flex flex-grow flex-col items-center justify-center pb-16'>
          <div className='relative z-10 mt-16 w-full max-w-6xl'>
            <Suspense
              fallback={
                <Card className='bg-primary/5 h-[600px] w-full animate-pulse' />
              }
            >
              <span id='header' />
              <HeaderCard {...HeaderCardProps[0]} />
            </Suspense>

            <div className='mt-8'>
              <Suspense
                fallback={
                  <Card className='bg-primary/5 h-[200px] w-full animate-pulse' />
                }
              >
                <GitHubActivity
                  username={HeaderCardProps[0].githubUsername || ''}
                />
              </Suspense>
            </div>
          </div>
        </div>
        <span id='footer' />
        <Footer />
      </main>
    </PageTransition>
  );
}
