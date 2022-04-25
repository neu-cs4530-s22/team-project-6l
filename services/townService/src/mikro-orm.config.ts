import { FlushMode, MikroORM } from '@mikro-orm/core';
import path from 'path';
import InvitationMessage from './types/InvitationMessage';
import User from './types/User';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'), // path to the folder with migrations
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    disableForeignKeys: false,
  },
  seeder: {
    path: './src/seeders/',
  },
  entities: [User, InvitationMessage],
  clientUrl: process.env.DATABASE_URL,
  type: 'postgresql',
  debug: true,
  driverOptions: {
    connection: { ssl: { rejectUnauthorized: false } },
  },
  flushMode: FlushMode.ALWAYS,
  allowGlobalContext: true,
} as Parameters<typeof MikroORM.init>[0];
