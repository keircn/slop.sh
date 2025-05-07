"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { useMobile } from "~/hooks/useMobile";

interface ImageData {
  url: string;
  caption?: string;
}

const images: ImageData[] = [
  {
    url: "/clara/clara-1.jpg",
  },
  {
    url: "/clara/clara-2.jpg",
  },
  {
    url: "/clara/clara-3.jpg",
  },
  {
    url: "/clara/clara-4.jpg",
  },
  {
    url: "/clara/clara-5.jpg",
  },
];

const aboutClara =
  "Clara is the most amazing person I've ever met. From her goofy smile to her brilliant mind, she makes my every day better just by being in it. I feel incredibly lucky to have her in my life - she's not just my partner, but my best friend and bestire. She is truly beautiful, and the past year and a half has been amazing thanks to her. I love you so much, Clara.";

const thingsILove: string[] = [];

export function ShrineCard() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { isMobile } = useMobile();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col justify-center mt-12 ${isMobile ? "px-4" : ""}`}
    >
      <Card className="overflow-hidden border-2 relative backdrop-blur-sm max-w-6xl bg-card">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-40 h-40 border border-primary/30 rounded-full" />
          <div className="absolute top-20 -right-8 w-24 h-24 border border-primary/20 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 border border-primary/20 rounded-full" />
        </div>

        <CardContent className="p-6 pt-4">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-foreground mb-6 text-center"
          >
            Clara Shrine
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-lg leading-relaxed text-foreground/80 italic text-center px-4">
              {aboutClara}
            </p>
          </motion.div>

          {thingsILove.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Things I Love About Her
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                {thingsILove.map((item: string, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start space-x-2"
                  >
                    <span className="text-foreground/80">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          <motion.div
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-border"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={nextImage}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: currentImageIndex === index ? 1 : 0,
                  transition: { duration: 0.5 },
                }}
                className={`absolute inset-0 ${
                  currentImageIndex === index ? "z-10" : "z-0"
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.caption || ""}
                  width={1242}
                  height={1242}
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                  quality={100}
                />
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 20,
              }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4 z-20"
            >
              <p className="text-foreground text-sm">
                {images[currentImageIndex].caption}
              </p>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
