import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should throw error when no email body is provided', async () => {
      await expect(
        service.sendEmail('test@example.com', 'Test User', 'Test Subject')
      ).rejects.toThrow('No email body provided');
    });

    it('should throw error when no email body is provided with html', async () => {
      await expect(
        service.sendEmail('test@example.com', 'Test User', 'Test Subject')
      ).rejects.toThrow('No email body provided');
    });
  });
});
