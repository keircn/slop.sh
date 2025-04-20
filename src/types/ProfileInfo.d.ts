export interface ProfileInfoProps {
    name: string;
    githubName?: string | null;
    title: string;
    bio: string;
    avatarUrl: string;
    links: {
        github?: string;
        discord?: string;
        email?: string;
        kofi?: string;
    };
}