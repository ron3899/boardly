import bcrypt from 'bcrypt'
import type { RegisterInput, LoginInput } from '@boardly/shared'

interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: string
}

// In-memory user store
const users = new Map<string, User>()

// Hardcode demo user
const DEMO_USER: User = {
  id: 'user-1',
  email: 'demo@boardly.com',
  name: 'Demo User',
  passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oBzp.7qAYjqG', // bcrypt hash of "demo1234"
  createdAt: new Date('2024-01-01').toISOString(),
}

// Initialize with demo user
users.set(DEMO_USER.email, DEMO_USER)
users.set(DEMO_USER.id, DEMO_USER)

export class AuthService {
  constructor() {}

  async register(input: RegisterInput) {
    const existing = users.get(input.email)
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 })
    }

    const passwordHash = await bcrypt.hash(input.password, 12)
    const userId = `user-${Date.now()}`
    const user: User = {
      id: userId,
      email: input.email,
      name: input.name,
      passwordHash,
      createdAt: new Date().toISOString(),
    }

    // Store by both email and id for easy lookup
    users.set(user.email, user)
    users.set(user.id, user)

    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
  }

  async login(input: LoginInput) {
    const user = users.get(input.email)
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
  }

  async getUser(userId: string) {
    const user = users.get(userId)
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
  }
}
