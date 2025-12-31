'use client'

import { Button } from '@/components/ui/button'
import { toggleFollow } from '@/app/actions/social'
import { useState } from 'react'

export function FollowButton({ followingId, isFollowing: initialIsFollowing }: { followingId: string, isFollowing: boolean }) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [pending, setPending] = useState(false)

    async function onClick() {
        setPending(true)
        // Optimistic update
        setIsFollowing(!isFollowing)
        await toggleFollow(followingId)
        setPending(false)
    }

    return (
        <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={onClick}
            disabled={pending}
        >
            {isFollowing ? 'Following' : 'Follow'}
        </Button>
    )
}
