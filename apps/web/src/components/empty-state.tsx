import { LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onCreateBoard: () => void
}

export function EmptyState({ onCreateBoard }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {/* Large Icon with Monday.com styling */}
      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-monday-purple/10 to-monday-info/10 flex items-center justify-center mb-6">
        <LayoutGrid className="h-16 w-16 text-monday-purple" strokeWidth={1.5} />
      </div>

      {/* Heading */}
      <h3 className="text-2xl font-semibold text-[#323338] mb-2">
        Create your first board
      </h3>

      {/* Subtext */}
      <p className="text-[#676879] text-center max-w-md mb-8">
        Boards help you manage your work visually. Get started by creating your first board and invite your team to collaborate.
      </p>

      {/* CTA Button */}
      <Button
        onClick={onCreateBoard}
        className="bg-monday-purple hover:bg-monday-purple-hover text-white font-medium px-6 py-5 h-auto text-base rounded-lg shadow-lg hover:shadow-xl transition-all"
      >
        Create your first board
      </Button>

      {/* Optional: Additional tips */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-monday-success/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">✨</span>
          </div>
          <h4 className="text-sm font-semibold text-[#323338] mb-1">Easy to use</h4>
          <p className="text-xs text-[#9699A6]">Intuitive drag-and-drop interface</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-monday-info/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🤝</span>
          </div>
          <h4 className="text-sm font-semibold text-[#323338] mb-1">Collaborate</h4>
          <p className="text-xs text-[#9699A6]">Work together in real-time</p>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-monday-warning/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">📊</span>
          </div>
          <h4 className="text-sm font-semibold text-[#323338] mb-1">Track progress</h4>
          <p className="text-xs text-[#9699A6]">Visualize your workflow</p>
        </div>
      </div>
    </div>
  )
}
