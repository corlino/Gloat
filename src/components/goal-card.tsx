import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { User as UserIcon, Repeat, CheckSquare } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { GoalDuplicateButton } from "./goal-duplicate-button"

export interface Goal {
    id: string
    title: string
    description: string | null
    category: string | null
    timeframe: string | null
    recurrence_type: string | null
    start_date: string | null
    end_date: string | null
    privacy: string
    created_at: string
    user_id: string
    profiles?: {
        display_name: string | null
        username: string | null
    }
    goal_checklist_items?: { item: string }[]
}

interface GoalCardProps {
    goal: Goal
}

export async function GoalCard({ goal }: GoalCardProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const isOwner = user?.id === goal.user_id

    return (
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="flex-1">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-1">
                        {goal.profiles && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <UserIcon className="h-4 w-4" />
                                <Link href={`/u/${goal.profiles.username}`} className="hover:underline">
                                    {goal.profiles.display_name || goal.profiles.username || "Unknown"}
                                </Link>
                            </div>
                        )}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {goal.category && (
                                <Badge variant="secondary" className="text-xs">
                                    {goal.category}
                                </Badge>
                            )}
                            {goal.recurrence_type && goal.recurrence_type !== 'none' && (
                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                    <Repeat className="h-3 w-3" />
                                    {goal.recurrence_type}
                                </Badge>
                            )}
                            {goal.timeframe && (
                                <Badge variant="outline" className="text-xs">
                                    {goal.timeframe}
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-xl">
                            <Link href={`/goals/${goal.id}`} className="hover:underline">
                                {goal.title}
                            </Link>
                        </CardTitle>
                    </div>
                    {!isOwner && user && (
                        <div className="shrink-0">
                            <GoalDuplicateButton goalId={goal.id} />
                        </div>
                    )}
                </div>
                {goal.description && (
                    <CardDescription className="mt-2 line-clamp-2">
                        {goal.description}
                    </CardDescription>
                )}
                {goal.goal_checklist_items && goal.goal_checklist_items.length > 0 && (
                    <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
                        <CheckSquare className="h-3 w-3" />
                        {goal.goal_checklist_items.length} checklist items
                    </div>
                )}
            </CardHeader>
            <CardFooter className="text-xs text-muted-foreground">
                Started {goal.start_date ? new Date(goal.start_date).toLocaleDateString() : 'Unknown'} •
                Created {formatDistanceToNow(new Date(goal.created_at))} ago
            </CardFooter>
        </Card>
    )
}
