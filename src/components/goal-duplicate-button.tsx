'use client'

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { duplicateGoal } from "@/app/goals/actions"
import { useState } from "react"

export function GoalDuplicateButton({ goalId }: { goalId: string }) {
    const [loading, setLoading] = useState(false)

    async function handleDuplicate() {
        setLoading(true)
        try {
            await duplicateGoal(goalId)
            // Ideally show a toast here
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleDuplicate} disabled={loading}>
            <Copy className="h-4 w-4 mr-2" />
            {loading ? 'Adding...' : 'Add to My Goals'}
        </Button>
    )
}
