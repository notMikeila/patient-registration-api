import { Module } from '@nestjs/common'
import { EmailService } from './messaging.service'

@Module({
    providers: [EmailService],
})
export class MessagingModule {}
