import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

const userSelect = {
  id: true,
  name: true,
  email: true,
  emailVerified: true,
  image: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      bookings: true,
      listings: true,
    },
  },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMe(sessionUserId: string) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id: sessionUserId },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User ${sessionUserId} was not found`);
    }

    return user;
  }

  async findAll() {
    const users = await this.prismaService.client.user.findMany({
      select: userSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map((user) => {
      const { _count, ...rest } = user;

      return {
        ...rest,
        counts: _count,
      };
    });
  }

  async findById(id: string) {
    const user = await this.prismaService.client.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundException(`User ${id} was not found`);
    }

    const { _count, ...rest } = user;

    return {
      ...rest,
      counts: _count,
    };
  }
}
