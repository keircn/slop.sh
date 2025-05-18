import { NextRequest, NextResponse } from 'next/server';
import { githubContributionsCache } from '~/lib/github-cache';
import { ContributionData } from '~/types/GitHub';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'N/A';

if (!GITHUB_TOKEN) {
  console.warn('GITHUB_TOKEN not found in environment variables');
}

const getContributionsQuery = `
  query getContributions($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            firstDay
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`;

async function fetchGithubContributions(
  username: string,
  fromDate: string,
  toDate: string
): Promise<ContributionData> {
  const cacheKey = `contributions-${username}-${fromDate}-${toDate}`;
  const cachedData = githubContributionsCache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getContributionsQuery,
        variables: {
          username,
          from: fromDate,
          to: toDate,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const { data } = await response.json();

    if (
      !data ||
      !data.user ||
      !data.user.contributionsCollection ||
      !data.user.contributionsCollection.contributionCalendar
    ) {
      throw new Error('GitHub API returned invalid data');
    }

    const contributionData = {
      weeks: data.user.contributionsCollection.contributionCalendar.weeks,
      totalContributions:
        data.user.contributionsCollection.contributionCalendar
          .totalContributions,
    };

    githubContributionsCache.set(cacheKey, contributionData);

    return contributionData;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get('username') || GITHUB_USERNAME;

    const toDate = new Date().toISOString();
    const fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);

    const from = url.searchParams.get('from') || fromDate.toISOString();
    const to = url.searchParams.get('to') || toDate;

    const contributionData = await fetchGithubContributions(username, from, to);

    return NextResponse.json(contributionData, {
      status: 200,
      headers: {
        'Cache-Control': 'max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('GitHub activity API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub activity' },
      { status: 500 }
    );
  }
}
