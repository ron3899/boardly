'use client'

import { Header } from '@/components/header'
import { Map, Clock, Zap, Sparkles } from 'lucide-react'

const roadmapData = {
  now: [
    {
      id: 1,
      title: 'AI-powered editing',
      description: 'Smart suggestions and automated content generation for your boards',
      icon: Sparkles,
    },
    {
      id: 2,
      title: 'Team collaboration',
      description: 'Real-time editing and commenting with your team members',
      icon: Zap,
    },
    {
      id: 3,
      title: 'Custom templates',
      description: 'Create and save your own board templates for quick setup',
      icon: Clock,
    },
  ],
  next: [
    {
      id: 4,
      title: 'Analytics dashboard',
      description: 'Visualize your productivity metrics and team performance',
      icon: Sparkles,
    },
    {
      id: 5,
      title: 'Mobile app',
      description: 'Native iOS and Android apps for work on the go',
      icon: Zap,
    },
    {
      id: 6,
      title: 'API integrations',
      description: 'Connect with Slack, GitHub, Jira, and more',
      icon: Clock,
    },
  ],
  later: [
    {
      id: 7,
      title: 'Offline mode',
      description: 'Work without internet and sync when you reconnect',
      icon: Sparkles,
    },
    {
      id: 8,
      title: 'Webhooks support',
      description: 'Automate workflows with custom webhook integrations',
      icon: Zap,
    },
  ],
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-[#0D0D12]">
      <Header title="Roadmap" breadcrumb="Product" />

      <div className="p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Map className="h-8 w-8 text-monday-purple" />
            <h1 className="text-3xl font-semibold text-white">
              Roadmap
            </h1>
          </div>
          <p className="text-[#9090A8] text-base">
            Track what&apos;s being built and what&apos;s coming next
          </p>
        </div>

        {/* Timeline Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Now Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <h2 className="text-xl font-semibold text-green-500">Now</h2>
            </div>
            <div className="space-y-3">
              {roadmapData.now.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1C1F3B] rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all hover:shadow-lg hover:shadow-green-500/10"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <item.icon className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-[#9090A8] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <h2 className="text-xl font-semibold text-blue-500">Next</h2>
            </div>
            <div className="space-y-3">
              {roadmapData.next.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1C1F3B] rounded-xl p-4 border border-blue-500/20 hover:border-blue-500/40 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <item.icon className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-[#9090A8] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Later Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              <h2 className="text-xl font-semibold text-purple-500">Later</h2>
            </div>
            <div className="space-y-3">
              {roadmapData.later.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1C1F3B] rounded-xl p-4 border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <item.icon className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-[#9090A8] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-[#1C1F3B] rounded-xl border border-white/10">
          <p className="text-[#9090A8] text-sm text-center">
            Have a feature request?{' '}
            <a href="#" className="text-monday-purple hover:text-monday-purple-hover underline">
              Let us know
            </a>{' '}
            what you&apos;d like to see next!
          </p>
        </div>
      </div>
    </div>
  )
}
