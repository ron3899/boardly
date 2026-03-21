import type { User, Board, BoardWithDetails, Group, Item, Column, ColumnValue } from '@boardly/shared'
import { ColumnType, DEFAULT_STATUS_LABELS } from '@boardly/shared'

// Mock User
export const mockUser: User = {
  id: 'user-1',
  email: 'demo@example.com',
  name: 'Demo User',
  createdAt: new Date().toISOString(),
}

// Mock Boards
export const mockBoards: Board[] = [
  {
    id: 'board-1',
    name: 'Product Development',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'board-2',
    name: 'Marketing Campaign',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'board-3',
    name: 'Team Onboarding',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock Columns for Product Development board
const mockColumns: Column[] = [
  {
    id: 'col-1',
    boardId: 'board-1',
    name: 'Status',
    type: ColumnType.STATUS,
    order: 0,
    settings: {
      labels: DEFAULT_STATUS_LABELS,
    },
  },
  {
    id: 'col-2',
    boardId: 'board-1',
    name: 'Owner',
    type: ColumnType.PERSON,
    order: 1,
    settings: {},
  },
  {
    id: 'col-3',
    boardId: 'board-1',
    name: 'Due Date',
    type: ColumnType.DATE,
    order: 2,
    settings: {},
  },
  {
    id: 'col-4',
    boardId: 'board-1',
    name: 'Priority',
    type: ColumnType.DROPDOWN,
    order: 3,
    settings: {
      options: ['High', 'Medium', 'Low'],
    },
  },
  {
    id: 'col-5',
    boardId: 'board-1',
    name: 'Progress',
    type: ColumnType.NUMBER,
    order: 4,
    settings: {
      suffix: '%',
    },
  },
]

// Mock Groups with Items
const mockGroups: Group[] = [
  {
    id: 'group-1',
    boardId: 'board-1',
    name: 'Sprint Planning',
    color: '#0073ea',
    order: 0,
    collapsed: false,
    items: [
      {
        id: 'item-1',
        groupId: 'group-1',
        name: 'Define user stories for authentication',
        order: 0,
        columnValues: [
          { id: 'cv-1', itemId: 'item-1', columnId: 'col-1', value: 'done' },
          { id: 'cv-2', itemId: 'item-1', columnId: 'col-2', value: 'Demo User' },
          { id: 'cv-3', itemId: 'item-1', columnId: 'col-3', value: '2026-03-01' },
          { id: 'cv-4', itemId: 'item-1', columnId: 'col-4', value: 'High' },
          { id: 'cv-5', itemId: 'item-1', columnId: 'col-5', value: 100 },
        ],
      },
      {
        id: 'item-2',
        groupId: 'group-1',
        name: 'Design database schema',
        order: 1,
        columnValues: [
          { id: 'cv-6', itemId: 'item-2', columnId: 'col-1', value: 'in_progress' },
          { id: 'cv-7', itemId: 'item-2', columnId: 'col-2', value: 'Demo User' },
          { id: 'cv-8', itemId: 'item-2', columnId: 'col-3', value: '2026-03-10' },
          { id: 'cv-9', itemId: 'item-2', columnId: 'col-4', value: 'High' },
          { id: 'cv-10', itemId: 'item-2', columnId: 'col-5', value: 60 },
        ],
      },
      {
        id: 'item-3',
        groupId: 'group-1',
        name: 'Setup CI/CD pipeline',
        order: 2,
        columnValues: [
          { id: 'cv-11', itemId: 'item-3', columnId: 'col-1', value: 'todo' },
          { id: 'cv-12', itemId: 'item-3', columnId: 'col-2', value: 'Demo User' },
          { id: 'cv-13', itemId: 'item-3', columnId: 'col-3', value: '2026-03-15' },
          { id: 'cv-14', itemId: 'item-3', columnId: 'col-4', value: 'Medium' },
          { id: 'cv-15', itemId: 'item-3', columnId: 'col-5', value: 0 },
        ],
      },
    ],
  },
  {
    id: 'group-2',
    boardId: 'board-1',
    name: 'Development',
    color: '#00c875',
    order: 1,
    collapsed: false,
    items: [
      {
        id: 'item-4',
        groupId: 'group-2',
        name: 'Implement user authentication',
        order: 0,
        columnValues: [
          { id: 'cv-16', itemId: 'item-4', columnId: 'col-1', value: 'in_progress' },
          { id: 'cv-17', itemId: 'item-4', columnId: 'col-2', value: 'Demo User' },
          { id: 'cv-18', itemId: 'item-4', columnId: 'col-3', value: '2026-03-08' },
          { id: 'cv-19', itemId: 'item-4', columnId: 'col-4', value: 'High' },
          { id: 'cv-20', itemId: 'item-4', columnId: 'col-5', value: 75 },
        ],
      },
      {
        id: 'item-5',
        groupId: 'group-2',
        name: 'Build board view components',
        order: 1,
        columnValues: [
          { id: 'cv-21', itemId: 'item-5', columnId: 'col-1', value: 'done' },
          { id: 'cv-22', itemId: 'item-5', columnId: 'col-2', value: 'Demo User' },
          { id: 'cv-23', itemId: 'item-5', columnId: 'col-3', value: '2026-03-05' },
          { id: 'cv-24', itemId: 'item-5', columnId: 'col-4', value: 'High' },
          { id: 'cv-25', itemId: 'item-5', columnId: 'col-5', value: 100 },
        ],
      },
      {
        id: 'item-6',
        groupId: 'group-2',
        name: 'Add drag and drop functionality',
        order: 2,
        columnValues: [
          { id: 'cv-26', itemId: 'item-6', columnId: 'col-1', value: 'in_progress' },
          { id: 'cv-27', itemId: 'item-6', columnId: 'col-2', value: 'Demo User' },
          { id: 'cv-28', itemId: 'item-6', columnId: 'col-3', value: '2026-03-12' },
          { id: 'cv-29', itemId: 'item-6', columnId: 'col-4', value: 'Medium' },
          { id: 'cv-30', itemId: 'item-6', columnId: 'col-5', value: 45 },
        ],
      },
    ],
  },
  {
    id: 'group-3',
    boardId: 'board-1',
    name: 'Testing',
    color: '#fdab3d',
    order: 2,
    collapsed: false,
    items: [
      {
        id: 'item-7',
        groupId: 'group-3',
        name: 'Write unit tests',
        order: 0,
        columnValues: [
          { id: 'cv-31', itemId: 'item-7', columnId: 'col-1', value: 'todo' },
          { id: 'cv-32', itemId: 'item-7', columnId: 'col-2', value: 'Demo User' },
          { id: 'cv-33', itemId: 'item-7', columnId: 'col-3', value: '2026-03-20' },
          { id: 'cv-34', itemId: 'item-7', columnId: 'col-4', value: 'Medium' },
          { id: 'cv-35', itemId: 'item-7', columnId: 'col-5', value: 0 },
        ],
      },
      {
        id: 'item-8',
        groupId: 'group-3',
        name: 'Perform integration testing',
        order: 1,
        columnValues: [
          { id: 'cv-36', itemId: 'item-8', columnId: 'col-1', value: 'todo' },
          { id: 'cv-37', itemId: 'item-8', columnId: 'col-2', value: 'Demo User' },
          { id: 'cv-38', itemId: 'item-8', columnId: 'col-3', value: '2026-03-25' },
          { id: 'cv-39', itemId: 'item-8', columnId: 'col-4', value: 'Low' },
          { id: 'cv-40', itemId: 'item-8', columnId: 'col-5', value: 0 },
        ],
      },
    ],
  },
]

// Mock Board with Details
export const mockBoardWithDetails: BoardWithDetails = {
  ...mockBoards[0],
  groups: mockGroups,
  columns: mockColumns,
  members: [
    {
      id: 'member-1',
      boardId: 'board-1',
      userId: 'user-1',
      role: 'owner' as const,
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      },
    },
  ],
}

// Helper to deep clone board details
function deepCloneBoardWithDetails(board: BoardWithDetails): BoardWithDetails {
  return {
    ...board,
    groups: board.groups.map(g => ({
      ...g,
      items: g.items?.map(i => ({
        ...i,
        columnValues: i.columnValues?.map(cv => ({ ...cv })) || []
      })) || []
    })),
    columns: board.columns.map(c => ({ ...c, settings: { ...c.settings } })),
    members: board.members.map(m => ({ ...m, user: { ...m.user } }))
  }
}

// In-memory storage for development mode
let boards = [...mockBoards]
let boardDetails = new Map<string, BoardWithDetails>([['board-1', deepCloneBoardWithDetails(mockBoardWithDetails)]])
let currentUser = { ...mockUser }
let isAuthenticated = false

// Helper to generate IDs
let idCounter = 100
const generateId = (prefix: string) => `${prefix}-${idCounter++}`

// Mock API functions
export const mockApi = {
  // Auth endpoints
  auth: {
    me: async () => {
      await delay(300)
      // Always return demo user - no authentication required
      return { user: currentUser }
    },
    login: async (input: { email: string; password: string }) => {
      await delay(500)
      isAuthenticated = true
      return { user: currentUser, token: 'mock-token' }
    },
    register: async (input: { email: string; password: string; name: string }) => {
      await delay(500)
      currentUser = { ...mockUser, name: input.name, email: input.email }
      isAuthenticated = true
      return { user: currentUser, token: 'mock-token' }
    },
    logout: async () => {
      await delay(300)
      isAuthenticated = false
      return {}
    },
  },

  // Board endpoints
  boards: {
    list: async () => {
      await delay(300)
      return { boards }
    },
    get: async (id: string) => {
      await delay(400)
      const board = boardDetails.get(id)
      if (!board) {
        // Create a simple board on the fly
        const simpleBoard = boards.find((b) => b.id === id)
        if (simpleBoard) {
          const newBoard: BoardWithDetails = {
            ...simpleBoard,
            groups: [],
            columns: [],
            members: [
              {
                id: generateId('member'),
                boardId: id,
                userId: currentUser.id,
                role: 'owner' as const,
                user: {
                  id: currentUser.id,
                  name: currentUser.name,
                  email: currentUser.email,
                },
              },
            ],
          }
          boardDetails.set(id, newBoard)
          return { board: newBoard }
        }
        throw new Error('Board not found')
      }
      return { board }
    },
    create: async (input: { name: string }) => {
      await delay(500)
      const newBoard: Board = {
        id: generateId('board'),
        name: input.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      boards.push(newBoard)
      const newBoardDetails: BoardWithDetails = {
        ...newBoard,
        groups: [],
        columns: [],
        members: [
          {
            id: generateId('member'),
            boardId: newBoard.id,
            userId: currentUser.id,
            role: 'owner' as const,
            user: {
              id: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
            },
          },
        ],
      }
      boardDetails.set(newBoard.id, newBoardDetails)
      return { board: newBoard }
    },
    update: async (id: string, input: { name?: string }) => {
      await delay(400)
      const board = boards.find((b) => b.id === id)
      if (!board) throw new Error('Board not found')
      if (input.name) board.name = input.name
      board.updatedAt = new Date().toISOString()

      const details = boardDetails.get(id)
      if (details && input.name) {
        details.name = input.name
        details.updatedAt = board.updatedAt
      }
      return { board }
    },
    delete: async (id: string) => {
      await delay(400)
      boards = boards.filter((b) => b.id !== id)
      boardDetails.delete(id)
      return {}
    },
  },

  // Group endpoints
  groups: {
    create: async (boardId: string, input: { name: string }) => {
      await delay(400)
      const board = boardDetails.get(boardId)
      if (!board) throw new Error('Board not found')

      const newGroup: Group = {
        id: generateId('group'),
        boardId,
        name: input.name,
        color: '#0073ea',
        order: board.groups.length,
        collapsed: false,
        items: [],
      }
      board.groups.push(newGroup)
      return { group: newGroup }
    },
    update: async (id: string, input: { name?: string; color?: string; collapsed?: boolean }) => {
      await delay(400)
      for (const board of boardDetails.values()) {
        const group = board.groups.find((g) => g.id === id)
        if (group) {
          if (input.name !== undefined) group.name = input.name
          if (input.color !== undefined) group.color = input.color
          if (input.collapsed !== undefined) group.collapsed = input.collapsed
          return { group }
        }
      }
      throw new Error('Group not found')
    },
    delete: async (id: string) => {
      await delay(400)
      for (const board of boardDetails.values()) {
        const index = board.groups.findIndex((g) => g.id === id)
        if (index !== -1) {
          board.groups.splice(index, 1)
          return {}
        }
      }
      throw new Error('Group not found')
    },
    reorder: async (groups: { id: string; order: number }[]) => {
      await delay(300)
      for (const board of boardDetails.values()) {
        for (const { id, order } of groups) {
          const group = board.groups.find((g) => g.id === id)
          if (group) group.order = order
        }
        board.groups.sort((a, b) => a.order - b.order)
      }
      return {}
    },
  },

  // Item endpoints
  items: {
    create: async (groupId: string, input: { name: string }) => {
      await delay(400)
      for (const board of boardDetails.values()) {
        const group = board.groups.find((g) => g.id === groupId)
        if (group) {
          const newItem: Item = {
            id: generateId('item'),
            groupId,
            name: input.name,
            order: group.items?.length || 0,
            columnValues: [],
          }
          if (!group.items) group.items = []
          group.items.push(newItem)
          return { item: newItem }
        }
      }
      throw new Error('Group not found')
    },
    update: async (id: string, input: { name: string }) => {
      await delay(400)
      for (const board of boardDetails.values()) {
        for (const group of board.groups) {
          const item = group.items?.find((i) => i.id === id)
          if (item) {
            item.name = input.name
            return { item }
          }
        }
      }
      throw new Error('Item not found')
    },
    delete: async (id: string) => {
      await delay(400)
      for (const board of boardDetails.values()) {
        for (const group of board.groups) {
          if (group.items) {
            const index = group.items.findIndex((i) => i.id === id)
            if (index !== -1) {
              group.items.splice(index, 1)
              return {}
            }
          }
        }
      }
      throw new Error('Item not found')
    },
    updateValue: async (itemId: string, columnId: string, input: { value: unknown }) => {
      await delay(400)
      for (const board of boardDetails.values()) {
        for (const group of board.groups) {
          const item = group.items?.find((i) => i.id === itemId)
          if (item) {
            if (!item.columnValues) item.columnValues = []
            const existing = item.columnValues.find((cv) => cv.columnId === columnId)
            if (existing) {
              existing.value = input.value
              return { columnValue: existing }
            } else {
              const newValue: ColumnValue = {
                id: generateId('cv'),
                itemId,
                columnId,
                value: input.value,
              }
              item.columnValues.push(newValue)
              return { columnValue: newValue }
            }
          }
        }
      }
      throw new Error('Item not found')
    },
    reorder: async (items: { id: string; order: number; groupId?: string }[]) => {
      await delay(300)
      for (const board of boardDetails.values()) {
        for (const { id, order, groupId } of items) {
          for (const group of board.groups) {
            const itemIndex = group.items?.findIndex((i) => i.id === id)
            if (itemIndex !== undefined && itemIndex !== -1 && group.items) {
              const [item] = group.items.splice(itemIndex, 1)
              item.order = order
              if (groupId && groupId !== item.groupId) {
                item.groupId = groupId
                const targetGroup = board.groups.find((g) => g.id === groupId)
                if (targetGroup) {
                  if (!targetGroup.items) targetGroup.items = []
                  targetGroup.items.push(item)
                }
              } else {
                group.items.push(item)
              }
            }
          }
        }
        for (const group of board.groups) {
          if (group.items) {
            group.items.sort((a, b) => a.order - b.order)
          }
        }
      }
      return {}
    },
  },

  // Column endpoints
  columns: {
    create: async (boardId: string, input: { name: string; type: string; settings?: Record<string, unknown> }) => {
      await delay(400)
      const board = boardDetails.get(boardId)
      if (!board) throw new Error('Board not found')

      const newColumn: Column = {
        id: generateId('col'),
        boardId,
        name: input.name,
        type: input.type as any,
        order: board.columns.length,
        settings: input.settings || {},
      }
      board.columns.push(newColumn)
      return { column: newColumn }
    },
    update: async (id: string, input: { name?: string; settings?: Record<string, unknown> }) => {
      await delay(400)
      for (const board of boardDetails.values()) {
        const column = board.columns.find((c) => c.id === id)
        if (column) {
          if (input.name !== undefined) column.name = input.name
          if (input.settings !== undefined) column.settings = { ...column.settings, ...input.settings }
          return { column }
        }
      }
      throw new Error('Column not found')
    },
    delete: async (id: string) => {
      await delay(400)
      for (const board of boardDetails.values()) {
        const index = board.columns.findIndex((c) => c.id === id)
        if (index !== -1) {
          board.columns.splice(index, 1)
          // Remove column values
          for (const group of board.groups) {
            for (const item of group.items || []) {
              if (item.columnValues) {
                item.columnValues = item.columnValues.filter((cv) => cv.columnId !== id)
              }
            }
          }
          return {}
        }
      }
      throw new Error('Column not found')
    },
  },
}

// Helper function to simulate network delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Reset function for testing
export function resetMockData() {
  boards = [...mockBoards]
  boardDetails = new Map([['board-1', deepCloneBoardWithDetails(mockBoardWithDetails)]])
  currentUser = { ...mockUser }
  isAuthenticated = false
  idCounter = 100
}
