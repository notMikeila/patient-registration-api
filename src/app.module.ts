import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { MessagingModule } from './messaging/messaging.module'
import { PatientModule } from './patient/patient.module'

@Module({
  controllers: [AppController],
  imports: [MessagingModule, PatientModule],
})
export class AppModule {}
