"use client";

import { HeaderCard } from "../components/HeaderCard";
import { HeaderCardProps } from "~/lib/data/home";
import { PageTransition } from "~/components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <main className="container mx-auto flex items-center justify-center mt-16">
        <div className="max-w-4xl w-full">
          <HeaderCard {...HeaderCardProps[0]} />
        </div>
      </main>
    </PageTransition>
  );
}
