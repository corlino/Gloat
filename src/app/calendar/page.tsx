import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CalendarGrid } from './calendar-grid'

export default async function CalendarPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch all updates for the user's goals
    // valid goal_updates where goal.user_id = user.id
    const { data: updates } = await supabase
        .from('goal_updates')
        .select(`
        *,
        goals!inner (
            id,
            title,
            color: category,
            recurrence_type
        )
    `)
        .eq('goals.user_id', user.id)

    const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('recurrence_type', 'daily') // Only fetching daily for calendar schedule for now
    // If we want to support weekly/monthly scheduling visualization, we'd need more logic

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Your Progress</h1>
                <p className="text-muted-foreground">Visualizing your consistency.</p>
            </div>

            <CalendarGrid updates={updates || []} goals={goals || []} />
        </div>
    )
}
