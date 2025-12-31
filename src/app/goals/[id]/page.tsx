import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { GoalCard } from '@/components/goal-card'
import { ProgressUpdateForm } from './progress-update-form'
import { GoalUpdateCard, GoalUpdate } from '@/components/goal-update-card'

export default async function GoalDetailPage(props: { params: Promise<{ id: string }> }) {
    // Awaiting params for Next.js 15
    const params = await props.params;

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    // Fetch goal
    const { data: goal } = await supabase
        .from('goals')
        .select(`
        *,
        profiles (
            display_name,
            username
        )
    `)
        .eq('id', params.id)
        .single()

    if (!goal) {
        return notFound()
    }

    const isOwner = goal.user_id === user.id

    // Privacy check (basic server-side enforcement, RLS handles data but we might want friendly redirect)
    // If RLS blocked it, data would be null if we handle error. But eq('id', id).single() might return error.
    // Assuming RLS works, we already have goal or null.

    // Fetch updates
    const { data: updates } = await supabase
        .from('goal_updates')
        .select('*')
        .eq('goal_id', goal.id)
        .order('created_at', { ascending: false })

    return (
        <div className="container max-w-3xl py-10 space-y-8">
            <div>
                <GoalCard goal={goal as any} />
            </div>

            {isOwner && (
                <div className="max-w-xl">
                    <ProgressUpdateForm goalId={goal.id} />
                </div>
            )}

            <div className="space-y-6">
                <h3 className="text-lg font-semibold">Progress History</h3>
                <div className="space-y-6 pl-2">
                    {updates?.map((update) => (
                        <GoalUpdateCard key={update.id} update={update as any} isOwner={isOwner} />
                    ))}
                    {(!updates || updates.length === 0) && (
                        <p className="text-muted-foreground text-sm">No updates yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
