import 'dotenv/config';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { admin } from 'better-auth/plugins/admin';
import { adminAc, userAc } from 'better-auth/plugins/admin/access';
import { prisma } from './lib/prisma';

const apiOrigin = process.env.API_URL ?? 'http://localhost:3001';
const webOrigin = process.env.WEB_URL ?? 'http://localhost:3000';

const authOptions = {
  appName: 'Rental Platform',
  baseURL: apiOrigin,
  trustedOrigins: [webOrigin],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: 'USER',
      adminRoles: ['ADMIN'],
      roles: {
        ADMIN: adminAc,
        USER: userAc,
        HOMEOWNER: userAc,
        AGENT: userAc,
      },
    }),
  ],
  user: {
    modelName: 'User',
    additionalFields: {
      phone: {
        type: 'string',
        required: false,
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
} satisfies BetterAuthOptions;

export const auth = betterAuth(authOptions) as unknown as ReturnType<
  typeof betterAuth
>;
