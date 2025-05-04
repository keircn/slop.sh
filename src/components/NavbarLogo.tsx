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
      <div className="absolute -inset-2 bg-gradient-to-r from-primary/60 via-primary/40 to-primary/20 blur-xl opacity-50 rounded-full" />
      <Link
        href="/"
        className="relative z-[1] cursor-pointer flex items-center gap-2 group"
        prefetch={false}
      >
        <div className="relative overflow-hidden ml-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="/slop-transparent.png"
              alt="Logo"
              width={50}
              height={50}
              className="transition-all duration-300 group-hover:brightness-110"
            />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
