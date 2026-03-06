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
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt.toISOString() }
  }
}
