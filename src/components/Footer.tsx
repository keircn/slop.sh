"use client";

import React from "react";
import { motion } from "framer-motion";

export function Footer() {
  const footerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.footer
      className="w-full max-w-5xl mx-auto px-4 pb-8 mt-auto"
      initial="initial"
      animate="animate"
      variants={footerVariants}
    >
      <div className="border-t border-border/40 pt-8 flex flex-col items-center gap-2 text-sm text-muted-foreground">
        <p className="text-center">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/q4ow"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary/80 text-primary transition-colors"
          >
            Keiran
          </a>
        </p>
        <p className="text-xs">Last updated: 14th May, 2025</p>
      </div>
    </motion.footer>
  );
}
