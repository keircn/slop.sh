import { HeaderCard } from "../components/HeaderCard";
import { HeaderCardProps } from "~/lib/data/home";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full">
        <HeaderCard {...HeaderCardProps[0]} />
      </div>
    </main>
  );
}
