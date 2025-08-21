"use-client";
import { getQuestion } from "./action";
import { useEffect, useState } from "react";

export default function useQuestion() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [question, setQuestion] = useState<string>("");

    useEffect(() => {
        async function getRound() {
            try {
                const question = await getQuestion();
                setQuestion(question);
            } catch (err) {
                console.error('Error fetching question:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        getRound();
    }, []);

    return {question, error, loading};
}

export { useQuestion };