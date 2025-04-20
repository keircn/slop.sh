"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { FaGithub, FaEnvelope, FaCoffee, FaDiscord } from "react-icons/fa";
import { ProfileInfoProps } from "~/types/ProfileInfo";

export function ProfileInfo({
  name,
  title,
  bio,
  avatarUrl,
  links,
  githubUsername,
}: ProfileInfoProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col items-center space-y-6 md:flex-row md:space-y-0 md:space-x-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="relative"
        >
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary/30 to-primary/10 rounded-full blur-sm animate-pulse" />
          <Avatar className="h-32 w-32 border-4 border-primary/20 relative">
            <AvatarImage src={avatarUrl} alt={`${name}'s avatar`} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
        </motion.div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">
              {name}
              {githubUsername && (
                <span className="text-lg text-muted-foreground font-normal ml-2">
                  @{githubUsername}
                </span>
              )}
            </h1>
            <p className="text-lg text-muted-foreground">{title}</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-muted-foreground"
          >
            {bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-2 md:justify-start"
          >
            {links.github && (
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <a
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={16} />
                </a>
              </Button>
            )}

            {links.discord && (
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <a
                  href={links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDiscord size={16} />
                </a>
              </Button>
            )}

            {links.kofi && (
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <a href={links.kofi} target="_blank" rel="noopener noreferrer">
                  <FaCoffee size={16} />
                </a>
              </Button>
            )}

            {links.email && (
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <a href={links.email}>
                  <FaEnvelope size={16} />
                </a>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
