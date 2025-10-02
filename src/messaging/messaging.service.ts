import { Injectable } from '@nestjs/common'
import { EmailService } from './email.service'

@Injectable()
export class MessagingService {
  constructor(private readonly emailService: EmailService) {}
  async sendEmail(
    email: string,
    name?: string,
    subject?: string,
    text?: string,
    htmlBody?: string
  ) {
    return await this.emailService.sendEmail(
      email,
      name,
      subject,
      text,
      htmlBody
    )
  }
}
