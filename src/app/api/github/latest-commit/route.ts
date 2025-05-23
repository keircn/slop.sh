import { NextRequest, NextResponse } from 'next/server';
import { githubLatestCommitCache, LatestCommitData } from '~/lib/github-cache';

export const dynamic = 'force-dynamic';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'N/A';
const REPO_NAME = process.env.REPO_NAME || 'slop.sh';

if (!GITHUB_TOKEN) {
    console.warn('GITHUB_TOKEN not found in environment variables');
}

const getLatestCommitQuery = `
  query getLatestCommit($username: String!, $repoName: String!) {
    repository(owner: $username, name: $repoName) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 1) {
              edges {
                node {
                  messageHeadline
                  committedDate
                  oid # Add oid for commit hash
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function fetchLatestCommit(username: string, repoName: string): Promise<LatestCommitData | null> {
    const cacheKey = `latest-commit-${username}-${repoName}`;
    const cachedData = githubLatestCommitCache.get(cacheKey);
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
                query: getLatestCommitQuery,
                variables: { username, repoName },
            }),
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with status: ${response.status}`);
        }

        const { data } = await response.json();

        if (
            !data ||
            !data.repository ||
            !data.repository.defaultBranchRef ||
            !data.repository.defaultBranchRef.target ||
            !data.repository.defaultBranchRef.target.history ||
            !data.repository.defaultBranchRef.target.history.edges ||
            data.repository.defaultBranchRef.target.history.edges.length === 0
        ) {
            console.warn('GitHub API returned invalid data for latest commit');
            return null;
        }

        const latestCommit = data.repository.defaultBranchRef.target.history.edges[0].node;
        const commitData: LatestCommitData = {
            message: latestCommit.messageHeadline,
            date: latestCommit.committedDate,
            hash: latestCommit.oid.substring(0, 7),
        };

        githubLatestCommitCache.set(cacheKey, commitData);

        return commitData;
    } catch (error) {
        console.error('Error fetching latest commit:', error);
        throw error;
    }
}

export async function GET(request: NextRequest) {
    try {
        const username = GITHUB_USERNAME;
        const latestCommitData = await fetchLatestCommit(username, REPO_NAME);

        if (!latestCommitData) {
            return NextResponse.json({ error: 'Failed to fetch latest commit data' }, { status: 404 });
        }

        return NextResponse.json(latestCommitData, {
            status: 200,
            headers: {
                'Cache-Control': 'max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        console.error('Latest commit API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch latest commit' },
            { status: 500 }
        );
    }
}
