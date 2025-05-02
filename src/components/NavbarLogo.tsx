"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface NavbarLogoProps {
  variants?: Variants;
}

export function NavbarLogo({ variants }: NavbarLogoProps) {
  return (
    <motion.div
      variants={variants}
      className="relative font-semibold text-xl"
      style={{ transform: "none" }}
    >
      <div className="absolute -inset-3 bg-gradient-to-r from-primary/50 to-primary/10 blur-lg opacity-60 rounded-full pointer-events-none" />
      <Link href="/" className="relative z-[1] cursor-pointer" prefetch={false}>
        <span className="block p-2">Keiran</span>
      </Link>
    </motion.div>
  );
}
