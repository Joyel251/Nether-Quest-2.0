'use server'
import { createClient } from '@/utils/supabase'
import prisma from '@/utils/prisma';

export async function advanceRound() {
    try {
        const supabase = await createClient();

        const {
        data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        await supabase.auth.updateUser({ data: { round: 5 }  });

    } catch (error) {
        console.error('Error advancing round:', error);
        throw new Error('Failed to advance round');
    }
}

export async function canAdvance() {
    try {
        const supabase = await createClient();

        const {
        data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const count = await prisma.round3Submission.count();

        console.log('Count of submissions:', count);

        const permissible = user.user_metadata.participant_limits["4"];

        console.log('Permissible submissions:', permissible);

        if(count <= permissible) {
            await advanceRound();
        }

    } catch (error) {
        console.error('Error advancing round:', error);
        throw new Error('Failed to advance round');
    }
}