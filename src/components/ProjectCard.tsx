"use client";

import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaPlay } from "react-icons/fa";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Project } from "~/lib/data/projects";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "~/components/ui/dialog";

interface ProjectCardProps {
    project: Project;
    index: number;
    isInView: boolean;
}

export function ProjectCard({ project, index, isInView }: ProjectCardProps) {
    const [open, setOpen] = useState(false);
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1 * i,
                duration: 0.4,
                ease: [0.33, 1, 0.68, 1],
            },
        }),
    };

    return (
        <>
            <motion.div
                custom={index}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={variants}
            >
                <Card className="h-full overflow-hidden backdrop-blur-sm border-2 hover:border-primary/30 transition-colors">
                    <div className="relative w-full h-48">
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            className="object-cover object-top"
                            fill
                            height={0}
                            width={0}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index === 0}
                        />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                            {project.title}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-auto p-2 text-xs text-primary hover:text-primary/80 cursor-pointer active:scale-95"
                                onClick={() => setOpen(true)}
                                aria-label="Show more"
                                type="button"
                            >
                                Show more
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            {project.links.github && (
                                <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                                    <a
                                        href={project.links.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="GitHub Repository"
                                    >
                                        <FaGithub className="h-4 w-4" />
                                    </a>
                                </Button>
                            )}

                            {project.links.live && (
                                <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                                    <a
                                        href={project.links.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Live Site"
                                    >
                                        <FaExternalLinkAlt className="h-3.5 w-3.5" />
                                    </a>
                                </Button>
                            )}

                            {project.links.demo && (
                                <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                                    <a
                                        href={project.links.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Demo"
                                    >
                                        <FaPlay className="h-3.5 w-3.5" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg w-full">
                    <DialogHeader>
                        <DialogTitle>{project.title}</DialogTitle>
                        <DialogDescription>{project.description}</DialogDescription>
                    </DialogHeader>
                    <div className="relative w-full h-56 rounded-md overflow-hidden mb-4">
                        <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover object-top"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index === 0}
                        />
                    </div>
                    {project.moreInfo && (
                        <div className="mb-4 text-sm text-foreground/80">
                            {project.moreInfo}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.technologies.map((tech) => (
                            <span
                                key={tech}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        {project.links.github && (
                            <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                                <a
                                    href={project.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="GitHub Repository"
                                >
                                    <FaGithub className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                        {project.links.live && (
                            <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                                <a
                                    href={project.links.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Live Site"
                                >
                                    <FaExternalLinkAlt className="h-3.5 w-3.5" />
                                </a>
                            </Button>
                        )}
                        {project.links.demo && (
                            <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                                <a
                                    href={project.links.demo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Demo"
                                >
                                    <FaPlay className="h-3.5 w-3.5" />
                                </a>
                            </Button>
                        )}
                    </div>
                    <DialogClose asChild>
                        <Button variant="secondary" className="mt-4 w-full">Close</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
}