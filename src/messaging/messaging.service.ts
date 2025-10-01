import { Injectable } from '@nestjs/common';
import {
  TestAccount,
  Transporter,
  createTestAccount,
  createTransport,
} from 'nodemailer';

@Injectable()
export class MessagingService {
  private account: TestAccount;
  private mailService: Transporter;

  private async createTestAccount() {
    if (!this.account) {
      await createTestAccount((err, account) => {
        if (err) {
          console.error('Failed to create a testing account. ' + err.message);
          return;
        }
        this.account = account;
        console.log(account);
      });
    } else {
      return this.account;
    }
  }

  private async createTransport() {
    if (!this.mailService) {
      await this.createTestAccount();
      this.mailService = createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: this.account.user,
          pass: this.account.pass,
        },
      });
    } else {
      return this.mailService;
    }
  }

  async sendEmail(
    email: string,
    name?: string,
    subject?: string,
    text?: string,
    htmlBody?: string,
  ) {
    const message = {
      from: 'Your Trusted App <info@appdomain.com>',
      to: name ? `${name} <${email}>` : email,
      subject: subject,
    };

    if (htmlBody) {
      message['html'] = htmlBody;
    } else if (text) {
      message['text'] = text;
    } else {
      console.error('No email body provided');
      return;
    }

    await this.createTransport();

    this.mailService.sendMail(message, (err, info) => {
      if (err) {
        console.error(`Error sending email: ${JSON.stringify(err.message)}`);
        return;
      }
      console.log(`Message correctly sent to ${email}`);
    });
  }
}
