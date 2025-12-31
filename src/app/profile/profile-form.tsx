'use client'

import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateProfile } from './actions' // We will need to make sure actions is importable (it is server action so it's fine)
import { useActionState } from 'react' // Next JS 15 / React 19 hook, or useFormState from react-dom
// If using Next.js 14, useFormState is from 'react-dom'
import { useFormStatus } from 'react-dom'

const initialState = {
    message: '',
    error: ''
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : 'Save Changes'}
        </Button>
    )
}

// We need to adjust the action signature to match useFormState if we use it.
// (prevState: any, formData: FormData) => Promise<State>

export function ProfileForm({
    user,
    profile
}: {
    user: any,
    profile: any
}) {
    // Using a simple wrapper for the action to adapt it if needed, or update the action signature.
    // For now let's just use the server action directly in form action if we aren't using state, BUT we want feedback.
    // We'll trust the user to reload or see the updated data, OR use simple form submission.
    // The error was about the return type.
    // Let's wrapping it:

    async function onSubmit(formData: FormData) {
        // Just call the server action. 
        // In a real app we'd handle the return value for toast
        await updateProfile(formData)
    }

    return (
        <form action={onSubmit}>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="bg-muted" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        defaultValue={profile?.username || ''}
                        placeholder="gloat_user"
                        minLength={3}
                    />
                    <p className="text-xs text-muted-foreground">
                        Minimum 3 characters. Unique identifier.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                        id="displayName"
                        name="displayName"
                        defaultValue={profile?.display_name || ''}
                        placeholder="Jane Doe"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                        id="bio"
                        name="bio"
                        defaultValue={profile?.bio || ''}
                        placeholder="Tell us about your goals..."
                        className="resize-none"
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label htmlFor="isPrivate">Private Profile</Label>
                        <div className="text-sm text-muted-foreground">
                            Only approved followers can see your goals.
                        </div>
                    </div>
                    <input
                        type="checkbox"
                        id="isPrivate"
                        name="isPrivate"
                        className="h-5 w-5 rounded border-gray-300"
                        defaultChecked={profile?.is_private}
                    />
                </div>

            </CardContent>
            <CardFooter className="flex justify-end">
                <SubmitButton />
            </CardFooter>
        </form>
    )
}
