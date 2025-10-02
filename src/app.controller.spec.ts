import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health endpoints', () => {
    it('should return health status for root endpoint', () => {
      const result = appController.health();
      expect(result).toEqual({ status: 200, message: 'OK' });
    });

    it('should return health status for /health endpoint', () => {
      const result = appController.healthCheck();
      expect(result).toEqual({ status: 200, message: 'OK' });
    });
  });
});
