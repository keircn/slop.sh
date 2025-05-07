"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface NavbarLinksProps {
  variants?: Variants;
}

const links = [
  { href: "/contact", label: "Contact" },
  { href: "/clara", label: "Clara" },
] as const;

export function NavbarLinks({ variants }: NavbarLinksProps) {
  return (
    <div className="hidden md:flex items-center space-x-6 ml-6">
      {links.map((link) => (
        <motion.a
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          variants={variants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {link.label}
        </motion.a>
      ))}
    </div>
  );
}
