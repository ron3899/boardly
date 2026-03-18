import bcrypt from 'bcrypt'
import type { RegisterInput, LoginInput } from '@boardly/shared'
import { randomUUID } from 'crypto'

interface MockUser {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: string
}

export class MockAuthService {
  private users: Map<string, MockUser>
  private emailIndex: Map<string, string> // email -> userId mapping

  constructor() {
    this.users = new Map()
    this.emailIndex = new Map()
    this.seedDefaultUser()
  }

  private async seedDefaultUser() {
    const defaultUserId = randomUUID()
    const passwordHash = await bcrypt.hash('demo1234', 12)
    const defaultUser: MockUser = {
      id: defaultUserId,
      email: 'demo@boardly.com',
      name: 'Demo User',
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    this.users.set(defaultUserId, defaultUser)
    this.emailIndex.set(defaultUser.email, defaultUserId)

    console.log('[MockAuth] ✓ Seeded default user: demo@boardly.com / demo1234')
  }

  async register(input: RegisterInput) {
    const existingUserId = this.emailIndex.get(input.email)
    if (existingUserId) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 })
    }

    const userId = randomUUID()
    const passwordHash = await bcrypt.hash(input.password, 12)
    const user: MockUser = {
      id: userId,
      email: input.email,
      name: input.name,
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    this.users.set(userId, user)
    this.emailIndex.set(user.email, userId)

    console.log(`[MockAuth] ✓ Registered new user: ${user.email}`)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }
  }

  async login(input: LoginInput) {
    const userId = this.emailIndex.get(input.email)
    if (!userId) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    const user = this.users.get(userId)
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    console.log(`[MockAuth] ✓ User logged in: ${user.email}`)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }
  }

  async getUser(userId: string) {
    const user = this.users.get(userId)
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }
  }
}
