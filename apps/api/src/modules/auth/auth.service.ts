import type { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { RegisterInput, LoginInput } from '@boardly/shared'
import { env } from '../../config/env.js'

// Mock user for development
const MOCK_USER = {
  id: 'mock-user-1',
  email: 'demo@boardly.com',
  name: 'Demo User',
  createdAt: new Date().toISOString(),
}

export class AuthService {
  constructor(private prisma: PrismaClient | null) {}

  async register(input: RegisterInput) {
    // Mock mode
    if (env.MOCK_AUTH) {
      return {
        ...MOCK_USER,
        name: input.name,
        email: input.email,
      }
    }

    // Real mode
    if (!this.prisma) {
      throw Object.assign(new Error('Database not configured'), { statusCode: 500 })
    }

    const existing = await this.prisma.user.findUnique({ where: { email: input.email } })
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 })
    }

    const passwordHash = await bcrypt.hash(input.password, 12)
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
      },
    })

    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt.toISOString() }
  }

  async login(input: LoginInput) {
    // Mock mode
    if (env.MOCK_AUTH) {
      if (input.email === 'demo@boardly.com' && input.password === 'demo1234') {
        return MOCK_USER
      }
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    // Real mode
    if (!this.prisma) {
      throw Object.assign(new Error('Database not configured'), { statusCode: 500 })
    }

    const user = await this.prisma.user.findUnique({ where: { email: input.email } })
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
    }

    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt.toISOString() }
  }

  async getUser(userId: string) {
    // Mock mode
    if (env.MOCK_AUTH) {
      if (userId === MOCK_USER.id) {
        return MOCK_USER
      }
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }

    // Real mode
    if (!this.prisma) {
      throw Object.assign(new Error('Database not configured'), { statusCode: 500 })
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt.toISOString() }
  }
}
