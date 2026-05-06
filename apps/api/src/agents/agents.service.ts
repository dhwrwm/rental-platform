import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';
import { PrismaService } from '../common/prisma/prisma.service';
import { InviteAgentDto } from './dto/invite-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { Role } from '../generated/prisma';

const agentSelect = {
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

type AdminAuthApi = {
  createUser(input: {
    headers: Headers;
    body: {
      email: string;
      name: string;
      password: string;
      role: 'AGENT';
      data: {
        phone?: string;
      };
    };
  }): Promise<{
    user: unknown;
  }>;
  adminUpdateUser(input: {
    headers: Headers;
    body: {
      userId: string;
      data: Record<string, unknown>;
    };
  }): Promise<unknown>;
  setUserPassword(input: {
    headers: Headers;
    body: {
      userId: string;
      newPassword: string;
    };
  }): Promise<unknown>;
  removeUser(input: {
    headers: Headers;
    body: {
      userId: string;
    };
  }): Promise<unknown>;
};

@Injectable()
export class AgentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  private get adminApi(): AdminAuthApi {
    return this.authService.api as unknown as AdminAuthApi;
  }

  async findAll() {
    const agents = await this.prismaService.client.user.findMany({
      where: {
        role: 'AGENT',
      },
      select: agentSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return agents.map((agent) => {
      const { _count, ...rest } = agent;

      return {
        ...rest,
        counts: _count,
      };
    });
  }

  async findById(id: string) {
    const agent = await this.prismaService.client.user.findFirst({
      where: {
        id,
        role: 'AGENT',
      },
      select: agentSelect,
    });

    if (!agent) {
      throw new NotFoundException(`Agent ${id} was not found`);
    }

    const { _count, ...rest } = agent;

    return {
      ...rest,
      counts: _count,
    };
  }

  async invite(dto: InviteAgentDto) {
    const existingAgent = await this.prismaService.client.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingAgent) {
      throw new ConflictException(
        `A user with email ${dto.email} already exists`,
      );
    }

    const agent = await this.prismaService.client.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        role: 'AGENT',
        phone: dto.phone,
      },
      select: agentSelect,
    });

    return agent;
  }

  async update(id: string, dto: UpdateAgentDto) {
    await this.ensureAgentExists(id);

    return this.prismaService.client.user.update({
      where: { id },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        isActive: dto.isActive,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(request: Request, id: string) {
    await this.findById(id);

    await this.adminApi.removeUser({
      headers: fromNodeHeaders(request.headers),
      body: {
        userId: id,
      },
    });

    return {
      success: true,
    };
  }

  private async ensureAgentExists(id: string) {
    const agent = await this.prismaService.client.user.findFirst({
      where: { id, role: Role.AGENT },
      select: { id: true },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }
}
