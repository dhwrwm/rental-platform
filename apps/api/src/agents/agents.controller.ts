import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Roles } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';
import { AgentParamsDto } from './dto/agent-params.dto';
import { InviteAgentDto } from './dto/invite-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get()
  findAll() {
    return this.agentsService.findAll();
  }

  @Get(':id')
  findById(@Param() params: AgentParamsDto) {
    return this.agentsService.findById(params.id);
  }

  @Roles(['ADMIN'])
  @Post('/invite')
  create(@Req() request: Request, @Body() body: InviteAgentDto) {
    return this.agentsService.invite(body);
  }

  @Roles(['ADMIN'])
  @Patch(':id')
  update(
    @Req() request: Request,
    @Param() params: AgentParamsDto,
    @Body() body: UpdateAgentDto,
  ) {
    return this.agentsService.update(params.id, body);
  }

  @Roles(['ADMIN'])
  @Delete(':id')
  remove(@Req() request: Request, @Param() params: AgentParamsDto) {
    return this.agentsService.remove(request, params.id);
  }
}
