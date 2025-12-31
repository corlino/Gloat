'use client'

import { useState } from 'react'
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Badge } from '@/components/ui/badge'

interface Update {
    created_at: string
    goals: {
        id: string
        title: string
    }
    numeric_value?: number
    progress_text?: string
}

interface Goal {
    id: string
    title: string
    recurrence_type: string
    start_date: string
}

export function CalendarGrid({ updates, goals }: { updates: any[], goals: any[] }) {
    const [currentMonth, setCurrentMonth] = useState(new Date())

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    })

    const getItemsForDay = (day: Date) => {
        // 1. Existing updates
        const dayUpdates = updates.filter(u => isSameDay(new Date(u.created_at), day))

        // 2. Scheduled daily goals
        // Filter goals that are active (start_date <= day) and daily
        // and NOT already completed (in dayUpdates)
        const scheduled = goals.filter(g => {
            const start = new Date(g.start_date)
            // Check if goal started on or before this day
            if (day < start) return false

            // Check if already completed
            const isCompleted = dayUpdates.some(u => u.goals?.id === g.id)
            return !isCompleted
        }).map(g => ({
            type: 'scheduled',
            goals: { title: g.title },
            virtual: true
        }))

        // Merge updates (type 'completed' implicitly) and scheduled
        return [
            ...dayUpdates.map(u => ({ ...u, type: 'completed' })),
            ...scheduled
        ]
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold capitalize">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-background p-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}

                {calendarDays.map((day, idx) => {
                    const items = getItemsForDay(day)
                    const isCurrentMonth = isSameMonth(day, currentMonth)

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[100px] bg-background p-2 transition-colors hover:bg-muted/50 ${!isCurrentMonth ? 'text-muted-foreground bg-muted/10' : ''
                                }`}
                        >
                            <div className="text-right text-sm mb-1">{format(day, 'd')}</div>
                            <div className="space-y-1">
                                {items.map((item, i) => (
                                    <HoverCard key={i}>
                                        <HoverCardTrigger asChild>
                                            <div
                                                className={`text-xs truncate px-1.5 py-0.5 rounded cursor-default border ${item.type === 'completed'
                                                    ? 'bg-primary/10 text-primary-foreground/90 border-primary/20 dark:text-primary'
                                                    : 'bg-muted text-muted-foreground border-dashed border-muted-foreground/30'
                                                    }`}
                                            >
                                                {item.type === 'scheduled' ? '○ ' : ''}{item.goals?.title}
                                            </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-64 z-50">
                                            <p className="font-semibold text-sm">{item.goals?.title}</p>
                                            {item.type === 'completed' ? (
                                                <>
                                                    {item.numeric_value && <p className="text-xs">Value: {item.numeric_value}</p>}
                                                    {item.progress_text && <p className="text-xs mt-1 text-muted-foreground">{item.progress_text}</p>}
                                                    <Badge variant="default" className="mt-2 text-[10px] h-5">Completed</Badge>
                                                </>
                                            ) : (
                                                <p className="text-xs text-muted-foreground mt-1">Scheduled for today</p>
                                            )}
                                        </HoverCardContent>
                                    </HoverCard>
                                ))}
                                {items.length > 3 && (
                                    <div className="text-xs text-muted-foreground pl-1">
                                        + {items.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
