'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleFollow(followingId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    if (user.id === followingId) {
        return { error: 'Cannot follow self' }
    }

    // Check if already following
    const { data: existing } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', followingId)
        .single()

    if (existing) {
        // Unfollow
        await supabase.from('follows').delete().eq('id', existing.id)
    } else {
        // Follow
        await supabase.from('follows').insert({
            follower_id: user.id,
            following_id: followingId,
            status: 'accepted'
        })
    }

    revalidatePath('/')
    return { success: true }
}

export async function toggleReaction(updateId: string, reactionType: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // Check for existing reaction by this user on this update
    const { data: existing } = await supabase
        .from('reactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('update_id', updateId)
        .single()

    if (existing) {
        if (existing.type === reactionType) {
            // Remove if same type
            await supabase.from('reactions').delete().eq('id', existing.id)
        } else {
            // Change type
            await supabase.from('reactions').update({ type: reactionType }).eq('id', existing.id)
        }
    } else {
        // Add new
        await supabase.from('reactions').insert({
            user_id: user.id,
            update_id: updateId,
            type: reactionType
        })
    }

    revalidatePath(`/goals/[id]`) // We might need the goal ID passed or revalidate generally
    // Ideally we revalidate the specific path where the update is shown.
    // For now we will return success and rely on client or broad revalidation if possible.
    // Since we don't have goalId here easily without fetching, we might just revalidatePath of the page calling this.
    // But server actions bind to the page usually.
    return { success: true }
}
