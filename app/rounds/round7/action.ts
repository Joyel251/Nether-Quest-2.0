'use server'
import { createClient } from '@/utils/supabase'
import prisma from '@/utils/prisma';
import { redirect } from 'next/navigation';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { canAdvance } from './advanceRound';

export async function validateAnswer(formData: FormData) {

    let givenAnswer = formData.get('answer') as string;
    const supabase = await createClient();

    console.log('Validating answer:', givenAnswer)

    const {
    data: { user },
    } = await supabase.auth.getUser();

    const teamNumber = Number(user?.user_metadata.team_number);

    const questionId = Number(user?.user_metadata.qid);

    let res = await prisma.questionSet.findFirst({
            where: {
                id: questionId,
            }
    });

    if (res?.answer === givenAnswer) {
        let res = await prisma.questionSet.update({
            where: {
                id: questionId,
            },
            data: {
                Submitted: true,
            }
        });

        let submission = await prisma.round7Submission.create({
            data: {
                teamNumber: teamNumber,
            }
        });
                
        await canAdvance();

        return true;
    }
    return false;
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

        const questionId = Number(user.user_metadata.qid);

        const res = await prisma.questionSet.findFirst({
            where: { id: questionId }
        });

        if (!res) {
            return { error: 'Team not found' };
        }

        console.log('Round 7 fetched data:', res);

        if (res.Submitted === true) {
            redirect('/redirect');
        }

        return { clue1: res.clue1, clue2: res.clue2, clue3: res.clue3 };
    } catch (error: any) {

        if(isRedirectError(error)) {
            throw error;
        }

        console.error('Server error in getQuestion:', error);
        return { error: 'Internal server error' };
    }
}