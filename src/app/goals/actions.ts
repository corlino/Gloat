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
    const recurrence = formData.get('recurrence') as string
    const checklistJson = formData.get('checklist') as string
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string // optional
    const privacy = formData.get('privacy') as string

    // Simple validation could go here

    const { data: goal, error } = await supabase
        .from('goals')
        .insert({
            user_id: user.id,
            title,
            description,
            category,
            timeframe,
            recurrence_type: recurrence === 'none' ? null : recurrence,
            start_date: startDate || new Date().toISOString().split('T')[0],
            end_date: endDate || null,
            privacy,
        })
        .select()
        .single()

    if (error) {
        console.error('SERVER ACTION ERROR: Failed to insert goal:', JSON.stringify(error, null, 2))
        return { error: 'Failed to create goal: ' + error.message }
    }

    if (goal && checklistJson) {
        try {
            const checklist = JSON.parse(checklistJson) as string[]
            if (checklist.length > 0) {
                const checklistItems = checklist.map((item, index) => ({
                    goal_id: goal.id,
                    item,
                    position: index
                }))

                const { error: checklistError } = await supabase
                    .from('goal_checklist_items')
                    .insert(checklistItems)

                if (checklistError) {
                    console.error('Error creating checklist:', checklistError)
                    // Non-fatal, but good to know
                }
            }
        } catch (e) {
            console.error('Error parsing checklist:', e)
        }
    }

    revalidatePath('/')
    revalidatePath('/calendar')
    redirect('/')
}

export async function duplicateGoal(goalId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    // 1. Fetch original goal
    const { data: originalGoal, error: fetchError } = await supabase
        .from('goals')
        .select('*, goal_checklist_items(*)')
        .eq('id', goalId)
        .single()

    if (fetchError || !originalGoal) {
        return { error: 'Goal not found' }
    }

    // 2. Create new goal
    const { data: newGoal, error: createError } = await supabase
        .from('goals')
        .insert({
            user_id: user.id,
            title: originalGoal.title,
            description: originalGoal.description,
            category: originalGoal.category,
            timeframe: originalGoal.timeframe,
            recurrence_type: originalGoal.recurrence_type,
            start_date: new Date().toISOString().split('T')[0], // Start today?
            privacy: 'public', // Default to public? Or private? Let's say public.
        })
        .select()
        .single()

    if (createError || !newGoal) {
        return { error: 'Failed to create goal' }
    }

    // 3. Copy checklist items
    if (originalGoal.goal_checklist_items && originalGoal.goal_checklist_items.length > 0) {
        const newItems = originalGoal.goal_checklist_items.map((item: any) => ({
            goal_id: newGoal.id,
            item: item.item,
            position: item.position
        }))

        await supabase.from('goal_checklist_items').insert(newItems)
    }

    revalidatePath('/')
    revalidatePath('/calendar')
    return { success: true }
}
