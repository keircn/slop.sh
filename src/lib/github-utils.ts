import { ContributionDay } from '~/types/Github';

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getMonthLabels(contributionData: {
  weeks: { firstDay: string }[];
}) {
  if (!contributionData?.weeks.length) return [];

  const months: { month: string; index: number }[] = [];
  let currentMonth = '';

  contributionData.weeks.forEach((week, weekIndex) => {
    const date = new Date(week.firstDay);
    const monthName = date.toLocaleString('default', { month: 'short' });

    if (monthName !== currentMonth) {
      months.push({ month: monthName, index: weekIndex });
      currentMonth = monthName;
    }
  });

  return months;
}

export function getTooltipText(day: ContributionDay) {
  const count = day.contributionCount;
  const dateText = formatDate(day.date);

  if (count === 0) {
    return `No contributions on ${dateText}`;
  } else if (count === 1) {
    return `1 contribution on ${dateText}`;
  } else {
    return `${count} contributions on ${dateText}`;
  }
}

export function getDayOfWeekLabels() {
  return [
    { day: 'Sun', index: 0 },
    { day: 'Mon', index: 1 },
    { day: 'Tue', index: 2 },
    { day: 'Wed', index: 3 },
    { day: 'Thu', index: 4 },
    { day: 'Fri', index: 5 },
    { day: 'Sat', index: 6 },
  ];
}
