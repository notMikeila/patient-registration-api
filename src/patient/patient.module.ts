import { Module } from '@nestjs/common'
import { PatientService } from './patient.service'
import { PatientController } from './patient.controller'
import { DrizzleModule } from '../db/drizzle.module'
import { MessagingModule } from '../messaging/messaging.module'
import { EmailService } from '../messaging/messaging.service'

@Module({
  imports: [DrizzleModule, MessagingModule],
  controllers: [PatientController],
  providers: [PatientService, EmailService],
})
export class PatientModule {}
