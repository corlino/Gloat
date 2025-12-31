'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProgressUpdate(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const goalId = formData.get('goalId') as string
    const progressText = formData.get('progressText') as string
    const numericValue = formData.get('numericValue') ? parseFloat(formData.get('numericValue') as string) : null
    const reflection = formData.get('reflection') as string

    const { error } = await supabase
        .from('goal_updates')
        .insert({
            goal_id: goalId,
            progress_text: progressText,
            numeric_value: numericValue,
            reflection: reflection,
        })

    if (error) {
        console.error(error)
        return { error: 'Failed to add update' }
    }

    revalidatePath(`/goals/${goalId}`)
    return { success: true }
}
