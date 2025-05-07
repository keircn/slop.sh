"use client";

import React from "react";
import { PageTransition } from "~/components/PageTransition";
import { ShrineCard } from "~/components/ShrineCard";
import { useNavbar } from "~/context/NavbarContext";

export default function ClaraPage() {
  const { setNavbarVisible } = useNavbar();

  React.useEffect(() => {
    setNavbarVisible(true);
    return () => setNavbarVisible(true);
  }, [setNavbarVisible]);

  return (
    <PageTransition>
      <main className="relative min-h-screen w-full">
        <div className="flex items-center justify-center mt-16">
          <ShrineCard />
        </div>
      </main>
    </PageTransition>
  );
}
