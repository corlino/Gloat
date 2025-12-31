import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { User as UserIcon } from "lucide-react"

export interface Goal {
    id: string
    title: string
    description: string | null
    category: string | null
    timeframe: string | null
    start_date: string | null
    end_date: string | null
    privacy: string
    created_at: string
    user_id: string
    profiles?: {
        display_name: string | null
        username: string | null
    }
}

interface GoalCardProps {
    goal: Goal
}

export function GoalCard({ goal }: GoalCardProps) {
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
                        <div className="flex items-center gap-2 mb-2">
                            {goal.category && (
                                <Badge variant="secondary" className="text-xs">
                                    {goal.category}
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
                </div>
                {goal.description && (
                    <CardDescription className="mt-2 line-clamp-2">
                        {goal.description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardFooter className="text-xs text-muted-foreground">
                Started {goal.start_date ? new Date(goal.start_date).toLocaleDateString() : 'Unknown'} •
                Created {formatDistanceToNow(new Date(goal.created_at))} ago
            </CardFooter>
        </Card>
    )
}
