import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import {
  TestAccount,
  Transporter,
  createTestAccount,
  createTransport,
} from 'nodemailer'

@Injectable()
export class EmailService {
  private account: TestAccount
  private mailService: Transporter

  constructor() {
    this.initializeService()
  }

  private initializeService() {
    this.createTestAccount()
      .then(() => {
        this.createTransport()
      })
      .catch((error) => {
        Logger.error(
          `Failed to initialize email service: ${JSON.stringify(error)}`
        )
      })
  }

  private createTestAccount(): Promise<TestAccount> {
    return new Promise((resolve, reject) => {
      if (!this.account) {
        createTestAccount((err, account) => {
          if (err) {
            Logger.error(`Failed to create a testing account. ${err.message}`)
            reject(new InternalServerErrorException(err))
            return
          }
          this.account = account
          resolve(account)
        })
      } else {
        resolve(this.account)
      }
    })
  }

  private createTransportInstance() {
    this.mailService = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: this.account.user,
        pass: this.account.pass,
      },
    })
    return this.mailService
  }

  private createTransport(): Promise<Transporter> {
    return new Promise((resolve, reject) => {
      if (!this.mailService) {
        if (!this.account) {
          this.createTestAccount()
            .then(this.createTransportInstance)
            .catch(reject)
        } else {
          this.createTransportInstance()
        }
      } else {
        resolve(this.mailService)
      }
    })
  }

  async sendEmail(
    email: string,
    name?: string,
    subject?: string,
    text?: string,
    htmlBody?: string
  ): Promise<void> {
    const message = {
      from: 'Your Trusted App <info@appdomain.com>',
      to: name ? `${name} <${email}>` : email,
      subject: subject,
    }

    if (htmlBody) {
      message['html'] = htmlBody
    } else if (text) {
      message['text'] = text
    } else {
      Logger.error('No email body provided')
      throw new Error('No email body provided')
    }

    await this.mailService.sendMail(message, (err, info) => {
      if (err) {
        Logger.error(`Error sending email: ${JSON.stringify(err.message)}`)
      }
      Logger.log(`Message correctly sent to ${email}`)
    })
  }
}
