import { BookCardProps } from "@/types";
import Link from "next/link";
import Image from "next/image";

const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  return (
    <Link href={`/books/${slug}`} className="group">
      <article className="book-card">
        <div className="book-card-cover-wrapper">
          <Image
            src={coverURL}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="book-card-overlay" />
        </div>
        <div className="book-card-info">
          <h3 className="book-card-title">{title}</h3>
          <p className="book-card-author">by {author}</p>
        </div>
      </article>
    </Link>
  );
};

export default BookCard;