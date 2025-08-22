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

    async function fetchQuestion() {
      try {
        const response = await getQuestion();

        if (!isMounted) return;

        if (response.error) {
          throw new Error(response.error || 'Failed to fetch question');
        }

        if (response.error) {
          throw new Error(response.error || 'Failed to fetch question');
        }

        setState(prev => ({
          ...prev,
          question: response.question,
          clue: response.clue,
          loading: false,
        }));

      } catch (error: any) {
        if (!isMounted) return;
        
        setState(prev => ({
          ...prev,
          error: error.message || 'An unexpected error occurred',
          loading: false,
        }));
      }
    }

    fetchQuestion();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {

  }, []);

  return {
    question: state.question,
    clue: state.clue,
    loading: state.loading,
    error: state.error,
  };
}