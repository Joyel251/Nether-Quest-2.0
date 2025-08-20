"use client";
import { useEffect } from 'react';

interface Props { teamNumber?: number | null; teamName?: string | null; }
export default function SessionSync({ teamNumber, teamName }: Props) {
  useEffect(() => {
    if (teamNumber != null) {
      try { sessionStorage.setItem('teamNumber', String(teamNumber)); } catch {}
    }
    if (teamName) {
      try { sessionStorage.setItem('teamName', teamName); } catch {}
    }
  }, [teamNumber, teamName]);
  return null;
}
