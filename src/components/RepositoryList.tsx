"use client";

import { motion } from "framer-motion";
import { FaStar, FaCodeBranch } from "react-icons/fa";
import { Skeleton } from "~/components/ui/skeleton";

interface Repository {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
}

interface RepositoryListProps {
  repositories?: Repository[];
  pinnedRepositories?: Repository[];
  customRepositories?: Repository[];
  isLoading: boolean;
  usePinnedRepos?: boolean;
}

export function RepositoryList({
  repositories,
  customRepositories = [],
  isLoading,
  usePinnedRepos = false,
}: RepositoryListProps) {
  const displayRepositories = usePinnedRepos
    ? customRepositories && customRepositories.length > 0
      ? customRepositories
      : []
    : repositories;
  const displayTitle = usePinnedRepos
    ? "Featured Repositories"
    : "Top Repositories";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      className="mt-6 pt-6 border-t border-border"
    >
      <h3 className="text-sm font-medium mb-3">{displayTitle}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {isLoading ? (
          <>
            {Array(4)
              .fill(0)
              .map((_, idx) => (
                <RepositorySkeleton key={idx} />
              ))}
          </>
        ) : displayRepositories && displayRepositories.length > 0 ? (
          displayRepositories.slice(0, 4).map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-border rounded-lg hover:bg-primary/5 transition-colors"
            >
              <h4 className="font-medium text-sm">{repo.name}</h4>
              {repo.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {repo.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FaStar size={12} />
                  {repo.stars}
                </span>
                <span className="flex items-center gap-1">
                  <FaCodeBranch size={12} />
                  {repo.forks}
                </span>
              </div>
            </a>
          ))
        ) : (
          <div className="p-3 border border-border rounded-lg col-span-2 text-center text-sm text-muted-foreground">
            No repositories found
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RepositorySkeleton() {
  return (
    <div className="p-3 border border-border rounded-lg">
      <Skeleton className="h-5 w-1/2 mb-2" />
      <Skeleton className="h-3 w-5/6 mb-3" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
