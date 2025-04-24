import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { LuExternalLink } from "react-icons/lu";
import Image from "next/image";
import { motion } from "framer-motion";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    role: string;
    company: string;
    timeline: string;
    logo: string;
    image?: string;
    website?: string;
    overview: string;
    projects?: string[];
    technologies?: string[];
    responsibilities?: string[];
  };
}

export const ProjectModal = ({
  isOpen,
  onClose,
  project,
}: ProjectModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[85vh] max-w-6xl overflow-y-auto bg-card p-0 text-card-foreground">
        <div className="relative h-64 w-full bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-96 w-96 rounded"
            >
              <Image
                src={project.image || project.logo}
                alt={`${project.company}'s ${project.image ? "image" : "logo"}`}
                fill
                className="object-contain"
              />
            </motion.div>
          </div>
        </div>

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {project.company}
            </DialogTitle>
            <div className="flex flex-col space-y-1 pt-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <div className="text-lg font-medium text-foreground/80">
                  {project.role}
                </div>
                <div className="text-sm text-muted-foreground">
                  {project.timeline}
                </div>
              </div>
              {project.website && (
                <Button
                  variant="outline"
                  className="mt-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-muted-foreground sm:mt-0"
                  onClick={() => window.open(project.website, "_blank")}
                >
                  <LuExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="mt-6 space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-foreground">
                Overview
              </h3>
              <p className="mt-2 text-foreground/80">{project.overview}</p>
            </section>

            {project.projects && project.projects.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold text-foreground">
                  Notable Projects
                </h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-foreground/80">
                  {project.projects.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold text-foreground">
                  Technologies Used
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-primary/20 px-3 py-1 text-sm text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {project.responsibilities &&
              project.responsibilities.length > 0 && (
                <section>
                  <h3 className="text-xl font-semibold text-foreground">
                    Responsibilities
                  </h3>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-foreground/80">
                    {project.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </section>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
