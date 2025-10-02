import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { RegisterPatientDto } from './patient.dto'
import { PatientService } from './patient.service'
import { diskStorage } from 'multer'
import { v4 } from 'uuid'

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('photo_id', {
    limits: { fileSize: 5e+6, files: 1 }, // 5MB and only 1 file
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        return cb(null, `${v4()}.jpg`) // save all files as jpg since it's the only allowed type
      }})
  }))
  async registerPatient(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5e+6 }), // 5MB, smartphone photos should be smaller
          new FileTypeValidator({ fileType: 'image/png', skipMagicNumbersValidation: true }), // this pipe has a known issue with file type
        ],
      }),
    )
    photo_id: Express.Multer.File,
    @Body() registerPatientDto: RegisterPatientDto,
  ) {
    return this.patientService.registerPatient(photo_id, registerPatientDto)
  }
}
