"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { ProjectModal } from "~/components/ProjectModal";
import { LuExternalLink } from "react-icons/lu";
import { ProjectCardProps } from "~/types/ProjectCard";
import Image from "next/image";

export const ProjectCard = ({
  title,
  role,
  company,
  timeline,
  description,
  logo,
  image,
  website,
  detailedInfo,
}: ProjectCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full rounded-lg bg-card/90 shadow-sm border border-border/50 p-6"
      >
        <div className="flex flex-col h-full gap-4 md:flex-row">
          <div className="flex-shrink-0">
            <div className="relative h-full min-h-[8rem] w-44 overflow-hidden rounded-md border border-border/40">
              <Image
                src={logo}
                alt={`${company} logo`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{role}</h3>
              <div className="flex items-center gap-2">
                <span className="text-lg text-foreground/80">{company}</span>
                <span className="text-muted-foreground">|</span>
                <span className="text-sm text-muted-foreground">
                  {timeline}
                </span>
              </div>
            </div>

            <p className="text-foreground/80">{description}</p>

            <div className="flex gap-3 pt-2">
              {website && (
                <Button
                  variant="outline"
                  className="border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-muted-foreground"
                  onClick={() => window.open(website, "_blank")}
                >
                  <LuExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              )}

              <Button
                variant="outline"
                className="border-border bg-transparent text-foreground/80 hover:bg-accent hover:text-muted-foreground"
                onClick={() => setIsModalOpen(true)}
              >
                View More
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {detailedInfo && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={{
            title,
            role,
            company,
            timeline,
            logo,
            image,
            website,
            ...detailedInfo,
          }}
        />
      )}
    </>
  );
};
