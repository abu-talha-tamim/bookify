"use client";

import { useVapi } from "@/hooks/useVapi";
import { IBook } from "@/types";
import { formatDuration } from "@/lib/utils";
import { Mic, MicOff } from "lucide-react";
import Image from "next/image";
import { Transcript } from "./Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    toggleCall,
    maxDurationSeconds,
    limitError,
  } = useVapi(book);

  const isConnected = status !== "idle" && status !== "connecting";

  // Helper for status indicator display
  const getStatusDisplay = () => {
    if (limitError) return { label: "Limit Exceeded", color: "bg-red-500" };
    switch (status) {
      case "connecting":
        return { label: "Connecting...", color: "bg-amber-400 animate-pulse" };
      case "speaking":
      case "listening":
      case "talking":
        return { label: "Live", color: "bg-green-500 animate-pulse" };
      case "thinking":
        return { label: "Thinking...", color: "bg-blue-400 animate-pulse" };
      default:
        return { label: "Ready", color: "bg-slate-400" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header Card */}
      <div className="vapi-header-card shadow-md">
        <div className="vapi-book-cover-wrapper">
          <Image
            src={book.coverURL}
            alt={book.title}
            width={140}
            height={200}
            className="vapi-book-cover"
            priority
          />
          <button
            onClick={toggleCall}
            className={`vapi-mic-btn ${
              isConnected ? "text-red-500" : "text-[#212a3b]"
            }`}
            aria-label={isConnected ? "End Call" : "Start Call"}
          >
            {isConnected ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <div>
            <h1 className="text-3xl font-bold font-serif text-[#212a3b] mb-1">
              {book.title}
            </h1>
            <p className="text-[#3d485e] font-medium">by {book.author}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="vapi-status-indicator shadow-sm">
              <span className={`vapi-status-dot ${statusDisplay.color}`} />
              <span className="vapi-status-text">{statusDisplay.label}</span>
            </div>

            <div className="vapi-status-indicator shadow-sm">
              <span className="vapi-status-text">
                Voice: {book.persona || "Daniel"}
              </span>
            </div>

            <div className="vapi-status-indicator shadow-sm">
              <span className="vapi-status-text">
                {formatDuration(duration)}/{formatDuration(maxDurationSeconds)}
              </span>
            </div>
          </div>
          
          {limitError && (
              <p className="text-red-600 text-sm font-medium mt-1">
                  {limitError}
              </p>
          )}
        </div>
      </div>


      {/* Transcript Section */}
      <div className="w-full max-w-4xl">
         <Transcript
            messages={messages}
            currentMessage={currentMessage}
            currentUserMessage={currentUserMessage}
          />
      </div>
    </div>
  );
};

export default VapiControls;