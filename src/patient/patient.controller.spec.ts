import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { RegisterPatientDto } from './patient.dto';

// Mock the uuid module
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-123'),
}));

describe('PatientController', () => {
  let controller: PatientController;
  let patientService: PatientService;

  const mockPatientService = {
    registerPatient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
      ],
    }).compile();

    controller = module.get<PatientController>(PatientController);
    patientService = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerPatient', () => {
    it('should call patientService.registerPatient with correct parameters', async () => {
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

      const expectedResult = {
        id: 1,
        status: 201,
        message: 'Patient successfully registered',
      };

      mockPatientService.registerPatient.mockResolvedValue(expectedResult);

      const result = await controller.registerPatient(mockFile, registerPatientDto);

      expect(patientService.registerPatient).toHaveBeenCalledWith(mockFile, registerPatientDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
