"use client";

import { useEffect, useState } from "react";
import { getQuestion } from "./action";

interface QuestionState {
  question: string | null;
  clue: string | null;
  loading: boolean;
  error: string | null;
}

export default function useQuestion() {
  const [state, setState] = useState<QuestionState>({
    question: null,
    clue: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const response = await getQuestion();
        if (!isMounted) return;
        if ((response as any).error) {
          throw new Error((response as any).error || 'Failed to fetch question');
        }
        setState(prev => ({
          ...prev,
          question: (response as any).question,
          clue: (response as any).clue,
          loading: false,
        }));
      } catch (err: any) {
        if (!isMounted) return;
        setState(prev => ({ ...prev, error: err?.message || 'Unknown error', loading: false }));
      }
    })();
    return () => { isMounted = false };
  }, []);

  return state;
}
