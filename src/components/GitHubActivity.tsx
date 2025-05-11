"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

type ContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
};

type ContributionWeek = {
  firstDay: string;
  contributionDays: ContributionDay[];
};

interface GitHubActivityProps {
  username?: string;
  isLoading?: boolean;
}

export function GitHubActivity({
  username,
  isLoading: initialLoading = false,
}: GitHubActivityProps) {
  const [contributionData, setContributionData] = useState<{
    weeks: ContributionWeek[];
    totalContributions: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left + 10; // offset from cursor
      const y = event.clientY - rect.top - 40; // position above cursor
      setTooltipPosition({ x, y });
    },
    [],
  );

  const fetchGitHubActivity = useCallback(async () => {
    if (!username) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/github/activity?username=${username}`);

      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }

      const data = await response.json();
      setContributionData(data);
    } catch (err) {
      console.error("Failed to fetch GitHub activity:", err);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchGitHubActivity();
  }, [fetchGitHubActivity]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getMonthLabels = () => {
    if (!contributionData?.weeks.length) return [];

    const months: { month: string; index: number }[] = [];
    let currentMonth = "";

    contributionData.weeks.forEach((week, weekIndex) => {
      const date = new Date(week.firstDay);
      const monthName = date.toLocaleString("default", { month: "short" });

      if (monthName !== currentMonth) {
        months.push({ month: monthName, index: weekIndex });
        currentMonth = monthName;
      }
    });

    return months;
  };

  const getTooltipText = (day: ContributionDay) => {
    const count = day.contributionCount;
    const dateText = formatDate(day.date);

    if (count === 0) {
      return `No contributions on ${dateText}`;
    } else if (count === 1) {
      return `1 contribution on ${dateText}`;
    } else {
      return `${count} contributions on ${dateText}`;
    }
  };

  const getDayOfWeekLabels = () => {
    return [
      { day: "Sun", index: 0 },
      { day: "Mon", index: 1 },
      { day: "Tue", index: 2 },
      { day: "Wed", index: 3 },
      { day: "Thu", index: 4 },
      { day: "Fri", index: 5 },
      { day: "Sat", index: 6 },
    ];
  };

  const monthLabels = getMonthLabels();
  const dayLabels = getDayOfWeekLabels();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-2 relative backdrop-blur-sm bg-card/30">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-40 h-40 border border-primary/30 rounded-full" />
          <div className="absolute top-20 -right-8 w-24 h-24 border border-primary/20 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 border border-primary/20 rounded-full" />
        </div>

        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Contribution Activity
              {isLoading && (
                <span className="ml-2 animate-pulse">Loading...</span>
              )}
            </h3>
            {contributionData && (
              <div className="text-sm text-muted-foreground">
                {contributionData.totalContributions.toLocaleString()}{" "}
                contributions in the last year
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="w-full">
              <Skeleton className="h-[160px] w-full" />
            </div>
          ) : contributionData ? (
            <div className="relative overflow-visible">
              <div className="flex">
                {/* Day of week labels */}
                <div className="flex flex-col mr-3 pt-6 text-xs text-muted-foreground shrink-0">
                  {dayLabels.map((day, index) => (
                    <div
                      key={index}
                      className="h-[12px] mb-[4px] text-right pr-3"
                    >
                      {index % 2 === 0 ? day.day : ""}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="relative flex-1 overflow-visible w-full">
                  {/* Month labels */}
                  <div className="flex mb-1 text-xs text-muted-foreground">
                    {monthLabels.map((month, i) => (
                      <div
                        key={i}
                        className="absolute text-center"
                        style={{ left: `${month.index * 16}px` }}
                      >
                        {month.month}
                      </div>
                    ))}
                  </div>

                  <div
                    className="relative flex mt-6"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    {contributionData.weeks.map((week, weekIndex) => (
                      <div
                        key={weekIndex}
                        className="flex flex-col gap-[4px] mr-[4px]"
                      >
                        {week.contributionDays.map((day, dayIndex) => (
                          <motion.div
                            key={dayIndex}
                            className="h-[12px] w-[12px] rounded-[4px] transition-colors duration-200"
                            style={{
                              backgroundColor:
                                day.contributionCount === 0
                                  ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
                                  : day.contributionCount <= 3
                                    ? "color-mix(in srgb, var(--color-primary) 30%, transparent)"
                                    : day.contributionCount <= 6
                                      ? "color-mix(in srgb, var(--color-primary) 50%, transparent)"
                                      : day.contributionCount <= 9
                                        ? "color-mix(in srgb, var(--color-primary) 70%, transparent)"
                                        : "var(--color-primary)",
                            }}
                            onMouseEnter={() => {
                              setTooltipContent(getTooltipText(day));
                              setShowTooltip(true);
                            }}
                            onMouseLeave={() => setShowTooltip(false)}
                            whileHover={{ scale: 1.3 }}
                          />
                        ))}
                      </div>
                    ))}
                    {showTooltip && (
                      <div
                        className="pointer-events-none absolute z-[100]"
                        style={{
                          top: tooltipPosition.y,
                          left: tooltipPosition.x,
                          transform: "translateY(-100%)",
                        }}
                      >
                        <div className="rounded-lg border border-border bg-popover/95 px-2 py-1 text-xs shadow-md whitespace-nowrap">
                          {tooltipContent}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-end mt-4 text-xs text-muted-foreground border-t border-border pt-4">
                    <span className="mr-2">Less</span>
                    <div className="flex gap-[3px] mx-2">
                      <div
                        className="h-[12px] w-[12px] rounded-[4px]"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                        }}
                      />
                      <div
                        className="h-[12px] w-[12px] rounded-[4px]"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--color-primary) 30%, transparent)",
                        }}
                      />
                      <div
                        className="h-[12px] w-[12px] rounded-[4px]"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--color-primary) 50%, transparent)",
                        }}
                      />
                      <div
                        className="h-[12px] w-[12px] rounded-[4px]"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--color-primary) 70%, transparent)",
                        }}
                      />
                      <div className="h-[12px] w-[12px] rounded-[4px] bg-primary" />
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[160px] flex items-center justify-center text-sm text-muted-foreground">
              No contribution data available
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
