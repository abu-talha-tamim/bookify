"use client";

import Link from "next/link";
import { BookOpenText, Library, PlusCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Navber() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Side: Branding */}
        <Link href="/" className="flex items-center gap-2 group decoration-transparent">
          <div className="p-2 bg-primary rounded-xl group-hover:scale-110 transition-transform duration-300">
            <BookOpenText className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Bookifi
          </span>
        </Link>

        {/* Right Side: Navigation */}
        <nav className="flex items-center gap-4 md:gap-8">
          <Link
            href="/library"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Library className="h-4 w-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
          <Link
            href="/books/new"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Now</span>
          </Link>
          
          <Show when="signed-out">
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" className="rounded-full text-sm font-medium">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" className="rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}
