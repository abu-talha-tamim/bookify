import { getBookBySlug } from "@/lib/actions/book.actions";
import { notFound } from "next/navigation";
import BookDetail from "@/components/BookDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BookPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const result = await getBookBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  return <BookDetail book={result.data} />;
};

export default BookPage;
