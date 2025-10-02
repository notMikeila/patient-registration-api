import { Module } from '@nestjs/common'
import { PatientService } from './patient.service'
import { PatientController } from './patient.controller'
import { DrizzleModule } from '../db/drizzle.module'
import { MessagingModule } from '../messaging/messaging.module'

@Module({
  imports: [DrizzleModule, MessagingModule],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
