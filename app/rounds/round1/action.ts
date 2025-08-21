'use server'
import { createClient } from '@/utils/supabase'
import prisma from '@/utils/prisma';
import { redirect } from 'next/navigation';

export async function validateAnswer(formData: FormData) {

    let givenAnswer = formData.get('answer') as string;
    const supabase = await createClient();

    const {
    data: { user },
    } = await supabase.auth.getUser();

    const teamNumber = Number(user?.user_metadata.team_number);

    let res = await prisma.round1.findFirst({
            where: {
                teamNumber: teamNumber,
            }
    });

    if (res?.answer === givenAnswer) {
        let res = await prisma.round1.update({
            where: {
                teamNumber: teamNumber,
            },
            data: {
                Submitted: true,
            }
        });

        let submission = await prisma.round1Submission.create({
            data: {
                teamNumber: teamNumber,
            }
        });

        return true;
    }
    return false;
};

export async function getQuestion() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const teamNumber = Number(user?.user_metadata.team_number);

    let res = await prisma.round1.findFirst({
        where: {
            teamNumber: teamNumber,
        }
    });

    if (res?.Submitted == true) {
        redirect('/redirect');
    }

    return res?.question || 'No question found';
}