"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
      <div className="absolute -inset-3 bg-gradient-to-r from-primary/60 via-primary/40 to-primary/20 blur-2xl opacity-60 rounded-full" />
      <Link
        href="/"
        className="relative z-[1] cursor-pointer flex items-center gap-2"
        prefetch={false}
      >
        <Image src="/slop-transparent.png" alt="Logo" width={64} height={64} />
      </Link>
    </motion.div>
  );
}
