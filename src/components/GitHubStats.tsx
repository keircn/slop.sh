"use client";

import { motion } from "framer-motion";
import { FaCode, FaStar, FaCodeBranch } from "react-icons/fa";
import { Skeleton } from "~/components/ui/skeleton";

interface GitHubStatsProps {
  isLoading: boolean;
  stats: {
    projects: number;
    stars: number;
    contributions: number;
    pullRequests?: number;
    issues?: number;
  };
  languages?: Array<{
    name: string;
    count: number;
  }>;
}

export function GitHubStats({
  isLoading,
  stats,
  languages = [],
}: GitHubStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="border-l border-border pl-6 py-2 hidden md:flex flex-col justify-center h-full"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        GitHub Stats{" "}
        {isLoading && <span className="ml-2 animate-pulse">Loading...</span>}
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded">
            <FaCode size={16} className="text-primary" />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium">
                  {stats.projects} Repositories
                </p>
                <p className="text-xs text-muted-foreground">Created</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded">
            <FaStar size={16} className="text-primary" />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium">{stats.stars} Stars</p>
                <p className="text-xs text-muted-foreground">Received</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded">
            <FaCodeBranch size={16} className="text-primary" />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-16" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium">
                  {stats.contributions} Contributions
                </p>
                <p className="text-xs text-muted-foreground">Last year</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border w-full">
        <h4 className="text-xs font-medium text-muted-foreground mb-3">
          Top Languages
        </h4>
        {isLoading ? (
          <div className="flex flex-wrap gap-1.5">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <Skeleton key={idx} className="h-6 w-16 rounded-full" />
              ))}
          </div>
        ) : languages.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {languages.slice(0, 5).map((lang) => (
              <span
                key={lang.name}
                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
              >
                {lang.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No language data available
          </p>
        )}
      </div>
    </motion.div>
  );
}
