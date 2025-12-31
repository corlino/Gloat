import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
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

{ goal.profiles.display_name || goal.profiles.username || "Unknown" }
                            </Link >
                        )}
                        <Badge variant="secondary" className="text-xs">
                            {goal.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {goal.timeframe}
                        </Badge>
                    </div >
    <CardTitle className="text-xl">
        <Link href={`/goals/${goal.id}`} className="hover:underline">
            {goal.title}
        </Link>
    </CardTitle>
                </div >
            </div >
{
    goal.description && (
        <CardDescription className="mt-2 line-clamp-2">
            {goal.description}
        </CardDescription>
    )
}
        </CardHeader >
    <CardFooter className="text-xs text-muted-foreground">
        Started {goal.start_date ? new Date(goal.start_date).toLocaleDateString() : 'Unknown'} •
        Created {formatDistanceToNow(new Date(goal.created_at))} ago
    </CardFooter>
    </Card >
)
}
