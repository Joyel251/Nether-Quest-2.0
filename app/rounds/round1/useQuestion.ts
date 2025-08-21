"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getQuestion } from "./action";

interface QuestionState {
  question: string | null;
  loading: boolean;
  error: string | null;
  shouldRedirect: boolean;
  redirectPath: string | null;
}

export default function useQuestion() {
  const [state, setState] = useState<QuestionState>({
    question: null,
    loading: true,
    error: null,
    shouldRedirect: false,
    redirectPath: null,
  });

  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function fetchQuestion() {
      try {
        const response = await getQuestion();

        if (!isMounted) return;

        if (response.redirect === '/redirect') {
            setState(prev => ({
              ...prev,
              question: null,
              shouldRedirect: true,
              redirectPath: '/redirect',
              loading: false,
          }));
          return;
        }

        if (response.error) {
          throw new Error(response.error || 'Failed to fetch question');
        }

        setState(prev => ({
          ...prev,
          question: response.question,
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

  // Handle redirect in a separate effect
  useEffect(() => {
    if (state.shouldRedirect && state.redirectPath) {
      router.push(state.redirectPath);
    }
  }, [state.shouldRedirect, state.redirectPath, router]);

  return {
    question: state.question,
    loading: state.loading,
    error: state.error,
    isRedirecting: state.shouldRedirect,
  };
}