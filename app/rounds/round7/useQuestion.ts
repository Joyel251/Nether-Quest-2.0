"use client";

import { useEffect, useState } from "react";
import { getQuestion } from "./action";

interface QuestionState {
  clue1: string | null;
  clue2: string | null;
  clue3: string | null;
  loading: boolean;
  error: string | null;
}

export default function useQuestion() {
  const [state, setState] = useState<QuestionState>({
    clue1: null,
    clue2: null,
    clue3: null,
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
          clue1: response.clue1,
          clue2: response.clue2,
          clue3: response.clue3,
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
    clue1: state.clue1,
    clue2: state.clue2,
    clue3: state.clue3,
    loading: state.loading,
    error: state.error,
  };
}