import { Suspense } from "react";
import FeedPage from "@/app/feed/page";

export default function Home() {
  return (
    <Suspense>
      <FeedPage />
    </Suspense>
  );
}
