import { Test, TestingModule } from '@nestjs/testing';
import { PatientService } from './patient.service';
import { MessagingService } from '../messaging/messaging.service';
import { RegisterPatientDto } from './patient.dto';
import { DRIZZLE } from '../db/drizzle.module';
import { DrizzleQueryError } from 'drizzle-orm';
import { BadRequestException } from '@nestjs/common';

describe('PatientService', () => {
  let service: PatientService;
  let mockDb: any;
  let mockMessagingService: any;

  const mockFile = {
    path: '/uploads/test-file.jpg',
    fieldname: 'photo_id',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    destination: './uploads',
    filename: 'test-file.jpg',
    buffer: Buffer.from('test'),
  } as Express.Multer.File;

  const registerPatientDto: RegisterPatientDto = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
  };

  beforeEach(async () => {
    mockDb = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    };

    mockMessagingService = {
      sendEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: DRIZZLE,
          useValue: mockDb,
        },
        {
          provide: MessagingService,
          useValue: mockMessagingService,
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerPatient', () => {
    it('should successfully register a patient', async () => {
      const mockDbResult = [{ id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890', photo_id_path: '/uploads/test-file.jpg' }];

      mockDb.returning.mockResolvedValue(mockDbResult);
      mockMessagingService.sendEmail.mockResolvedValue(undefined);

      const result = await service.registerPatient(mockFile, registerPatientDto);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        photo_id_path: '/uploads/test-file.jpg',
      });
      expect(mockMessagingService.sendEmail).toHaveBeenCalledWith(
        'john@example.com',
        'John Doe',
        'Gracias por registrarte con nosotros!',
        'Hemos recibido tu registro y nos pondremos en contacto contigo pronto.'
      );
      expect(result).toEqual({
        id: 1,
        status: 201,
        message: 'Patient successfully registered',
      });
    });

    it('should throw BadRequestException when database error occurs', async () => {
      const drizzleError = new DrizzleQueryError('Database error', []);
      (drizzleError as any).cause = { detail: 'Email already exists' };

      mockDb.returning.mockRejectedValue(drizzleError);

      await expect(service.registerPatient(mockFile, registerPatientDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should rethrow non-DrizzleQueryError', async () => {
      const genericError = new Error('Generic error');

      mockDb.returning.mockRejectedValue(genericError);

      await expect(service.registerPatient(mockFile, registerPatientDto))
        .rejects.toThrow('Generic error');
    });
  });
});
