import { useEffect } from "react";
import { MERCURE_PUBLIC_URL } from "@/config/api";

interface UseMercureOptions<T> {
  topic: string | null;
  mercureJwt: string;
  onMessage: (date: T) => void;
}

export function useMercure<T>({
  topic,
  mercureJwt: mercureJwt,
  onMessage,
}: UseMercureOptions<T>) {
  useEffect(() => {
    if (!topic || !mercureJwt) return; 

    const hubUrl = MERCURE_PUBLIC_URL; // https://localhost/.well-known/mercure
    const url = new URL(hubUrl);
    url.searchParams.append("topic", topic);
    url.searchParams.append("authorization", mercureJwt);

    const eventSource = new EventSource(url.toString(), {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (e) {
        console.error("Mercure parse error: ", e);
      }
    };

    eventSource.onerror = (e) => console.error("Mercure error: ", e);

    return () => eventSource.close();
  }, [topic, mercureJwt, onMessage]);
}
