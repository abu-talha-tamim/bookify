"use client";

import { Messages } from "@/types";
import { Mic } from "lucide-react";
import { useEffect, useRef } from "react";

interface TranscriptProps {
  messages: Messages[];
  currentMessage: string;
  currentUserMessage: string;
}

export const Transcript = ({
  messages,
  currentMessage,
  currentUserMessage,
}: TranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentMessage, currentUserMessage]);

  const isEmpty =
    messages.length === 0 && !currentMessage && !currentUserMessage;

  return (
    <div className="vapi-transcript-wrapper">
      <div className="transcript-container">
        {isEmpty ? (
          <div className="transcript-empty">
            <Mic className="w-12 h-12 text-[#663820] mb-4" />
            <h3 className="transcript-empty-text">No conversation yet</h3>
            <p className="transcript-empty-hint">
              Click the mic button above to start talking
            </p>
          </div>
        ) : (
          <div className="transcript-messages" ref={scrollRef}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`transcript-message ${
                  msg.role === "user"
                    ? "transcript-message-user"
                    : "transcript-message-assistant"
                }`}
              >
                <div
                  className={`transcript-bubble ${
                    msg.role === "user"
                      ? "transcript-bubble-user"
                      : "transcript-bubble-assistant"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Streaming User Message */}
            {currentUserMessage && (
              <div className="transcript-message transcript-message-user">
                <div className="transcript-bubble transcript-bubble-user">
                  {currentUserMessage}
                  <span className="transcript-cursor" />
                </div>
              </div>
            )}

            {/* Streaming Assistant Message */}
            {currentMessage && (
              <div className="transcript-message transcript-message-assistant">
                <div className="transcript-bubble transcript-bubble-assistant">
                  {currentMessage}
                  <span className="transcript-cursor" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
