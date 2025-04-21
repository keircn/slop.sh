export interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    links: {
        github?: string;
        live?: string;
        demo?: string;
    };
    featured?: boolean;
    moreInfo?: string;
}

export const projects: Project[] = [
    {
        id: "anonhost",
        title: "AnonHost",
        description: "Fast, easy image hosting without the hassle",
        imageUrl: "https://keiran.cc/f/519d54ec-7c3d-4427-8cfe-6c770735ae2c/6c4cc287.png",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "PostgreSQL"],
        links: {
            github: "https://github.com/q4ow/anonhost",
            live: "https://anon.love",
        },
        featured: true,
        moreInfo: "This project is a full stack, feature-rich image host built with Next.js and uses PostgreSQL as the database. It is designed to be as minimal as possible with little to no overhead. This has been probably my most ambitious project to date.",
    },
    {
        id: "e-zdocs",
        title: "E-Z Docs",
        description: "Community-driven documentation for E-Z.gg",
        imageUrl: "https://keiran.cc/f/519d54ec-7c3d-4427-8cfe-6c770735ae2c/fddcd101.png",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Cloudflare"],
        links: {
            github: "https://github.com/q4ow/ezdocs",
            live: "https://e-z.wiki",
        },
        featured: true,
        moreInfo: "This project is a community-driven documentation site for E-Z.gg, a popular gaming platform. It is built with Next.js and uses PostgreSQL as the database. The site is designed to be easy to use and navigate, with a focus on providing accurate and up-to-date information.",
    },
    {
        id: "slop-sh",
        title: "slop.sh",
        description: "My personal website",
        imageUrl: "https://keiran.cc/f/519d54ec-7c3d-4427-8cfe-6c770735ae2c/0ae0b50e.png",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
        links: {
            github: "https://github.com/q4ow/slop-new",
            live: "https://slop.sh",
        },
        featured: true,
        moreInfo: "This project is my personal website, built with Next.js and Tailwind CSS. It showcases my work and provides a platform to get in touch with me. The site is designed to be fast and responsive, with a focus on providing a great user experience.",
    },
    {
        id: "typewindow",
        title: "TypeWindow",
        description: "A simple, fast, and easy to use markdown editor that never leaves your browser",
        imageUrl: "https://keiran.cc/f/519d54ec-7c3d-4427-8cfe-6c770735ae2c/bf78d8db.png",
        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
        links: {
            github: "https://gitub.com/q4ow/typewindow",
            live: "https://slop.lat",
        },
        featured: true,
        moreInfo: "This project is a simple, fast, and easy to use markdown editor that never leaves your browser. It is built with Next.js using client components and uses Tailwind CSS for styling. The editor is designed to be lightweight and fast, with a focus on providing a great user experience.",
    }
];