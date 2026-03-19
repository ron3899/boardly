import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { LoginInput, RegisterInput } from '@boardly/shared';

const MOCK_USER = {
  id: 'mock-user-1',
  email: 'demo@boardly.com',
  name: 'Demo User',
  createdAt: new Date(),
};

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(input: RegisterInput) {
    if (process.env.MOCK_AUTH === 'true') {
      return { id: 'mock-user-2', email: input.email, name: input.name, createdAt: new Date() };
    }
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw { statusCode: 409, message: 'Email already in use' };
    const hashed = await bcrypt.hash(input.password, 12);
    const user = await this.prisma.user.create({
      data: { email: input.email, name: input.name, password: hashed },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    return user;
  }

  async login(input: LoginInput) {
    if (process.env.MOCK_AUTH === 'true') {
      return { id: MOCK_USER.id, email: input.email, name: MOCK_USER.name, createdAt: MOCK_USER.createdAt };
    }
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw { statusCode: 401, message: 'Invalid credentials' };
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw { statusCode: 401, message: 'Invalid credentials' };
    return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt };
  }

  async getUser(userId: string) {
    if (process.env.MOCK_AUTH === 'true') {
      return { id: userId, email: MOCK_USER.email, name: MOCK_USER.name, createdAt: MOCK_USER.createdAt };
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    if (!user) throw { statusCode: 404, message: 'User not found' };
    return user;
  }
}
