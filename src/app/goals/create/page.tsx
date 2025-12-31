import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateGoalForm } from './create-goal-form'

export default async function CreateGoalPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    return (
        <div className="container max-w-2xl py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Create a New Goal</CardTitle>
                    <CardDescription>
                        Define what you want to achieve and how you want to track it.
                    </CardDescription>
                </CardHeader>
                <CreateGoalForm />
            </Card>
        </div>
    )
}
