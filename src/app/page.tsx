import { HeaderCard } from "../components/HeaderCard";
import { HeaderCardProps } from "~/lib/data/home";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <HeaderCard
          {...HeaderCardProps[0]}
        />
      </div>
    </main>
  );
}
