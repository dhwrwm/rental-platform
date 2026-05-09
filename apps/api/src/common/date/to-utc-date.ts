import { BadRequestException } from '@nestjs/common';

export function toUtcDate(value: string | Date) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('Invalid date value');
  }

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}
