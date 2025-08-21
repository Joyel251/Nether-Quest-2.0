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

        const res = await prisma.round1.findFirst({
            where: { teamNumber: teamNumber }
        });

        if (!res) {
            return { error: 'Team not found' };
        }

        if (res.Submitted === true) {
            return { redirect: '/redirect' };
        }

        return { question: res.question };
    } catch (error) {
        console.error('Server error in getQuestion:', error);
        return { error: 'Internal server error' };
    }
}