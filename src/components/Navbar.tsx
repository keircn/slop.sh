"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useMobile } from "~/hooks/useMobile";
import { useNavbar } from "~/context/NavbarContext";
import { Button } from "~/components/ui/button";
import { NavClock } from "~/components/NavClock";
import { NavbarLogo } from "~/components/NavbarLogo";
import { NavbarWeather } from "~/components/NavbarWeather";
import { NavbarMobileMenu } from "~/components/NavbarMobileMenu";
import { NavbarLinks } from "~/components/NavbarLinks";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const { isNavbarVisible } = useNavbar();

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.2,
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
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 w-full pointer-events-none ${!isNavbarVisible ? "hidden" : ""}`}
    >
      <motion.header
        className="w-full backdrop-blur-md bg-background/90 border-b border-border/40 shadow-sm pointer-events-auto transition-all duration-300 ease-in-out"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ willChange: "transform, opacity" }}
      >
        <motion.div
          className="container mx-auto px-4 py-2"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-4"
              variants={itemVariants}
            >
              <NavbarLogo variants={logoVariants} />
              <NavbarLinks variants={itemVariants} />
            </motion.div>

            <motion.div
              className="hidden md:flex items-center justify-center flex-1 px-4"
              variants={itemVariants}
            >
              <div className="min-w-[85px] justify-center absolute left-1/2 -translate-x-1/2 -mx-9 hidden">
                <NavClock />
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-6 justify-end"
              variants={itemVariants}
            >
              <div className="hidden md:block h-6 w-px bg-border/40" />
              <NavbarWeather location="London,UK" />

              <div className="md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle Menu"
                  className="border border-border/40 bg-background/20"
                >
                  {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                </Button>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isOpen && isMobile && (
              <NavbarMobileMenu
                isOpen={isOpen}
                onLinkClickAction={() => setIsOpen(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>
    </div>
  );
}
