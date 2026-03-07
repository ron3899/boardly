import { LayoutDashboard, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreateBoard: () => void
}

export function EmptyState({ onCreateBoard }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6">
      {/* Icon with Monday.com style gradient background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-monday-purple to-monday-blue opacity-10 rounded-2xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-monday-purple-light to-white p-6 rounded-2xl shadow-monday-sm">
          <LayoutDashboard className="h-16 w-16 text-monday-purple" />
        </div>
      </div>

      {/* Heading */}
      <h3 className="text-2xl font-bold text-monday-text-primary mb-2 flex items-center gap-2">
        Welcome to Boardly
        <Sparkles className="h-5 w-5 text-monday-yellow" />
      </h3>

      {/* Description */}
      <p className="text-monday-text-secondary mb-8 text-center max-w-md">
        Get started by creating your first board. Organize your work, collaborate with your team,
        and achieve your goals.
      </p>

      {/* CTA Button - Monday.com primary style */}
      <Button
        onClick={onCreateBoard}
        className="bg-monday-purple hover:bg-monday-purple-dark text-white font-semibold px-6 py-2.5 h-auto rounded shadow-monday-sm hover:shadow-monday-md transition-all active:scale-95"
      >
        <LayoutDashboard className="h-4 w-4 mr-2" />
        Create your first board
      </Button>

      {/* Additional tips */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
        <div className="text-center p-4">
          <div className="h-10 w-10 rounded-full bg-monday-green/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">✓</span>
          </div>
          <h4 className="font-semibold text-sm text-monday-text-primary mb-1">
            Stay Organized
          </h4>
          <p className="text-xs text-monday-text-secondary">
            Keep all your tasks in one place
          </p>
        </div>

        <div className="text-center p-4">
          <div className="h-10 w-10 rounded-full bg-monday-blue/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">⚡</span>
          </div>
          <h4 className="font-semibold text-sm text-monday-text-primary mb-1">Work Faster</h4>
          <p className="text-xs text-monday-text-secondary">
            Streamline your workflow
          </p>
        </div>

        <div className="text-center p-4">
          <div className="h-10 w-10 rounded-full bg-monday-orange/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🚀</span>
          </div>
          <h4 className="font-semibold text-sm text-monday-text-primary mb-1">
            Achieve More
          </h4>
          <p className="text-xs text-monday-text-secondary">
            Hit your goals with ease
          </p>
        </div>
      </div>
    </div>
  )
}
