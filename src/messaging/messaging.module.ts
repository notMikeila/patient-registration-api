import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { MessagingService } from './messaging.service'

@Module({
    providers: [EmailService, MessagingService],
    exports: [MessagingService, EmailService]
})
export class MessagingModule {}
