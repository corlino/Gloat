import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="container max-w-2xl py-10 mx-auto min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                        Manage your public profile and visibility settings.
                    </CardDescription>
                </CardHeader>
                <ProfileForm user={user} profile={profile} />
            </Card>
        </div>
    )
}
