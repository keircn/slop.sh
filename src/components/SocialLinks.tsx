"use client";

import { Button } from "~/components/ui/button";
import { FaGithub, FaEnvelope, FaDiscord, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";
import { links } from "~/lib/data/social";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
};

export function SocialLinks() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {links.map((link, i) => (
        <motion.div
          key={link.name}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <Button
            variant="outline"
            className="w-full gap-2 text-foreground/80 hover:text-primary"
            onClick={() => window.open(link.url, "_blank")}
          >
            {getLinkIcon(link.type)}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

function getLinkIcon(type: string) {
  switch (type) {
    case "github":
      return <FaGithub size={16} />;
    case "email":
      return <FaEnvelope size={16} />;
    case "discord":
      return <FaDiscord size={16} />;
    case "twitter":
      return <FaTwitter size={16} />;
    default:
      return null;
  }
}
