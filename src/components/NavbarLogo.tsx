"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { FaUser } from "react-icons/fa";

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
      <Link href="/" className="relative z-[1] cursor-pointer flex items-center gap-2" prefetch={false}>
        <FaUser />
      </Link>
    </motion.div>
  );
}
