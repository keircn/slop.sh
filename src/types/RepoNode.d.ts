export type RepoNode = {
    name: string;
    description: string | null;
    url: string;
    stargazerCount: number;
    forkCount: number;
    languages: {
        edges: Array<{
            node: {
                name: string;
            };
        }>;
    };
};