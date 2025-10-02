import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { RegisterPatientDto } from './patient.dto'
import { DRIZZLE } from 'src/db/drizzle.module'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { usersTable } from 'src/db/schema'
import { MessagingService } from 'src/messaging/messaging.service'

@Injectable()
export class PatientService {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase,
    @Inject(MessagingService)
    private readonly messagingService: MessagingService,
  ) {}
  async registerPatient(
    photo_id: Express.Multer.File,
    registerPatientDto: RegisterPatientDto,
  ) {
    const { name, email, phone } = registerPatientDto

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

    if (patientDb.length === 0) {
      throw new InternalServerErrorException('Failed to register patient')
    }

    // Fire and forget email
    this.messagingService.sendEmail(
      email,
      name,
      'Gracias por registrarte con nosotros!',
      'Hemos recibido tu registro y nos pondremos en contacto contigo pronto.',
    )

    return { id: patientDb[0].id, status: 201 }
  }
}
