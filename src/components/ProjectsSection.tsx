"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ProjectCard } from "~/components/ProjectCard";
import { projects } from "~/lib/data/projects";

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="mt-16"
    >
      <Card className="overflow-hidden border-2 relative backdrop-blur-sm">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-40 h-40 border border-primary/30 rounded-full" />
          <div className="absolute top-20 -right-8 w-24 h-24 border border-primary/20 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 border border-primary/20 rounded-full" />
        </div>

        <CardHeader>
          <CardTitle className="text-2xl">Projects</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isInView={isInView}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
