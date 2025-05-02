"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NavbarMobileMenuProps {
  isOpen: boolean;
  onLinkClick: () => void;
}

export function NavbarMobileMenu({
  isOpen,
  onLinkClick,
}: NavbarMobileMenuProps) {
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  };

  if (!isOpen) return null;

  return (
    <motion.div
      variants={mobileMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="md:hidden pt-4 pb-2"
    >
      <nav className="flex flex-col space-y-4">
        <Link
          href="/"
          className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5 rounded-md hover:bg-accent/50"
          onClick={onLinkClick}
        >
          Home
        </Link>
        <Link
          href="/contact"
          className="text-sm font-medium transition-colors hover:text-primary px-2 py-1.5 rounded-md hover:bg-accent/50"
          onClick={onLinkClick}
        >
          Contact
        </Link>
      </nav>
    </motion.div>
  );
}
