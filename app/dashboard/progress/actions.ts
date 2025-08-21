'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase'

export async function fetchRound() {
    const supabase = await createClient();

    const {
    data: { user },
    } = await supabase.auth.getUser();

    return user?.user_metadata.round;

};