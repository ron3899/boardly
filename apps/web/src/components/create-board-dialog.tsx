'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateBoard } from '@/hooks/use-boards'
import { useToast } from '@/components/ui/toast'
import { useRouter } from 'next/navigation'
import { Check, LayoutGrid, Kanban, ClipboardList, Bug, Map, Calendar } from 'lucide-react'

interface CreateBoardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Board templates with icons and descriptions
const templates = [
  {
    name: 'Blank Board',
    icon: LayoutGrid,
    color: '#6161FF',
    description: 'Start from scratch',
    defaultName: 'My Board',
  },
  {
    name: 'Project Tracker',
    icon: Kanban,
    color: '#00C875',
    description: 'Track tasks and milestones',
    defaultName: 'My Project Tracker',
  },
  {
    name: 'Sprint Planning',
    icon: ClipboardList,
    color: '#FDAB3D',
    description: 'Manage sprints and backlogs',
    defaultName: 'Sprint Planning',
  },
  {
    name: 'Bug Tracker',
    icon: Bug,
    color: '#E2445C',
    description: 'Log and prioritize issues',
    defaultName: 'Bug Tracker',
  },
  {
    name: 'Roadmap',
    icon: Map,
    color: '#579BFC',
    description: 'Plan features and releases',
    defaultName: 'Product Roadmap',
  },
  {
    name: 'Meeting Agenda',
    icon: Calendar,
    color: '#A25DDC',
    description: 'Structure meeting topics',
    defaultName: 'Meeting Agenda',
  },
]

// Monday.com color palette for board selection
const boardColors = [
  { name: 'Purple', value: '#6161FF' },
  { name: 'Green', value: '#00C875' },
  { name: 'Orange', value: '#FDAB3D' },
  { name: 'Red', value: '#E2445C' },
  { name: 'Blue', value: '#579BFC' },
  { name: 'Pink', value: '#FF7575' },
  { name: 'Violet', value: '#A25DDC' },
]

// Board icon emojis
const boardIcons = ['📊', '🎯', '📝', '💼', '🚀', '📈', '✨', '🎨']

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [name, setName] = useState(templates[0].defaultName)
  const [description, setDescription] = useState('')
  const [selectedColor, setSelectedColor] = useState(boardColors[0].value)
  const [selectedIcon, setSelectedIcon] = useState(boardIcons[0])

  const createBoard = useCreateBoard()
  const { toast } = useToast()
  const router = useRouter()

  // Reset form when dialog opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset to defaults
      setTimeout(() => {
        setStep(1)
        setSelectedTemplate(templates[0])
        setName(templates[0].defaultName)
        setDescription('')
        setSelectedColor(boardColors[0].value)
        setSelectedIcon(boardIcons[0])
      }, 200)
    }
    onOpenChange(newOpen)
  }

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setSelectedTemplate(template)
    setName(template.defaultName)
    setSelectedColor(template.color)
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return

    try {
      const { board } = await createBoard.mutateAsync({
        name: name.trim(),
        color: selectedColor
      })
      toast({ title: 'Board created successfully' })
      handleOpenChange(false)
      router.push(`/app/boards/${board.id}`)
    } catch {
      toast({ title: 'Failed to create board', variant: 'destructive' })
    }
  }

  const stepTitles = ['Choose a template', 'Board details', 'Review & create']
  const progressWidth = `${(step / 3) * 100}%`

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-xl border-0 shadow-xl p-0">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold text-[#323338] dark:text-[#F0F0F5]">
              {stepTitles[step - 1]}
            </DialogTitle>

            {/* Step Progress Bar */}
            <div className="mt-3 h-1 bg-[#E6E9EF] dark:bg-[#2A2A38] rounded-full overflow-hidden">
              <div
                className="h-full bg-monday-purple transition-all duration-300 ease-out"
                style={{ width: progressWidth }}
              />
            </div>

            {/* Step Indicator Dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2, 3].map((dotStep) => (
                <div
                  key={dotStep}
                  className={`h-2 w-2 rounded-full transition-all duration-200 ${
                    dotStep <= step
                      ? 'bg-monday-purple w-6'
                      : 'bg-[#E6E9EF] dark:bg-[#2A2A38]'
                  }`}
                />
              ))}
            </div>
          </DialogHeader>

          {/* Step Content */}
          <div className="min-h-[380px]">
            {/* Step 1: Template Selection */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  {templates.map((template) => {
                    const Icon = template.icon
                    const isSelected = selectedTemplate.name === template.name
                    return (
                      <button
                        key={template.name}
                        onClick={() => handleTemplateSelect(template)}
                        className={`group relative rounded-lg p-5 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-2 border-monday-purple bg-monday-purple/5 dark:bg-monday-purple/10 shadow-lg'
                            : 'border-2 border-[#E6E9EF] dark:border-[#2A2A38] hover:border-monday-purple/50 hover:shadow-md'
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${template.color}15` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: template.color }} />
                        </div>
                        <h3 className="font-semibold text-[15px] text-[#323338] dark:text-[#F0F0F5] mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-[#676879] dark:text-[#9090A8]">
                          {template.description}
                        </p>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="w-6 h-6 rounded-full bg-monday-purple flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Board Details */}
            {step === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Board Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#323338] dark:text-[#F0F0F5]">
                    Board name <span className="text-monday-danger">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Marketing Campaign"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="h-11 border-[#E6E9EF] dark:border-[#2A2A38] focus:border-monday-purple focus:ring-monday-purple/20"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#323338] dark:text-[#F0F0F5]">
                    Description <span className="text-xs text-[#676879] dark:text-[#9090A8] font-normal">(optional)</span>
                  </label>
                  <Textarea
                    placeholder="What's this board for?"
                    value={description}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        setDescription(e.target.value)
                      }
                    }}
                    maxLength={200}
                    className="border-[#E6E9EF] dark:border-[#2A2A38] focus:border-monday-purple focus:ring-monday-purple/20 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <span className="text-xs text-[#9699A6] dark:text-[#5A5A70]">
                      {description.length}/200
                    </span>
                  </div>
                </div>

                {/* Board Color */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#323338] dark:text-[#F0F0F5]">
                    Board color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {boardColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className="relative w-7 h-7 rounded-full transition-all hover:scale-110"
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {selectedColor === color.value && (
                          <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Board Icon */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#323338] dark:text-[#F0F0F5]">
                    Board icon
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {boardIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all hover:scale-110 ${
                          selectedIcon === icon
                            ? 'bg-monday-purple/15 border-2 border-monday-purple'
                            : 'bg-[#F6F7FB] dark:bg-[#2A2A38] border-2 border-transparent hover:border-[#E6E9EF] dark:hover:border-[#3A3A48]'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Create */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <p className="text-sm text-[#676879] dark:text-[#9090A8]">
                  Review your board before creating
                </p>

                {/* Preview Card */}
                <div className="relative rounded-lg bg-white dark:bg-[#17171F] monday-card-shadow p-6 border border-[#E6E9EF] dark:border-[#2A2A38]">
                  {/* Top colored strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 rounded-t-lg"
                    style={{ backgroundColor: selectedColor }}
                  />

                  <div className="flex items-start gap-4 mt-2">
                    {/* Board Icon */}
                    <div className="text-4xl flex-shrink-0">{selectedIcon}</div>

                    {/* Board Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-[#323338] dark:text-[#F0F0F5] mb-1">
                        {name || 'Untitled Board'}
                      </h3>
                      {description && (
                        <p className="text-sm text-[#676879] dark:text-[#9090A8] line-clamp-1">
                          {description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedColor }} />
                          <span className="text-xs text-[#9699A6] dark:text-[#5A5A70]">
                            {boardColors.find(c => c.value === selectedColor)?.name} board
                          </span>
                        </div>
                        <span className="text-xs text-[#9699A6] dark:text-[#5A5A70]">
                          Template: {selectedTemplate.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Info */}
                <div className="bg-[#F6F7FB] dark:bg-[#2A2A38]/50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#676879] dark:text-[#9090A8]">Board name:</span>
                    <span className="font-medium text-[#323338] dark:text-[#F0F0F5]">{name}</span>
                  </div>
                  {description && (
                    <div className="flex items-start justify-between text-sm gap-4">
                      <span className="text-[#676879] dark:text-[#9090A8] flex-shrink-0">Description:</span>
                      <span className="font-medium text-[#323338] dark:text-[#F0F0F5] text-right">{description}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#676879] dark:text-[#9090A8]">Template:</span>
                    <span className="font-medium text-[#323338] dark:text-[#F0F0F5]">{selectedTemplate.name}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-[#E6E9EF] dark:border-[#2A2A38]">
            <div>
              {step > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  className="text-[#676879] dark:text-[#9090A8] hover:bg-[#F6F7FB] dark:hover:bg-[#2A2A38]"
                >
                  Back
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
                className="text-[#676879] dark:text-[#9090A8] hover:bg-[#F6F7FB] dark:hover:bg-[#2A2A38]"
              >
                Cancel
              </Button>

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={step === 2 && !name.trim()}
                  className="bg-monday-purple hover:bg-monday-purple-hover text-white font-medium"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!name.trim() || createBoard.isPending}
                  className="bg-monday-purple hover:bg-monday-purple-hover text-white font-medium"
                >
                  {createBoard.isPending ? 'Creating...' : 'Create Board'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
