'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, Calendar, PlusCircle, Home } from 'lucide-react'

export function Navbar() {
    const pathname = usePathname()

    // Don't show navbar on login/signup pages
    if (pathname.startsWith('/login') || pathname.startsWith('/auth')) {
        return null
    }

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center max-w-4xl mx-auto px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold text-lg">Gloat</span>
                </Link>
                <div className="flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
                    <Link href="/" className={pathname === '/' ? "text-foreground" : "text-muted-foreground transition-colors hover:text-foreground"}>
                        Feed
                    </Link>
                    <Link href="/calendar" className={pathname === '/calendar' ? "text-foreground" : "text-muted-foreground transition-colors hover:text-foreground"}>
                        Calendar
                    </Link>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                    <Link href="/goals/create">
                        <Button variant="ghost" size="icon">
                            <PlusCircle className="h-5 w-5" />
                            <span className="sr-only">New Goal</span>
                        </Button>
                    </Link>
                    <Link href="/profile">
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                            <span className="sr-only">Profile</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
