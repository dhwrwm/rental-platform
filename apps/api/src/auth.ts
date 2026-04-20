import 'dotenv/config';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import { prisma } from './lib/prisma';

const apiOrigin = process.env.API_URL ?? 'http://localhost:3001';
const webOrigin = process.env.WEB_URL ?? 'http://localhost:3000';

export const auth = betterAuth({
  appName: 'Rental Platform',
  baseURL: apiOrigin,
  trustedOrigins: [webOrigin],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: 'User',
    additionalFields: {
      firstName: {
        type: 'string',
        required: false,
      },
      lastName: {
        type: 'string',
        required: false,
      },
      phone: {
        type: 'string',
        required: false,
      },
      role: {
        type: ['USER', 'ADMIN', 'HOMEOWNER', 'AGENT'],
        required: false,
        defaultValue: 'USER',
        input: false,
      },
    },
  },
  session: {
    modelName: 'Session',
  },
  account: {
    modelName: 'Account',
  },
  verification: {
    modelName: 'Verification',
  },
});
