'use server'
import { createClient } from '@/utils/supabase'
import prisma from '@/utils/prisma';

export async function validateAnswer(formData: FormData) {
    try {
        let givenAnswer = formData.get('answer') as string;

        const supabase = await createClient();

        const { data: { user },} = await supabase.auth.getUser();
        
        if (!user) {
            throw new Error('User not authenticated');
        }

        const teamNumber = Number(user.user_metadata.team_number);

        let res = await prisma.round1.findFirst({
                where: {
                    teamNumber: teamNumber,
                }
        });

        if (!res) {
            throw new Error('team not found');
        }

        if (res.answer === givenAnswer) {

            await prisma.$transaction([
            prisma.round1.update({
            where: { teamNumber: teamNumber },
            data: { Submitted: true },
            }),
            prisma.round1Submission.create({
            data: { teamNumber: teamNumber },
            }),
        ]);

            return { success: true };
        } else {
            return { success: false, message: 'Incorrect answer' };
        }
    } catch (error) {
        console.error('Error validating answer:', error);
        return { success: false, message: "An unexpected error occurred" };
    }
};

export async function getQuestion() {
    try {
        const supabase = await createClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User is not authenticated.');
        }

        const teamNumber = Number(user.user_metadata.team_number);

        let res = await prisma.round1.findFirst({
            where: {
                teamNumber: teamNumber,
            }
        });

        if (!res) {
            throw new Error('Team not found');
        }

        if (res.Submitted === true) {
            return { redirect: '/redirect' };
        }

         return { question: res.question };
    } catch (error : any) {
        console.error('An unexpected error occurred in getQuestion:', error);
        return {
            question: null,
            error: 'Failed to load the question due to an unexpected server error.',
        };
    }
}