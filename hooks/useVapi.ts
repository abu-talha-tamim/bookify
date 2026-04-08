import { IBook, Messages } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useRef, useState } from "react";

export type CallState = "idle" | "connecting" | "itararting" | "listening" | "thinking" | "speaking" ;

export function useVapi(book: IBook) {
 const {userId} = useAuth();


 const [status, setStatus] = useState<CallStatus>('idle');
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [duration, setDuration] = useState(0);
    const [limitError, setLimitError] = useState<string | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const isStoppingRef = useRef(false);

    // Keep refs in sync with latest values for use in callbacks
    // const maxDurationRef = useLatestRef(limits.maxSessionMinutes * 60);
    const durationRef = useLatestRef(duration);
    const voice = book.persona || DEFAULT_VOICE;


}