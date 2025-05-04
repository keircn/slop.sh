"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useMobile } from "~/hooks/useMobile";
import { useScrollDirection } from "~/hooks/useScrollDirection";
import { Button } from "~/components/ui/button";
import { NavClock } from "~/components/NavClock";
import { NavbarLogo } from "~/components/NavbarLogo";
import { NavbarWeather } from "~/components/NavbarWeather";
import { NavbarMobileMenu } from "~/components/NavbarMobileMenu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const { isScrolledDown } = useScrollDirection();

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

  return (
    <div className="sticky top-0 z-50 w-full mt-8">
      <motion.header
        className={`w-full backdrop-blur-sm bg-background/50 border rounded border-border/40 max-w-4xl mx-auto px-4 ${isMobile ? "px-2" : ""}`}
        initial={{ y: 0, scale: 1 }}
        animate={{
          scale: isMobile ? 1 : isScrolledDown ? 1 : 1.15,
          y: 0,
        }}
        transition={{ duration: 0.2 }}
        style={{ transformStyle: "flat", transform: "translate3d(0,0,0)" }}
      >
        <motion.div
          className="container mx-auto px-4 py-3"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <NavbarLogo variants={logoVariants} />
              <div className="w-0.5 h-16 bg-border/40 ml-8 mr-2" />
              {/* <div className="flex items-center gap-4">
                {[
                  { href: "/contact", label: "Contact" },
                ].map((link) => (
                  <Button key={link.href} variant="ghost" asChild>
                    <Link href={link.href} className="text-lg font-semibold">
                      {link.label}
                    </Link>
                  </Button>
                ))}
              </div> */}
            </div>

            <div className="hidden md:flex flex-1 justify-center">
              <NavClock />
            </div>

            <div className="flex items-center gap-4">
              <NavbarWeather location="London,UK" />

              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Toggle Menu"
                >
                  {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && isMobile && (
              <NavbarMobileMenu
                isOpen={isOpen}
                onLinkClick={() => setIsOpen(false)}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>
    </div>
  );
}
