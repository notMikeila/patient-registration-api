import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { RegisterPatientDto } from './patient.dto'
import { DRIZZLE } from '../db/drizzle.module'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { usersTable } from '../db/schema'
import { EmailService } from '../messaging/messaging.service'
import { DrizzleQueryError } from 'drizzle-orm'

@Injectable()
export class PatientService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase,
    @Inject(EmailService)
    private readonly messagingService: EmailService,
  ) {}
  async registerPatient(
    photo_id: Express.Multer.File,
    registerPatientDto: RegisterPatientDto,
  ) {
    const { name, email, phone } = registerPatientDto

    try {
      // Save patient data to db
      const patientDb = await this.db
      .insert(usersTable)
      .values({
        name: name,
        email: email,
        phone: phone,
        photo_id_path: photo_id.path,
      })
      .returning()

      // Fire and forget email
      this.messagingService.sendEmail(
        email,
        name,
        'Gracias por registrarte con nosotros!',
        'Hemos recibido tu registro y nos pondremos en contacto contigo pronto.',
      )

      return { id: patientDb[0].id, status: 201, message: 'Patient successfully registered' }
    } catch (error) {
      if (error instanceof DrizzleQueryError) {
        throw new BadRequestException(error.cause?.['detail'])
      }
      throw error
    }
  }
}
