'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addProgressUpdate } from './actions'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} size="sm">
            {pending ? 'Posting...' : 'Post Update'}
        </Button>
    )
}

export function ProgressUpdateForm({ goalId }: { goalId: string }) {
    // We can reset form after submission if we use a client wrapper logic or just standard form reset with key/state
    const [key, setKey] = useState(0)

    async function action(formData: FormData) {
        await addProgressUpdate(formData)
        setKey(prev => prev + 1) // Reset form
    }

    return (
        <div className="border rounded-lg p-4 bg-muted/20 space-y-4">
            <h3 className="font-semibold text-sm">Add Progress Entry</h3>
            <form action={action} key={key} className="space-y-4">
                <input type="hidden" name="goalId" value={goalId} />

                <div className="space-y-2">
                    <Label htmlFor="progressText" className="sr-only">Progress</Label>
                    <Textarea
                        id="progressText"
                        name="progressText"
                        placeholder="What did you accomplish today?"
                        required
                        className="min-h-[80px]"
                    />
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="numericValue" className="text-xs">Numeric Value (Optional)</Label>
                        <Input
                            id="numericValue"
                            name="numericValue"
                            type="number"
                            step="0.01"
                            placeholder="e.g. 5.5"
                        />
                    </div>
                    <div className="flex-[2] space-y-2">
                        <Label htmlFor="reflection" className="text-xs">Reflection (Optional)</Label>
                        <Input
                            id="reflection"
                            name="reflection"
                            placeholder="How did it feel?"
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
