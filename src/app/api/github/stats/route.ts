import { NextResponse } from 'next/server';
import githubCache from '~/lib/github-cache';
import { GitHubStatsData } from '~/types/HeaderCard';
import { RepoNode } from '~/types/RepoNode';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'N/A';

if (!GITHUB_TOKEN) {
    console.warn('GITHUB_TOKEN not found in environment variables');
}

const getUserStatsQuery = `
  query getUserStats($username: String!) {
    user(login: $username) {
      name
      login
      avatarUrl
      bio
      company
      location
      websiteUrl
      twitterUsername
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories(first: 100, ownerAffiliations: [OWNER], privacy: PUBLIC, orderBy: { field: STARGAZERS, direction: DESC }) {
        totalCount
        nodes {
          name
          description
          url
          stargazerCount
          forkCount
          languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              node {
                name
              }
            }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
      }
    }
  }
`;

async function fetchGithubStats(username: string): Promise<GitHubStatsData> {
    const cachedData = githubCache.get(username);
    if (cachedData) {
        console.log(`Using cached GitHub data for user: ${username}`);
        return cachedData;
    }

    console.log(`Fetching fresh GitHub data for user: ${username}`);
    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: getUserStatsQuery,
                variables: { username },
            }),
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with status: ${response.status}`);
        }

        const { data } = await response.json();

        if (!data || !data.user) {
            throw new Error('GitHub API returned invalid data');
        }

        const totalStars = data.user.repositories.nodes.reduce(
            (acc: number, repo: RepoNode) => acc + repo.stargazerCount,
            0
        );

        const totalForks = data.user.repositories.nodes.reduce(
            (acc: number, repo: RepoNode) => acc + repo.forkCount,
            0
        );

        const languages: Record<string, number> = {};
        data.user.repositories.nodes.forEach((repo: RepoNode) => {
            repo.languages.edges.forEach((edge: { node: { name: string } }) => {
                const langName = edge.node.name;
                languages[langName] = (languages[langName] || 0) + 1;
            });
        });

        const languagesArray = Object.entries(languages)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
        const topRepositories = data.user.repositories.nodes
            .slice(0, 5)
            .map((repo: RepoNode) => ({
                name: repo.name,
                description: repo.description,
                url: repo.url,
                stars: repo.stargazerCount,
                forks: repo.forkCount,
            }));

        const statsData: GitHubStatsData = {
            user: {
                name: data.user.name,
                login: data.user.login,
                avatarUrl: data.user.avatarUrl,
                bio: data.user.bio,
                company: data.user.company,
                location: data.user.location,
                websiteUrl: data.user.websiteUrl,
                twitterUsername: data.user.twitterUsername,
                followers: data.user.followers.totalCount,
                following: data.user.following.totalCount,
            },
            stats: {
                repositories: data.user.repositories.totalCount,
                stars: totalStars,
                forks: totalForks,
                contributions:
                    data.user.contributionsCollection.totalCommitContributions,
                pullRequests:
                    data.user.contributionsCollection.totalPullRequestContributions,
                issues:
                    data.user.contributionsCollection.totalIssueContributions,
            },
            languages: languagesArray,
            topRepositories,
        };

        githubCache.set(username, statsData);

        return statsData;
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        throw error;
    }
}

export const revalidate = 3600;

export async function GET() {
    try {
        const username = GITHUB_USERNAME;
        const githubStats = await fetchGithubStats(username);

        return NextResponse.json(githubStats, { status: 200 });
    } catch (error) {
        console.error('GitHub stats API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch GitHub stats' },
            { status: 500 }
        );
    }
}