"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { NavClock } from "./NavClock";

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
        when: "beforeChildren",
        staggerChildren: 0.1,
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

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
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
      className="md:hidden pt-4 pb-2 border-t border-border/20 mt-2"
    >
      <nav className="flex flex-col space-y-1">
        <motion.div
          variants={itemVariants}
          className="flex justify-center my-2"
        >
          <NavClock />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="flex items-center text-sm font-medium transition-colors hover:text-primary px-3 py-2.5 rounded-md hover:bg-accent/50"
            onClick={onLinkClick}
          >
            Home
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            href="/contact"
            className="flex items-center text-sm font-medium transition-colors hover:text-primary px-3 py-2.5 rounded-md hover:bg-accent/50"
            onClick={onLinkClick}
          >
            Contact
          </Link>
        </motion.div>
      </nav>
    </motion.div>
  );
}
