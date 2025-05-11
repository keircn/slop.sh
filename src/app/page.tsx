"use client";

import dynamic from "next/dynamic";
import { HeaderCardProps } from "~/lib/data/home";
import { PageTransition } from "~/components/PageTransition";
import { Suspense } from "react";
import { Card } from "~/components/ui/card";
import { Footer } from "~/components/Footer";
import { GitHubActivity } from "~/components/GitHubActivity";

const HeaderCard = dynamic(
  () =>
    import("~/components/HeaderCard").then((mod) => ({
      default: mod.HeaderCard,
    })),
  {
    loading: () => (
      <Card className="w-full h-[600px] animate-pulse bg-primary/5" />
    ),
    ssr: false,
  },
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ProjectsContainer = dynamic(
  () =>
    import("~/components/ProjectsContainer").then((mod) => ({
      default: mod.ProjectsContainer,
    })),
  {
    loading: () => (
      <Card className="w-full h-[400px] animate-pulse bg-primary/5" />
    ),
  },
);

export default function Home() {
  return (
    <PageTransition>
      <main className="relative min-h-screen w-full flex flex-col">
        <div className="container mx-auto flex flex-col items-center justify-center mt-16 pb-16 flex-grow">
          <div className="max-w-6xl w-full relative z-10 mt-16">
            <Suspense
              fallback={
                <Card className="w-full h-[600px] animate-pulse bg-primary/5" />
              }
            >
              <span id="header" />
              <HeaderCard {...HeaderCardProps[0]} />
            </Suspense>

            <div className="mt-8">
              <Suspense
                fallback={
                  <Card className="w-full h-[200px] animate-pulse bg-primary/5" />
                }
              >
                <GitHubActivity username={HeaderCardProps[0].githubUsername || ""} />
              </Suspense>
            </div>
          </div>
        </div>
        <span id="footer" />
        <Footer />
      </main>
    </PageTransition>
  );
}
