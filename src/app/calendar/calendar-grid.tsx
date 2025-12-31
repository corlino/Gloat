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

interface Update {
    created_at: string
    goals: {
        title: string
    }
}

export function CalendarGrid({ updates }: { updates: any[] }) {
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

    const getUpdatesForDay = (day: Date) => {
        return updates.filter(u => isSameDay(new Date(u.created_at), day))
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
                    const dayUpdates = getUpdatesForDay(day)
                    const isCurrentMonth = isSameMonth(day, currentMonth)

                    return (
                        <div
                            key={day.toString()}
                            className={`min-h-[100px] bg-background p-2 transition-colors hover:bg-muted/50 ${!isCurrentMonth ? 'text-muted-foreground bg-muted/10' : ''
                                }`}
                        >
                            <div className="text-right text-sm mb-1">{format(day, 'd')}</div>
                            <div className="space-y-1">
                                {dayUpdates.map((update, i) => (
                                    <HoverCard key={i}>
                                        <HoverCardTrigger asChild>
                                            <div className="text-xs truncate bg-primary/10 text-primary-foreground/90 px-1.5 py-0.5 rounded cursor-default border border-primary/20 dark:text-primary">
                                                {update.goals?.title}
                                            </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-64 z-50">
                                            <p className="font-semibold text-sm">{update.goals?.title}</p>
                                            {update.numeric_value && <p className="text-xs">Value: {update.numeric_value}</p>}
                                            {update.progress_text && <p className="text-xs mt-1 text-muted-foreground">{update.progress_text}</p>}
                                        </HoverCardContent>
                                    </HoverCard>
                                ))}
                                {dayUpdates.length > 3 && (
                                    <div className="text-xs text-muted-foreground pl-1">
                                        + {dayUpdates.length - 3} more
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
