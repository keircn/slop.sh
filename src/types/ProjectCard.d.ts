export interface ProjectCardProps {
  title: string;
  role: string;
  company: string;
  timeline: string;
  description: string;
  logo: string;
  image?: string;
  website?: string;
  detailedInfo?: {
    overview: string;
    projects?: string[];
    technologies?: string[];
    responsibilities?: string[];
  };
}
