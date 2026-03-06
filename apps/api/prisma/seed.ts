import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12)

  const user = await prisma.user.upsert({
    where: { email: 'demo@boardly.dev' },
    update: {},
    create: {
      email: 'demo@boardly.dev',
      name: 'Demo User',
      passwordHash,
    },
  })

  const board = await prisma.board.create({
    data: {
      name: 'My First Board',
      members: {
        create: { userId: user.id, role: 'owner' },
      },
      columns: {
        create: [
          {
            name: 'Status',
            type: 'status',
            order: 0,
            settings: {
              labels: {
                todo: { color: '#c4c4c4', label: 'To Do' },
                in_progress: { color: '#fdab3d', label: 'Working on it' },
                done: { color: '#00c875', label: 'Done' },
                stuck: { color: '#e2445c', label: 'Stuck' },
              },
            },
          },
          { name: 'Due Date', type: 'date', order: 1 },
          { name: 'Priority', type: 'dropdown', order: 2, settings: { options: ['Low', 'Medium', 'High', 'Critical'] } },
        ],
      },
      groups: {
        create: [
          { name: 'To Do', color: '#579bfc', order: 0 },
          { name: 'In Progress', color: '#fdab3d', order: 1 },
          { name: 'Done', color: '#00c875', order: 2 },
        ],
      },
    },
    include: { groups: true, columns: true },
  })

  const statusCol = board.columns.find((c) => c.name === 'Status')!
  const todoGroup = board.groups.find((g) => g.name === 'To Do')!
  const inProgressGroup = board.groups.find((g) => g.name === 'In Progress')!

  await prisma.item.create({
    data: {
      name: 'Set up project',
      groupId: inProgressGroup.id,
      order: 0,
      columnValues: { create: { columnId: statusCol.id, value: '"in_progress"' } },
    },
  })

  await prisma.item.create({
    data: {
      name: 'Design database schema',
      groupId: todoGroup.id,
      order: 0,
      columnValues: { create: { columnId: statusCol.id, value: '"todo"' } },
    },
  })

  console.log('Seed complete')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
