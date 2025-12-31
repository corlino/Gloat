'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const username = formData.get('username') as string
    const displayName = formData.get('displayName') as string
    const bio = formData.get('bio') as string
    const isPrivate = formData.get('isPrivate') === 'on'

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            username,
            display_name: displayName,
            bio,
            is_private: isPrivate,
            updated_at: new Date().toISOString(),
        })

    if (error) {
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/profile')
    revalidatePath('/')
    return { message: 'Profile updated successfully' }
}
