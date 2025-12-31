import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { GoalCard } from '@/components/goal-card'
import { FollowButton } from '@/components/follow-button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default async function PublicProfilePage(props: { params: Promise<{ username: string }> }) {
    const params = await props.params;
    const username = params.username

    const supabase = await createClient()
    const { data: { user: currentUser } } = await supabase.auth.getUser()

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

    if (!profile) {
        return notFound()
    }

    // Fetch public goals
    const { data: goals } = await supabase
        .from('goals')
        .select(`
        *,
        profiles (
            display_name,
            username
        )
    `)
        .eq('user_id', profile.id)
        .eq('privacy', 'public') // Only show public goals
        .order('created_at', { ascending: false })

    // Check if following
    let isFollowing = false
    if (currentUser) {
        const { data: follow } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', currentUser.id)
            .eq('following_id', profile.id)
            .single()
        if (follow) isFollowing = true
    }

    const isOwnProfile = currentUser?.id === profile.id

    return (
        <div className="container max-w-4xl py-10 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarFallback>{profile.display_name?.[0] || profile.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">{profile.display_name}</h1>
                        <p className="text-muted-foreground">@{profile.username}</p>
                        {profile.bio && <p className="mt-1 text-sm">{profile.bio}</p>}
                    </div>
                </div>
                {currentUser && !isOwnProfile && (
                    <FollowButton followingId={profile.id} isFollowing={isFollowing} />
                )}
                {isOwnProfile && (
                    <span className="text-sm text-muted-foreground italic">This is you</span>
                )}
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Public Goals</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                    {goals?.map((goal) => (
                        <GoalCard key={goal.id} goal={goal as any} />
                    ))}
                    {(!goals || goals.length === 0) && (
                        <p className="text-muted-foreground">No public goals shared yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
