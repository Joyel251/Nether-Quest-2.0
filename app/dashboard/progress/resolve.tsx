"use-client";
import { fetchRound } from "./actions";
import { useEffect, useState } from "react";


export default function resolveRound() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [round, setRounds] = useState([]);

    useEffect(() => {
        async function getRound() {
            try {
                const roundNumber = await fetchRound();
                setRounds(roundNumber);
            } catch (err) {
                console.error('Error fetching round number:', err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        getRound();
    }, []);

    return {round, error, loading};
}

export { resolveRound };