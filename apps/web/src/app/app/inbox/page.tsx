'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { Header } from '@/components/header'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Bell, Clock } from 'lucide-react'

interface Activity {
  id: string
  type: 'item_created' | 'item_updated' | 'item_assigned'
  itemName: string
  boardName: string
  boardId: string
  itemId: string
  userName: string
  timestamp: string
}

function ActivityIcon({ type }: { type: Activity['type'] }) {
  switch (type) {
    case 'item_created':
      return <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">+</div>
    case 'item_updated':
      return <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">✓</div>
    case 'item_assigned':
      return <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">@</div>
    default:
      return <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">•</div>
  }
}

function ActivityMessage({ activity }: { activity: Activity }) {
  switch (activity.type) {
    case 'item_created':
      return (
        <>
          <span className="font-medium">{activity.userName}</span> created{' '}
          <span className="font-medium">{activity.itemName}</span> in{' '}
          <span className="font-medium">{activity.boardName}</span>
        </>
      )
    case 'item_updated':
      return (
        <>
          <span className="font-medium">{activity.userName}</span> updated{' '}
          <span className="font-medium">{activity.itemName}</span> in{' '}
          <span className="font-medium">{activity.boardName}</span>
        </>
      )
    case 'item_assigned':
      return (
        <>
          <span className="font-medium">{activity.userName}</span> assigned you to{' '}
          <span className="font-medium">{activity.itemName}</span> in{' '}
          <span className="font-medium">{activity.boardName}</span>
        </>
      )
    default:
      return <span>{activity.itemName}</span>
  }
}

function formatTimeAgo(timestamp: string) {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return then.toLocaleDateString()
}

export default function InboxPage() {
  // For now, we'll fetch recent boards as a proxy for activity
  // In a real app, you'd have a dedicated activities/notifications table
  const { data, isLoading } = useQuery({
    queryKey: ['boards'],
    queryFn: () => api.get<{ boards: any[] }>('/boards'),
  })

  const boards = data?.boards || []

  // Mock activities based on board updates
  const activities: Activity[] = boards.slice(0, 10).map((board, idx) => ({
    id: board.id,
    type: idx % 3 === 0 ? 'item_created' : idx % 3 === 1 ? 'item_updated' : 'item_assigned',
    itemName: `Task in ${board.name}`,
    boardName: board.name,
    boardId: board.id,
    itemId: board.id,
    userName: 'Team Member',
    timestamp: board.updatedAt,
  }))

  return (
    <div className="flex flex-col h-full">
      <Header title="Inbox">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bell className="h-4 w-4" />
          <span>{activities.length} notifications</span>
        </div>
      </Header>

      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bell className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No notifications</h3>
            <p className="text-muted-foreground">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-1">
            {activities.map((activity) => (
              <Link
                key={activity.id}
                href={`/app/boards/${activity.boardId}?item=${activity.itemId}`}
                className="block border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3">
                  <ActivityIcon type={activity.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">
                      <ActivityMessage activity={activity} />
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type.replace('_', ' ')}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
