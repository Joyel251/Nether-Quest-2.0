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

        await supabase.auth.updateUser({ data: { round: 4 }  });

    } catch (error) {
        console.error('Error advancing round:', error);
        throw new Error('Failed to advance round');
    }
}

export async function canAdvance(): Promise<{ advanced: boolean; eliminated: boolean }> {
    try {
        const supabase = await createClient();

        const {
        data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const count = await prisma.round3Submission.count();

        const permissibleRaw = user.user_metadata?.participant_limits?.["3"];
        const permissible = typeof permissibleRaw === 'number' ? permissibleRaw : Number(permissibleRaw) || 0;

        if (count <= permissible) {
            await advanceRound();
            return { advanced: true, eliminated: false };
        }
        return { advanced: false, eliminated: true };

    } catch (error) {
        console.error('Error advancing round:', error);
        return { advanced: false, eliminated: false };
    }
}