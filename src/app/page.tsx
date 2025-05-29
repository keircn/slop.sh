import { Suspense } from 'react';
import { HeaderCardProps } from '~/lib/data/home';
import { Card } from '~/components/ui/card';
import { HomePage } from '~/components/HomePage';
import type { GitHubStatsData } from '~/types/GitHub';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${HeaderCardProps[0].name} | ${HeaderCardProps[0].title}`,
  description: HeaderCardProps[0].bio || `Portfolio of ${HeaderCardProps[0].name}, a ${HeaderCardProps[0].title}`,
  keywords: [
    'developer',
    'portfolio',
    'full stack',
    'typescript',
    'react',
    'nextjs',
    HeaderCardProps[0].name.toLowerCase(),
  ],
  authors: [{ name: HeaderCardProps[0].name }],
  creator: HeaderCardProps[0].name,
  openGraph: {
    title: `${HeaderCardProps[0].name} | ${HeaderCardProps[0].title}`,
    description: HeaderCardProps[0].bio || `Portfolio of ${HeaderCardProps[0].name}, a ${HeaderCardProps[0].title}`,
    url: 'https://slop.sh',
    siteName: `${HeaderCardProps[0].name}'s Portfolio`,
    images: [
      {
        url: HeaderCardProps[0].avatarUrl,
        width: 400,
        height: 400,
        alt: `${HeaderCardProps[0].name}'s Avatar`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `${HeaderCardProps[0].name} | ${HeaderCardProps[0].title}`,
    description: HeaderCardProps[0].bio || `Portfolio of ${HeaderCardProps[0].name}, a ${HeaderCardProps[0].title}`,
    images: [HeaderCardProps[0].avatarUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function getInitialGitHubData(): Promise<GitHubStatsData | null> {
  if (!HeaderCardProps[0].links?.github) {
    return null;
  }

  try {
    // In production, we can pre-fetch GitHub data on the server
    // For development, we'll return null to let the client fetch
    if (process.env.NODE_ENV === 'development') {
      return null;
    }

    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/github/stats`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GitHub data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Failed to pre-fetch GitHub data:', error);
    return null;
  }
}

export default async function Home() {
  const initialGitHubData = await getInitialGitHubData();

  return (
    <Suspense
      fallback={
        <Card className='bg-primary/5 h-screen w-full animate-pulse' />
      }
    >
      <HomePage initialGitHubData={initialGitHubData} />
    </Suspense>
  );
}
