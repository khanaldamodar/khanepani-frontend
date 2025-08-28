// "use client";
import SearchComponent from "@/components/global/SearchPage";
import { Suspense,} from "react";
export default function SearchPage() {
  return (

    <Suspense fallback={<div className="p-4">Loading search page...</div>}>
    <SearchComponent/>
    </Suspense>
  );
}
