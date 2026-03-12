"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="bg-[#fbf8f1] py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[40px] overflow-hidden shadow-2xl group min-h-[550px] lg:min-h-[750px] flex flex-col lg:flex-row items-stretch transition-transform duration-400 hover:shadow-black/20">
          {/* Main Background Image with Parallax Zoom on Hover */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/images/hero_bg.jpg"
              alt="Person reading in a library"
              fill
              className="object-cover object-[center_35%] lg:object-[center_25%] transition-transform duration-700 group-hover:scale-110"
              priority
            />
            {/* Gradient overlay for better text contrast and depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/60" />
          </div>

          {/* Three Parts with No Gap and Interactive Text */}
          <div className="relative z-10 flex flex-col lg:flex-row w-full items-stretch">
            
            {/* Part 1: Text & CTA with Hover Lift */}
            <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-20 space-y-8 text-white backdrop-blur-[1px] hover:backdrop-blur-md transition-all duration-500 group/text">
              <div className="space-y-4 transition-all duration-500 group-hover/text:translate-y-[-10px]">
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tight font-(family-name:--font-ibm-plex-serif) drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                  Your Library
                </h1>
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-medium max-w-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  Convert your books into interactive AI conversations.
                  Listen, learn, and discuss your favorite reads.
                </p>
              </div>
              
              <div className="pt-6 transition-all duration-500 group-hover/text:scale-105">
                <Link href="/books/new">
                  <Button
                    className="bg-white text-[#1a1a1a] hover:bg-[#f7e7bd] rounded-2xl h-16 px-10 text-xl font-bold font-(family-name:--font-ibm-plex-serif) shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-all border-none"
                  >
                    <Plus className="mr-3 h-6 w-6 stroke-[3px]" />
                    Add new book
                  </Button>
                </Link>
              </div>
            </div>

            {/* Part 2: Middle Spacer (Frame the subject) */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-12">
               {/* Optional: Add a subtle decorative frame or let it be pure image focus */}
            </div>

            {/* Part 3: Steps with Interactive Cards */}
            <div className="w-full lg:w-[450px] bg-black/20 backdrop-blur-lg p-8 lg:p-16 flex flex-col justify-center border-l border-white/30 group/steps">
              <ul className="space-y-16">
                {[
                  { id: "1", title: "Upload PDF", desc: "Add your favorite book file" },
                  { id: "2", title: "AI Processing", desc: "We analyze the entire content" },
                  { id: "3", title: "Voice Chat", desc: "Discuss anything with AI" }
                ].map((step, idx) => (
                  <li 
                    key={step.id} 
                    className="flex gap-6 items-start group/item transition-all duration-500 hover:translate-x-2"
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="shrink-0 w-14 h-14 rounded-2xl border-2 border-white/30 flex items-center justify-center text-xl font-bold text-white group-hover/item:border-[#f7e7bd] group-hover/item:text-[#f7e7bd] group-hover/item:bg-white/10 transition-all duration-300">
                      {step.id}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-bold text-white text-2xl mb-2 transition-colors group-hover/item:text-[#f7e7bd]">{step.title}</h3>
                      <p className="text-lg text-white/60 font-medium">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
