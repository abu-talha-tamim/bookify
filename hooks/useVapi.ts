"use client";

import { ASSISTANT_ID } from "@/lib/constants";
import { IBook, Messages } from "@/types";
import { getVoice } from "@/lib/utils";
import Vapi from "@vapi-ai/web";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { startVoiceSession, endVoiceSession } from "@/lib/actions/session.action";

export type CallStatus = "idle" | "connecting" | "talking" | "listening" | "thinking" | "speaking";

export function useVapi(book: IBook) {
  const { userId } = useAuth();
  const [status, setStatus] = useState<CallStatus>("idle");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentUserMessage, setCurrentUserMessage] = useState("");
  const [duration, setDuration] = useState(0);

  // Billing & Session State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [isBillingError, setIsBillingError] = useState(false);
  const [maxDurationSeconds, setMaxDurationSeconds] = useState(15 * 60);

  const vapiRef = useRef<Vapi | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (vapiRef.current) vapiRef.current.stop();
    };
  }, []);

  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    
    if (!publicKey || publicKey === "your_vapi_public_key_here") {
      return;
    }

    if (!vapiRef.current) {
      vapiRef.current = new Vapi(publicKey);
    }

    const vapi = vapiRef.current;

    const onCallStart = () => {
      setStatus("talking");
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    };

    const onCallEnd = () => {
      setStatus("idle");
      if (timerRef.current) clearInterval(timerRef.current);
      
      if (sessionId) {
          const finalDuration = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
          endVoiceSession(sessionId, finalDuration);
      }

      setSessionId(null);
      setDuration(0);
      setCurrentMessage("");
      setCurrentUserMessage("");
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;

        if (role === "user") {
          if (transcriptType === "partial") {
            setCurrentUserMessage(transcript);
          } else if (transcriptType === "final") {
            setCurrentUserMessage("");
            setStatus("thinking");
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.role === "user" && lastMsg.content === transcript) {
                return prev;
              }
              return [...prev, { role: "user", content: transcript }];
            });
          }
        } else if (role === "assistant") {
          if (transcriptType === "partial") {
            setCurrentMessage(transcript);
            setStatus("speaking");
          } else if (transcriptType === "final") {
            setCurrentMessage("");
            setMessages((prev) => {
              const lastMsg = prev[prev.length - 1];
              if (lastMsg && lastMsg.role === "assistant" && lastMsg.content === transcript) {
                return prev;
              }
              return [...prev, { role: "assistant", content: transcript }];
            });
          }
        }
      }
    };

    const onError = (error: any) => {
      console.error("Vapi Error Detailed:", JSON.stringify(error, null, 2));
      
      const isAuthError = error.type === 'start-method-error' && error.error?.status === 401;
      const isBadRequest = error.type === 'start-method-error' && error.error?.status === 400;

      if (isAuthError) {
          toast.error("Vapi Authentication Failed. Check your Public Key.");
      } else if (isBadRequest) {
          toast.error("Vapi Bad Request. Check Assistant ID and variable configuration.");
      } else {
          toast.error("Voice assistant error");
      }
      setStatus("idle");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("error", onError);
    };
  }, [sessionId]);

  const start = useCallback(async () => {
    if (!userId) {
        toast.error("Please sign in to use the voice assistant");
        return;
    }
    
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey || publicKey === "your_vapi_public_key_here") {
        toast.error("VAPI Public Key not configured");
        return;
    }

    if (!ASSISTANT_ID) {
        toast.error("Assistant ID not configured");
        return;
    }

    setStatus("connecting");
    setLimitError(null);
    setIsBillingError(false);

    try {
      const sessionResult = await startVoiceSession(userId, book._id);
      
      if (!sessionResult.success) {
          setLimitError(sessionResult.error || "Failed to start session");
          setIsBillingError(!!sessionResult.isBillingError);
          setStatus("idle");
          toast.error(sessionResult.error || "Limit reached");
          return;
      }

      setSessionId(sessionResult.sessionId || null);
      if (sessionResult.maxDurationMinutes) {
          setMaxDurationSeconds(sessionResult.maxDurationMinutes * 60);
      }

      if (!vapiRef.current) {
          vapiRef.current = new Vapi(publicKey);
      }

      const voice = getVoice(book.persona);

      // Log configuration for debugging 400 errors
      console.log('Initiating Vapi session:', {
          assistantId: ASSISTANT_ID,
          publicKeyProvided: !!publicKey,
          book: book.title
      });

      await vapiRef.current.start(ASSISTANT_ID, {
        variableValues: {
          book_title: book.title,
          book_author: book.author,
          assistant_voice: voice.name,
        },
        voice: {
          voiceId: voice.id,
          provider: "11labs"
        }

      } as any);
    } catch (error: any) {
      console.error("Critical Vapi Start Error:", error);
      setStatus("idle");
      toast.error(error.message || "Failed to connect to voice assistant");
    }
  }, [book, userId]);

  const stop = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  }, []);

  const toggleCall = useCallback(() => {
    if (status === "idle") {
      start();
    } else {
      stop();
    }
  }, [status, start, stop]);

  return {
    status,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    toggleCall,
    start,
    stop,
    limitError,
    isBillingError,
    maxDurationSeconds,
    isActive: status !== "idle"
  };
}