export interface GitHubActivityProps {
  /**
   * GitHub username to fetch activity for
   */
  username: string
  /**
   * Initial loading state
   */
  isLoading?: boolean
  /**
   * Color scheme for the contribution cells
   */
  colorScheme?: "default" | "green" | "blue" | "purple" | "custom"
  /**
   * Custom color scheme configuration (only used when colorScheme is 'custom')
   */
  customColors?: {
    level0: string
    level1: string
    level2: string
    level3: string
    level4: string
  }
  /**
   * Whether to show the contribution legend
   */
  showLegend?: boolean
  /**
   * Whether to show the total contributions count
   */
  showTotal?: boolean
  /**
   * Additional CSS classes to apply to the component
   */
  className?: string
  /**
   * Callback function when an error occurs
   */
  onError?: (error: string) => void
}

export interface ContributionDay {
  contributionCount: number
  date: string
  color: string
  weekday: number
}

export interface ContributionWeek {
  contributionDays: ContributionDay[]
  firstDay: string
}

export interface ContributionData {
  weeks: ContributionWeek[]
  totalContributions: number
}

export interface MonthLabel {
  month: string
  index: number
}

export interface DayLabel {
  day: string
  index: number
}

export interface GitHubStatsProps {
  isLoading?: boolean
  stats: {
    repositories: number
    stars: number
    contributions: number
    pullRequests?: number
    issues?: number
    forks?: number
    followers?: number
    following?: number
  }
  languages?: Array<{
    name: string
    count: number
    percentage?: number
  }>
}

export interface GitHubApiResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions?: number
          weeks?: Array<{
            contributionDays?: Array<{
              contributionCount?: number
              date?: string
              color?: string
              weekday?: number
            }>
            firstDay?: string
          }>
        }
      }
    }
  }
  errors?: Array<{
    message: string
  }>
}

export interface GitHubStatsData {
  user: {
    name: string
    login: string
    avatarUrl: string
    bio: string
    company: string | null
    location: string | null
    websiteUrl: string | null
    twitterUsername: string | null
    followers: number
    following: number
  }
  stats: {
    repositories: number
    stars: number
    forks: number
    contributions: number
    pullRequests: number
    issues: number
  }
  languages: Array<{
    name: string
    count: number
  }>
  topRepositories: Array<{
    name: string
    description: string | null
    url: string
    stars: number
    forks: number
  }>
  pinnedRepositories: Array<{
    name: string
    description: string | null
    url: string
    stars: number
    forks: number
  }>
}
