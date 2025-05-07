"use client";

import dynamic from "next/dynamic";
import { HeaderCardProps } from "~/lib/data/home";
import { PageTransition } from "~/components/PageTransition";
import { Suspense } from "react";
import { Card } from "~/components/ui/card";
import { Footer } from "~/components/Footer";

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
              <HeaderCard {...HeaderCardProps[0]} />
            </Suspense>
            <Suspense
              fallback={
                <Card className="w-full h-[400px] animate-pulse bg-primary/5" />
              }
            >
              {/* <ProjectsContainer projects={projects} title="Projects" /> */}
            </Suspense>
          </div>
        </div>
        <Footer />
      </main>
    </PageTransition>
  );
}
