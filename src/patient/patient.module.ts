import { Module } from '@nestjs/common'
import { PatientService } from './patient.service'
import { PatientController } from './patient.controller'
import { DrizzleModule } from 'src/db/drizzle.module'
import { MessagingModule } from 'src/messaging/messaging.module'
import { MessagingService } from 'src/messaging/messaging.service'

@Module({
  imports: [DrizzleModule, MessagingModule],
  controllers: [PatientController],
  providers: [PatientService, MessagingService],
})
export class PatientModule {}
