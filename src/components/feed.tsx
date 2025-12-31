import { createClient } from '@/utils/supabase/server'
import { GoalCard } from '@/components/goal-card'

export async function Feed() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
        .from('goals')
        .select(`
      *,
      profiles (
        display_name,
        username
      )
    `)
        .order('created_at', { ascending: false })
        .limit(50)

    // Fetch Public goals OR My goals
    // PostgREST doesn't support OR across relations easily or with RLS mixed in a simple way for "public OR mine" in one go without complex filter string
    // But strictly speaking, standard query:
    // privacy=eq.public,user_id=eq.{my_id} with OR?
    // .or(`privacy.eq.public,user_id.eq.${user?.id}`) matches ANY of those conditions.

    if (user) {
        query = query.or(`privacy.eq.public,user_id.eq.${user.id}`)
    } else {
        query = query.eq('privacy', 'public')
    }

    const { data: goals } = await query

    return (
        <div className="space-y-6">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {goals?.map((goal) => (
                    <div key={goal.id} className="break-inside-avoid">
                        <GoalCard goal={goal as any} />
                    </div>
                ))}
            </div>
            {(!goals || goals.length === 0) && (
                <p className="text-center text-muted-foreground py-10">No goals found. Create one to get started!</p>
            )}
        </div>
    )
}
