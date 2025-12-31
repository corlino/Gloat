'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createGoal(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const timeframe = formData.get('timeframe') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string // optional
    const privacy = formData.get('privacy') as string

    // Simple validation could go here

    const { error } = await supabase
        .from('goals')
        .insert({
            user_id: user.id,
            title,
            description,
            category,
            timeframe,
            start_date: startDate || new Date().toISOString().split('T')[0],
            end_date: endDate || null,
            privacy,
        })

    if (error) {
        console.error(error)
        return { error: 'Failed to create goal' }
    }

    revalidatePath('/')
    redirect('/')
}
