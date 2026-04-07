"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Vapi from "@vapi-ai/web";
import {
  Mic,
  MicOff,
  PhoneOff,
  Phone,
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, getVoice } from "@/lib/utils";
import { searchBookSegments } from "@/lib/actions/book.actions";
import { toast } from "sonner";

interface Book {
  _id: string;
  title: string;
  author: string;
  persona?: string;
  coverURL: string;
  fileURL: string;
  totalSegments: number;
  createdAt: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type CallStatus = "idle" | "connecting" | "active" | "ended";

const BookDetail = ({ book }: { book: Book }) => {
  const vapiRef = useRef<Vapi | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "info">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voice = getVoice(book.persona);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize VAPI
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      console.warn("VAPI public key not set");
      return;
    }

    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setCallStatus("active");
      setMessages([
        {
          role: "assistant",
          content: `Hello! I've read "${book.title}" by ${book.author}. Ask me anything about the book — themes, characters, key insights, or anything else you'd like to explore!`,
          timestamp: new Date(),
        },
      ]);
    });

    vapi.on("call-end", () => {
      setCallStatus("ended");
      setIsSpeaking(false);
      setIsUserSpeaking(false);
    });

    vapi.on("speech-start", () => setIsSpeaking(true));
    vapi.on("speech-end", () => setIsSpeaking(false));

    vapi.on("message", (msg: { type: string; role?: string; transcript?: string; transcriptType?: string }) => {
      if (msg.type === "transcript" && msg.transcriptType === "final") {
        const role = msg.role === "user" ? "user" : "assistant";
        setMessages((prev) => [
          ...prev,
          { role, content: msg.transcript || "", timestamp: new Date() },
        ]);
        if (msg.role === "user") setIsUserSpeaking(false);
      }
      if (msg.type === "transcript" && msg.transcriptType === "partial" && msg.role === "user") {
        setIsUserSpeaking(true);
      }
    });

    vapi.on("error", (err: Error) => {
      console.error("VAPI error:", err);
      toast.error("Voice connection error. Please try again.");
      setCallStatus("idle");
    });

    return () => {
      vapi.stop();
    };
  }, [book.title, book.author]);

  const startCall = async () => {
    if (!vapiRef.current) {
      toast.error("Voice assistant is not configured. Please set NEXT_PUBLIC_VAPI_PUBLIC_KEY.");
      return;
    }

    const assistantId = process.env.NEXT_PUBLIC_ASSISTANT_ID;
    if (!assistantId) {
      toast.error("Assistant ID not configured.");
      return;
    }

    setCallStatus("connecting");

    try {
      // Fetch relevant book content for context
      const contextResult = await searchBookSegments(book._id, book.title, 3);
      const contextSnippets = contextResult.success && contextResult.data
        ? (contextResult.data as { content: string }[]).slice(0, 3).map((s) => s.content).join("\n\n---\n\n")
        : "";

      await vapiRef.current.start(assistantId, {
        variableValues: {
          bookTitle: book.title,
          bookAuthor: book.author,
          voiceId: voice.id,
          contextSnippets,
        },
      });
    } catch (err) {
      console.error("Failed to start call:", err);
      toast.error("Failed to start voice session. Please try again.");
      setCallStatus("idle");
    }
  };

  const endCall = () => {
    vapiRef.current?.stop();
    setCallStatus("ended");
  };

  const toggleMute = () => {
    if (!vapiRef.current) return;
    const newMuted = !isMuted;
    vapiRef.current.setMuted(newMuted);
    setIsMuted(newMuted);
  };

  const handleRestart = () => {
    setCallStatus("idle");
    setMessages([]);
    setIsMuted(false);
  };

  const isCallActive = callStatus === "active";
  const isConnecting = callStatus === "connecting";

  return (
    <main className="min-h-screen bg-[#fbf8f1]">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#3d485e] hover:text-[#212a3b] font-medium transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
        {/* LEFT: Book Info Panel */}
        <aside className="space-y-6">
          {/* Book cover */}
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
            <Image
              src={book.coverURL}
              alt={book.title}
              fill
              className="object-cover"
              sizes="340px"
              priority
            />
          </div>

          {/* Book details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-[#212a3b] font-[family-name:--font-ibm-plex-serif] leading-tight">
                {book.title}
              </h1>
              <p className="text-[#3d485e] mt-1 font-medium">by {book.author}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#663820] bg-[#663820]/8 rounded-full px-3 py-1.5">
                <Volume2 className="h-3 w-3" />
                {voice.name}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#3d485e] bg-[#3d485e]/8 rounded-full px-3 py-1.5">
                <BookOpen className="h-3 w-3" />
                {book.totalSegments} segments
              </span>
            </div>

            <p className="text-sm text-[#3d485e]/70 leading-relaxed">
              {voice.description} — ready to discuss this book with you.
            </p>
          </div>

          {/* Quick tips */}
          <div className="bg-[#663820]/5 rounded-2xl p-5 border border-[#663820]/10">
            <h3 className="text-sm font-bold text-[#663820] uppercase tracking-wider mb-3">
              💡 Try asking…
            </h3>
            <ul className="space-y-2 text-sm text-[#3d485e]">
              {[
                "What are the main themes?",
                "Summarize chapter one",
                "Who is the protagonist?",
                "What's the key takeaway?",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="text-[#663820] mt-0.5">›</span>
                  <span className="italic">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* RIGHT: Voice Chat Panel */}
        <div className="flex flex-col bg-white rounded-3xl shadow-sm ring-1 ring-black/5 overflow-hidden min-h-[600px]">
          {/* Chat header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-white">
            <div className="flex gap-1 p-1 bg-[#f3f4f6] rounded-xl">
              <button
                onClick={() => setActiveTab("chat")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  activeTab === "chat"
                    ? "bg-white text-[#212a3b] shadow-sm"
                    : "text-[#3d485e] hover:text-[#212a3b]"
                )}
              >
                <MessageSquare className="h-4 w-4" />
                Conversation
              </button>
              <button
                onClick={() => setActiveTab("info")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                  activeTab === "info"
                    ? "bg-white text-[#212a3b] shadow-sm"
                    : "text-[#3d485e] hover:text-[#212a3b]"
                )}
              >
                <BookOpen className="h-4 w-4" />
                About
              </button>
            </div>

            {/* Status badge */}
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
              isCallActive && "bg-emerald-50 text-emerald-700",
              isConnecting && "bg-amber-50 text-amber-700",
              callStatus === "idle" && "bg-[#f3f4f6] text-[#3d485e]",
              callStatus === "ended" && "bg-red-50 text-red-600",
            )}>
              <span className={cn(
                "w-2 h-2 rounded-full",
                isCallActive && "bg-emerald-500 animate-pulse",
                isConnecting && "bg-amber-500 animate-pulse",
                callStatus === "idle" && "bg-[#9ca3af]",
                callStatus === "ended" && "bg-red-400",
              )} />
              {isCallActive ? "Live" : isConnecting ? "Connecting..." : callStatus === "ended" ? "Ended" : "Ready"}
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeTab === "chat" ? (
              <>
                {/* Voice orb / visualizer */}
                <div className="flex flex-col items-center justify-center py-10 px-6 border-b border-black/5 bg-gradient-to-b from-white to-[#fbf8f1]">
                  {/* Animated Orb */}
                  <div className="relative flex items-center justify-center mb-6">
                    {/* Outer rings */}
                    {isCallActive && (
                      <>
                        <div className={cn(
                          "absolute rounded-full border-2",
                          isSpeaking
                            ? "w-36 h-36 border-[#663820]/20 animate-ping"
                            : "w-32 h-32 border-[#663820]/10"
                        )} />
                        <div className={cn(
                          "absolute rounded-full border",
                          isSpeaking
                            ? "w-48 h-48 border-[#663820]/10 animate-ping [animation-delay:150ms]"
                            : "w-44 h-44 border-[#663820]/5"
                        )} />
                      </>
                    )}

                    {/* Core orb */}
                    <div className={cn(
                      "relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg",
                      !isCallActive && !isConnecting && "bg-[#f3f4f6] shadow-inner",
                      isConnecting && "bg-amber-100 animate-pulse",
                      isCallActive && isSpeaking && "bg-gradient-to-br from-[#663820] to-[#9b4a25] shadow-[#663820]/20 shadow-xl scale-110",
                      isCallActive && !isSpeaking && "bg-gradient-to-br from-[#663820]/80 to-[#9b4a25]/80",
                      isCallActive && isUserSpeaking && "ring-4 ring-blue-400 ring-offset-2",
                    )}>
                      {isConnecting ? (
                        <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
                      ) : isCallActive ? (
                        isSpeaking ? (
                          <Volume2 className="h-8 w-8 text-white" />
                        ) : (
                          <Mic className="h-8 w-8 text-white/80" />
                        )
                      ) : (
                        <Phone className="h-8 w-8 text-[#9ca3af]" />
                      )}
                    </div>
                  </div>

                  {/* Status text */}
                  <div className="text-center space-y-1">
                    <p className="font-semibold text-[#212a3b]">
                      {isConnecting
                        ? "Connecting to AI assistant..."
                        : isCallActive && isSpeaking
                        ? `${voice.name} is speaking…`
                        : isCallActive && isUserSpeaking
                        ? "Listening to you…"
                        : isCallActive
                        ? "Ask anything about the book"
                        : callStatus === "ended"
                        ? "Session ended"
                        : "Start a voice session"}
                    </p>
                    <p className="text-sm text-[#3d485e]/60">
                      {isCallActive ? `Voice: ${voice.name} · ${voice.description}` : "Powered by VAPI"}
                    </p>
                  </div>
                </div>

                {/* Transcript / messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scroll-smooth">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div className="w-16 h-16 rounded-2xl bg-[#663820]/8 flex items-center justify-center mb-4">
                        <MessageSquare className="h-7 w-7 text-[#663820]/50" />
                      </div>
                      <p className="text-[#3d485e] font-medium">No messages yet</p>
                      <p className="text-sm text-[#3d485e]/60 mt-1">
                        Start a voice session to chat with the AI
                      </p>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex gap-3 max-w-[85%]",
                        msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      {/* Avatar */}
                      <div className={cn(
                        "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                        msg.role === "assistant"
                          ? "bg-[#663820] text-white"
                          : "bg-[#212a3b] text-white"
                      )}>
                        {msg.role === "assistant" ? voice.name[0] : "U"}
                      </div>

                      {/* Bubble */}
                      <div className={cn(
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        msg.role === "assistant"
                          ? "bg-[#f8f4ed] text-[#212a3b] rounded-tl-none"
                          : "bg-[#212a3b] text-white rounded-tr-none"
                      )}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </>
            ) : (
              /* About tab */
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#663820]">About the Book</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Title", value: book.title },
                      { label: "Author", value: book.author },
                      { label: "AI Voice", value: `${voice.name} — ${voice.description}` },
                      { label: "Segments", value: `${book.totalSegments} searchable chunks` },
                      {
                        label: "Added",
                        value: new Date(book.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric",
                        }),
                      },
                    ].map(({ label, value }) => (
                      <div key={label} className={cn(label === "Title" || label === "AI Voice" ? "col-span-2" : "")}>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#3d485e]/50 mb-1">{label}</p>
                        <p className="text-[#212a3b] font-medium text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#663820]/5 border border-[#663820]/10 p-5">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#663820] mb-3">
                    How it works
                  </h3>
                  <ol className="space-y-3 text-sm text-[#3d485e]">
                    {[
                      "The entire book has been parsed and indexed into searchable segments",
                      "When you ask a question, relevant passages are retrieved",
                      "The AI uses this context to give accurate, book-specific answers",
                      "All responses are generated in the selected voice",
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-[#663820] text-white text-xs flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Bottom controls */}
          <div className="px-6 py-5 border-t border-black/5 bg-white">
            {callStatus === "idle" || callStatus === "ended" ? (
              <div className="flex flex-col items-center gap-3">
                <Button
                  onClick={callStatus === "ended" ? handleRestart : startCall}
                  className="h-14 px-10 bg-[#663820] hover:bg-[#4d2a18] text-white rounded-2xl text-base font-bold font-[family-name:--font-ibm-plex-serif] shadow-lg shadow-[#663820]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  {callStatus === "ended" ? "Start New Session" : "Start Voice Session"}
                </Button>
                {callStatus === "ended" && (
                  <p className="text-sm text-[#3d485e]/60">
                    Session ended · {messages.length} messages
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                {/* Mute button */}
                <Button
                  onClick={toggleMute}
                  variant="outline"
                  size="icon"
                  disabled={isConnecting}
                  className={cn(
                    "w-12 h-12 rounded-2xl border-2 transition-all",
                    isMuted
                      ? "border-red-300 bg-red-50 text-red-600 hover:border-red-400"
                      : "border-[#e5e7eb] text-[#3d485e] hover:border-[#663820]/30"
                  )}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                {/* End call button */}
                <Button
                  onClick={endCall}
                  disabled={isConnecting}
                  className="h-14 px-8 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PhoneOff className="mr-2 h-5 w-5" />
                  End Session
                </Button>

                {/* Volume indicator */}
                <div className={cn(
                  "w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all",
                  isSpeaking
                    ? "border-[#663820]/40 bg-[#663820]/5 text-[#663820]"
                    : "border-[#e5e7eb] text-[#9ca3af]"
                )}>
                  {isSpeaking ? (
                    <Volume2 className="h-5 w-5" />
                  ) : (
                    <VolumeX className="h-5 w-5" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookDetail;
