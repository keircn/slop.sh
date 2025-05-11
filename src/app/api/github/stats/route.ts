import { NextRequest, NextResponse } from "next/server";
import { GitHubStatsData } from "~/types/HeaderCard";
import { RepoNode } from "~/types/RepoNode";

import { githubStatsCache } from "~/lib/github-cache";

export const dynamic = "force-dynamic";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "N/A";

if (!GITHUB_TOKEN) {
  console.warn("GITHUB_TOKEN not found in environment variables");
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
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
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
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
      }
    }
  }
`;

const getSpecificRepoQuery = `
  query getSpecificRepo($username: String!, $repoName: String!) {
    repository(owner: $username, name: $repoName) {
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
`;

async function fetchGithubStats(username: string): Promise<GitHubStatsData> {
  const cachedData = githubStatsCache.get(username);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
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
      throw new Error("GitHub API returned invalid data");
    }

    const totalStars = data.user.repositories.nodes.reduce(
      (acc: number, repo: RepoNode) => acc + repo.stargazerCount,
      0,
    );

    const totalForks = data.user.repositories.nodes.reduce(
      (acc: number, repo: RepoNode) => acc + repo.forkCount,
      0,
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

    const pinnedRepositories = data.user.pinnedItems.nodes.map(
      (repo: RepoNode) => ({
        name: repo.name,
        description: repo.description,
        url: repo.url,
        stars: repo.stargazerCount,
        forks: repo.forkCount,
      }),
    );

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
        issues: data.user.contributionsCollection.totalIssueContributions,
      },
      languages: languagesArray,
      topRepositories,
      pinnedRepositories,
    };

    githubStatsCache.set(username, statsData);

    return statsData;
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    throw error;
  }
}

async function fetchSpecificRepos(
  username: string,
  repoNames: string[],
): Promise<
  Array<{
    name: string;
    description: string | null;
    url: string;
    stars: number;
    forks: number;
  }>
> {
  try {
    const processedRepoNames = repoNames.map((repo) => {
      if (repo.includes("/")) {
        return repo.split("/").pop() || repo;
      }
      return repo;
    });

    const promises = processedRepoNames.map(async (repoName) => {
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: getSpecificRepoQuery,
          variables: {
            username,
            repoName,
          },
        }),
      });

      if (!response.ok) {
        console.warn(
          `Could not fetch repo ${repoName}: Status ${response.status}`,
        );
        return null;
      }

      const { data } = await response.json();

      if (!data || !data.repository) {
        console.warn(`Repository ${repoName} not found or not accessible`);
        return null;
      }

      const repo = data.repository;
      return {
        name: repo.name,
        description: repo.description,
        url: repo.url,
        stars: repo.stargazerCount,
        forks: repo.forkCount,
      };
    });

    const results = await Promise.all(promises);

    return results.filter((repo) => repo !== null) as Array<{
      name: string;
      description: string | null;
      url: string;
      stars: number;
      forks: number;
    }>;
  } catch (error) {
    console.error("Error fetching specific repositories:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const repoNames = url.searchParams.get("repos");
    const username = GITHUB_USERNAME;

    if (repoNames) {
      const reposList = repoNames.split(",");
      const specificRepos = await fetchSpecificRepos(username, reposList);
      return NextResponse.json(specificRepos, {
        status: 200,
        headers: {
          "Cache-Control": "max-age=3600, s-maxage=3600",
        },
      });
    }

    const githubStats = await fetchGithubStats(username);
    return NextResponse.json(githubStats, {
      status: 200,
      headers: {
        "Cache-Control": "max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("GitHub stats API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub stats" },
      { status: 500 },
    );
  }
}
