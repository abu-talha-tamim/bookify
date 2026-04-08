"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useTransition } from "react";

export function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    startTransition(() => {
      router.replace(`/?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <SearchIcon className="h-5 w-5 text-[#3d485e]" />
      </div>
      <input
        type="text"
        className="w-full bg-white border border-[#e5e7eb] rounded-full py-3 pl-10 pr-4 text-[#212a3b] focus:outline-none focus:ring-2 focus:ring-[#663820]/20 focus:border-[#663820] shadow-sm transition-all text-sm font-medium"
        placeholder="Search title or author..."
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && (
        <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#663820]"></div>
        </div>
      )}
    </div>
  );
}
