import { Test, TestingModule } from '@nestjs/testing';
import { ExamenApiController } from './examen-api.controller';

describe('ExamenApiController', () => {
  let controller: ExamenApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamenApiController],
    }).compile();

    controller = module.get<ExamenApiController>(ExamenApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
