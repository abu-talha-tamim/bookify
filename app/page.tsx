import React from "react";
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import { sampleBooks } from "@/lib/constants";
import { getAllBooks } from "@/lib/actions/book.actions";

const page = async () => {
  const bookResults = await getAllBooks();
  const dbBooks = bookResults.success ? (bookResults.data ?? []) : [];

  // Show real books from DB; fall back to sample books if none exist
  const books = dbBooks.length > 0 ? dbBooks : sampleBooks;

  return (
    <main className="min-h-screen">
      <Hero />

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-8 pt-12 pb-2 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#212a3b] font-[--font-ibm-plex-serif]">
            {dbBooks.length > 0 ? "Your Library" : "Discover Books"}
          </h2>
          <p className="text-sm text-[#3d485e] mt-1">
            {dbBooks.length > 0
              ? `${dbBooks.length} book${dbBooks.length !== 1 ? "s" : ""} in your collection`
              : "Upload a PDF to start chatting with your books"}
          </p>
        </div>
      </div>

      <div className="library-hero-grid">
        {books.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            coverURL={book.coverURL}
            slug={book.slug}
          />
        ))}
      </div>
    </main>
  );
};

export default page;
