'use client'

import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createGoal } from '../actions'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { Plus, X } from 'lucide-react'

function ChecklistManager() {
    const [items, setItems] = useState<string[]>([])
    const [newItem, setNewItem] = useState('')

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()])
            setNewItem('')
        }
    }

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add a checklist item (e.g., 'Drink water')"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            addItem()
                        }
                    }}
                />
                <Button type="button" variant="outline" size="icon" onClick={addItem}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {items.length > 0 && (
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 bg-muted/50 p-2 rounded-md text-sm">
                            <span className="flex-1">{item}</span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(index)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
            <input type="hidden" name="checklist" value={JSON.stringify(items)} />
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Creating Goal...' : 'Create Goal'}
        </Button>
    )
}

export function CreateGoalForm() {
    async function handleSubmit(formData: FormData) {
        await createGoal(formData)
    }

    return (
        <form action={handleSubmit}>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input id="title" name="title" placeholder="Run a Marathon" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Why it matters (Optional)</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="I want to prove to myself..."
                        className="resize-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required defaultValue="health">
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="health">Health & Fitness</SelectItem>
                                <SelectItem value="career">Career & Business</SelectItem>
                                <SelectItem value="learning">Is Learning</SelectItem>
                                <SelectItem value="creative">Creative</SelectItem>
                                <SelectItem value="financial">Financial</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="timeframe">Goal Duration</Label>
                        <Select name="timeframe" required defaultValue="monthly">
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly Goal</SelectItem>
                                <SelectItem value="yearly">Yearly Goal</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="recurrence">Recurrence (How often?)</Label>
                    <Select name="recurrence" defaultValue="none">
                        <SelectTrigger>
                            <SelectValue placeholder="Select recurrence" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">One-time / As needed</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <Label>Checklist (Things to do for this goal)</Label>
                    <ChecklistManager />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input type="date" id="startDate" name="startDate" required defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date (Optional)</Label>
                        <Input type="date" id="endDate" name="endDate" />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label>Privacy</Label>
                    <RadioGroup defaultValue="public" name="privacy" className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="public" id="privacy-public" />
                            <Label htmlFor="privacy-public" className="font-normal">
                                Public (Visible to everyone)
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="followers" id="privacy-followers" />
                            <Label htmlFor="privacy-followers" className="font-normal">
                                Followers Only
                            </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-y-0">
                            <RadioGroupItem value="private" id="privacy-private" />
                            <Label htmlFor="privacy-private" className="font-normal">
                                Private (Only you)
                            </Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
            <CardFooter>
                <SubmitButton />
            </CardFooter>
        </form>
    )
}
