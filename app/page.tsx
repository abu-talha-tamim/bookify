import React from "react";
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import { getAllBooks } from "@/lib/actions/book.actions";
import { Search } from "@/components/Search";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const params = await searchParams;
  const searchQuery = (params.query as string) || "";
  
  const bookResults = await getAllBooks(searchQuery);
  const dbBooks = bookResults.success ? (bookResults.data ?? []) : [];

  return (
    <main className="min-h-screen">
      <Hero />

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-8 pt-12 pb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#212a3b] font-serif">
            {searchQuery ? `Search Results for "${searchQuery}"` : (dbBooks.length > 0 ? "Your Library" : "Discover Books")}
          </h2>
          <p className="text-sm text-[#3d485e] mt-1">
            {dbBooks.length > 0
              ? `${dbBooks.length} book${dbBooks.length !== 1 ? "s" : ""} found`
              : searchQuery ? "No books match your search." : "Upload a PDF to start chatting with your books"}
          </p>
        </div>

        <Search />
      </div>

      <div className="library-hero-grid">
        {dbBooks.map((book: any) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
      
      {dbBooks.length === 0 && searchQuery && (
          <div className="w-full flex flex-col items-center justify-center py-20">
              <span className="text-6xl mb-4">📖</span>
              <p className="text-[#3d485e] text-lg font-medium">We couldn't find any books matching your search.</p>
              <button 
                onClick={() => {}} // This should be handled by clearing input or direct link
                className="text-[#663820] font-bold mt-2 hover:underline"
              >
                  Clear all filters
              </button>
          </div>
      )}
    </main>
  );
};

export default page;
