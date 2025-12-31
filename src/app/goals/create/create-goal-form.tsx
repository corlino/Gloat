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
                        <Label htmlFor="timeframe">Timeframe</Label>
                        <Select name="timeframe" required defaultValue="monthly">
                            <SelectTrigger>
                                <SelectValue placeholder="Select timeframe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
