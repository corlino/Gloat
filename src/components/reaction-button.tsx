'use client'

import { Button } from "@/components/ui/button"
import { toggleReaction } from "@/app/actions/social"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SmilePlus } from "lucide-react"

export function ReactionButton({ updateId }: { updateId: string }) {
    async function onReact(type: string) {
        await toggleReaction(updateId, type)
        // In a real app we'd optimistic update counts here
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
                    <SmilePlus className="w-3 h-3 mr-1" />
                    React
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onReact('cheering')} title="Cheering you on">
                    🎉
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onReact('got_this')} title="You've got this">
                    💪
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onReact('love_it')} title="Love this direction">
                    ❤️
                </Button>
            </PopoverContent>
        </Popover>
    )
}
