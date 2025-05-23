import { NextRequest, NextResponse } from 'next/server';
import { githubLatestCommitCache, LatestCommitData } from '~/lib/github-cache';

export const dynamic = 'force-dynamic';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'N/A';
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

async function fetchLatestCommit(
    username: string,
    repoName: string
): Promise<LatestCommitData | null> {
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
            const errorBody = await response
                .text()
                .catch(() => 'Could not read error body');
            const errorMessage = `GitHub API responded with status: ${response.status} ${response.statusText} for latest commit on ${username}/${repoName}. Body: ${errorBody}`;
            console.error(errorMessage);
            throw new Error(
                `Failed to fetch from GitHub API (status ${response.status}). Check server logs for details.`
            );
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
            const warningMessage = `GitHub API returned invalid or empty data structure for latest commit on repository '${username}/${repoName}'. This could be due to an incorrect repository name, an empty repository, no commits on the default branch, or insufficient permissions.`;
            console.warn(warningMessage);
            return null;
        }

        const latestCommit =
            data.repository.defaultBranchRef.target.history.edges[0].node;
        const commitData: LatestCommitData = {
            message: latestCommit.messageHeadline,
            date: latestCommit.committedDate,
            hash: latestCommit.oid.substring(0, 7),
        };

        githubLatestCommitCache.set(cacheKey, commitData);

        return commitData;
    } catch (error: any) {
        console.error(
            `Error fetching latest commit for ${username}/${repoName}:`,
            error.message,
            error.stack
        );
        throw error;
    }
}

export async function GET(_request: NextRequest) {
    try {
        const username = GITHUB_USERNAME;
        const latestCommitData = await fetchLatestCommit(username, REPO_NAME);

        if (!latestCommitData) {
            return NextResponse.json(
                {
                    error:
                        'Failed to fetch latest commit data. The repository might be private, not found, or have no commits.',
                },
                { status: 404 }
            );
        }

        return NextResponse.json(latestCommitData, {
            status: 200,
            headers: {
                'Cache-Control': 'max-age=3600, s-maxage=3600',
            },
        });
    } catch (error: any) {
        console.error(
            'Latest commit API error in GET handler:',
            error.message,
            error.stack
        );
        const message =
            error instanceof Error
                ? error.message
                : 'An unexpected error occurred while fetching the latest commit.';
        return NextResponse.json(
            { error: 'Failed to fetch latest commit', details: message },
            { status: 500 }
        );
    }
}
