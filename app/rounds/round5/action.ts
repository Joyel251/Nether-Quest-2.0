'use server'
import { createClient } from '@/utils/supabase'
import prisma from '@/utils/prisma';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { canAdvance } from './advanceRound';

export async function validateAnswer() {

    const supabase = await createClient();

    const {
    data: { user },
    } = await supabase.auth.getUser();

    const teamNumber = Number(user?.user_metadata.team_number);

    let res = await prisma.round5.findFirst({
            where: {
                teamNumber: teamNumber,
            }
    });
    let res2 = await prisma.round5.update({
        where: {
            teamNumber: teamNumber,
        },
        data: {
            Submitted: true,
        }
    });

    let submission = await prisma.round5Submission.create({
        data: {
            teamNumber: teamNumber,
        }
    });
            
    const resAdv = await canAdvance();
    return { correct: true, ...resAdv } as const;
};

export async function getQuestion() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.error('Auth error:', authError);
            return { error: 'Authentication failed' };
        }

        if (!user) {
            return { error: 'User not authenticated' };
        }

        // Check if user_metadata exists and has team_number
        if (!user.user_metadata?.team_number) {
            return { error: 'Team number not found in user metadata' };
        }

        const teamNumber = Number(user.user_metadata.team_number);

        const res = await prisma.round5.findFirst({
            where: { teamNumber: teamNumber }
        });

        if (!res) {
            return { error: 'Team not found' };
        }

        console.log('Round 5 fetched data:', res);

        if (res.Submitted === true) {
            redirect('/redirect');
        }

        return { question: res.question, clue: res.clue };
    } catch (error: any) {

        if(isRedirectError(error)) {
            throw error;
        }

        console.error('Server error in getQuestion:', error);
        return { error: 'Internal server error' };
    }
}