"use client";

import { HeaderCard } from "../components/HeaderCard";
import { HeaderCardProps } from "~/lib/data/home";
import { PageTransition } from "~/components/PageTransition";
import { ProjectsContainer } from "~/components/ProjectsContainer";
import { projects } from "~/lib/data/projects";

export default function Home() {
  return (
    <PageTransition>
      <main className="container mx-auto flex flex-col items-center justify-center mt-16 pb-16">
        <div className="max-w-6xl w-full">
          <HeaderCard {...HeaderCardProps[0]} />
          <ProjectsContainer projects={projects} title="Projects" />
        </div>
      </main>
    </PageTransition>
  );
}
