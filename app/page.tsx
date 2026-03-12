import React from "react";
import Hero from "@/components/Hero";
import BookCard from "@/components/BookCard";
import { sampleBooks } from "@/lib/constants";

const page = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="library-hero-grid">
        {
          sampleBooks.map((book) => (
            <BookCard key={book._id} title={book.title} author={book.author} coverURL={book.coverURL} slug={book.slug} />
          ))
        }
      </div>
    </main>
  );
};

export default page;
