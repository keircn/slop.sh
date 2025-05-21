import type {
  ContributionData,
  ContributionDay,
  MonthLabel,
  DayLabel,
} from '~/types/GitHub';

export function getMonthLabels(
  contributionData: ContributionData
): MonthLabel[] {
  const months: MonthLabel[] = [];
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  let currentMonth = -1;
  let weekIndex = 0;

  contributionData.weeks.forEach((week: { firstDay: string }) => {
    const date: Date = new Date(week.firstDay);
    const month: number = date.getMonth();

    if (month !== currentMonth) {
      months.push({
        month: monthNames[month],
        index: weekIndex,
      });
      currentMonth = month;
    }

    weekIndex++;
  });

  return months;
}

export function getDayOfWeekLabels(): DayLabel[] {
  return [
    { day: 'Mon', index: 0 },
    { day: 'Tue', index: 1 },
    { day: 'Wed', index: 2 },
    { day: 'Thu', index: 3 },
    { day: 'Fri', index: 4 },
    { day: 'Sat', index: 5 },
    { day: 'Sun', index: 6 },
  ];
}

export function getTooltipText(day: ContributionDay): string {
  const date = new Date(day.date);
  const formattedDate = date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return `${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''} on ${formattedDate}`;
}

export function getContributionColor(
  count: number,
  colorScheme = 'default',
  customColors?: {
    level0: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  }
): string {
  if (colorScheme === 'default') {
    if (count === 0)
      return 'color-mix(in srgb, var(--color-primary) 10%, transparent)';
    if (count <= 3)
      return 'color-mix(in srgb, var(--color-primary) 30%, transparent)';
    if (count <= 6)
      return 'color-mix(in srgb, var(--color-primary) 50%, transparent)';
    if (count <= 9)
      return 'color-mix(in srgb, var(--color-primary) 70%, transparent)';
    return 'var(--color-primary)';
  }

  if (colorScheme === 'green') {
    if (count === 0) return '#ebedf0';
    if (count <= 3) return '#9be9a8';
    if (count <= 6) return '#40c463';
    if (count <= 9) return '#30a14e';
    return '#216e39';
  }

  if (colorScheme === 'blue') {
    if (count === 0) return '#ebedf0';
    if (count <= 3) return '#a5d8ff';
    if (count <= 6) return '#74c0fc';
    if (count <= 9) return '#4dabf7';
    return '#1971c2';
  }

  if (colorScheme === 'purple') {
    if (count === 0) return '#ebedf0';
    if (count <= 3) return '#d0bfff';
    if (count <= 6) return '#b197fc';
    if (count <= 9) return '#9775fa';
    return '#7048e8';
  }

  if (colorScheme === 'custom' && customColors) {
    if (count === 0) return customColors.level0;
    if (count <= 3) return customColors.level1;
    if (count <= 6) return customColors.level2;
    if (count <= 9) return customColors.level3;
    return customColors.level4;
  }

  if (count === 0)
    return 'color-mix(in srgb, var(--color-primary) 10%, transparent)';
  if (count <= 3)
    return 'color-mix(in srgb, var(--color-primary) 30%, transparent)';
  if (count <= 6)
    return 'color-mix(in srgb, var(--color-primary) 50%, transparent)';
  if (count <= 9)
    return 'color-mix(in srgb, var(--color-primary) 70%, transparent)';
  return 'var(--color-primary)';
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getContributionDateRange(): { from: string; to: string } {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  return {
    from: formatDateString(oneYearAgo),
    to: formatDateString(today),
  };
}
