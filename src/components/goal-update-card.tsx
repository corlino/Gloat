import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ReactionButton } from "./reaction-button"

export interface GoalUpdate {
    id: string
    goal_id: string
    progress_text: string | null
    numeric_value: number | null
    reflection: string | null
    created_at: string
    profiles?: {
        display_name: string | null
        username: string | null
    }
}

export function GoalUpdateCard({ update, isOwner }: { update: GoalUpdate, isOwner: boolean }) {
    return (
        <Card className="border-0 shadow-none border-l-2 border-l-muted pl-4 rounded-none bg-transparent">
            <CardHeader className="p-0 pb-2 flex flex-row items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">
                    {formatDistanceToNow(new Date(update.created_at))} ago
                </span>
            </CardHeader>
            <CardContent className="p-0 space-y-2">
                {update.progress_text && (
                    <p className="text-sm whitespace-pre-wrap">{update.progress_text}</p>
                )}
                <div className="flex gap-2 text-xs">
                    {update.numeric_value !== null && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                            Value: {update.numeric_value}
                        </span>
                    )}
                    {update.reflection && (
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded italic">
                            "{update.reflection}"
                        </span>
                    )}
                </div>
                {!isOwner && (
                    <div className="pt-2">
                        <ReactionButton updateId={update.id} />
                    </div>
                )}
            </CardContent>
            {/* Future: Reactions display list */}
        </Card>
    )
}
