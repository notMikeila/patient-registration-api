import { Module } from '@nestjs/common'
import { Pool } from 'pg'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export const DRIZZLE = Symbol('drizzle-connection')

@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: async () => {
        const pool = new Pool({
          connectionString: process.env.DATABASE_URL,
        })
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
