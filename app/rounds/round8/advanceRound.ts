'use server'
import { createClient } from '@/utils/supabase'

export async function advanceRound() {
    try {
        const supabase = await createClient();

        const {
        data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        await supabase.auth.updateUser({ data: { round: 9 }  });

    } catch (error) {
        console.error('Error advancing round:', error);
        throw new Error('Failed to advance round');
    }
}