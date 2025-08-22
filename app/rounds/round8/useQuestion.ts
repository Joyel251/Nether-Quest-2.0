"use client";

import { useEffect, useState } from "react";
import { getQuestion } from "./action";

interface QuestionState {
  question: string | null;
  clue1: string | null;
  clue2: string | null;
  loading: boolean;
  error: string | null;
}

export default function useQuestion() {
  const [state, setState] = useState<QuestionState>({
    question: null,
    clue1: null,
    clue2: null,
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

        setState(prev => ({
          ...prev,
          question: response.question,
          clue1: response.clue1,
          clue2: response.clue2,
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
    clue1: state.clue1,
    clue2: state.clue2,
    loading: state.loading,
    error: state.error,
  };
}