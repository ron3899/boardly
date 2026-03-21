'use client'

import { Header } from '@/components/header'
import { Bell, CheckCircle2, UserPlus, MessageSquare, AlertCircle } from 'lucide-react'

// Mock activity data
const mockActivities = [
  {
    id: '1',
    type: 'item_update',
    icon: CheckCircle2,
    color: '#00C875',
    message: 'Item "Q1 Marketing Campaign" was completed',
    board: 'Marketing Board',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'member_added',
    icon: UserPlus,
    color: '#579BFC',
    message: 'Sarah was added to "Product Roadmap"',
    board: 'Product Roadmap',
    time: '5 hours ago',
  },
  {
    id: '3',
    type: 'comment',
    icon: MessageSquare,
    color: '#FDAB3D',
    message: 'New comment on "Design Review"',
    board: 'Design Board',
    time: 'Yesterday',
  },
  {
    id: '4',
    type: 'due_date',
    icon: AlertCircle,
    color: '#E2445C',
    message: 'Item "Launch Website" is due today',
    board: 'Launch Board',
    time: 'Yesterday',
  },
]

export default function InboxPage() {
  const hasNotifications = mockActivities.length > 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Inbox" breadcrumb="Notifications" />

      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-monday-info" />
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Inbox
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Stay updated with your team's activities
          </p>
        </div>

        {/* Notifications List */}
        {!hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-monday-info/10 dark:bg-monday-info/20 flex items-center justify-center mb-4">
              <Bell className="h-10 w-10 text-monday-info" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              All caught up!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              You have no new notifications at this time
            </p>
          </div>
        ) : (
          <div className="max-w-4xl">
            <div className="bg-white dark:bg-gray-800 rounded-lg monday-card-shadow divide-y divide-gray-200 dark:divide-gray-700">
              {mockActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div
                    key={activity.id}
                    className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${activity.color}20` }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{ color: activity.color }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {activity.message}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-medium">{activity.board}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>

                      {/* Unread indicator */}
                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-monday-purple" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Mark all as read button */}
            <div className="mt-4 flex justify-center">
              <button className="text-sm text-monday-purple hover:text-monday-purple-hover font-medium transition-colors">
                Mark all as read
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
