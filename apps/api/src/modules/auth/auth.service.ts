import type { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { RegisterInput, LoginInput } from '@boardly/shared'

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(input: RegisterInput) {
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
    // MOCK_AUTH bypass for sandbox environments
    if (process.env.MOCK_AUTH === 'true') {
      const MOCK_EMAIL = 'demo@boardly.com'
      const MOCK_PASSWORD = 'demo1234'
      if (input.email === MOCK_EMAIL && input.password === MOCK_PASSWORD) {
        return { id: 'mock-user-id', email: MOCK_EMAIL, name: 'Demo User', createdAt: new Date().toISOString() }
      }
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })
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
    // MOCK_AUTH bypass for sandbox environments
    if (process.env.MOCK_AUTH === 'true' && userId === 'mock-user-id') {
      return { id: 'mock-user-id', email: 'demo@boardly.com', name: 'Demo User', createdAt: new Date().toISOString() }
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt.toISOString() }
  }
}
