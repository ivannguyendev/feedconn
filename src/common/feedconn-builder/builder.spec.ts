import { Test, TestingModule } from '@nestjs/testing';
import { FeedconnBuilder } from './builder';

// describe('Builder', () => {
//   // let appController: BuilderController;
//   beforeEach(async () => {
//     // const app: TestingModule = await Test.createTestingModule({
//     //   controllers: [BuilderController],
//     //   providers: [BuilderService],
//     // }).compile();
//     // appController = app.get<BuilderController>(BuilderController);
//   });
//   describe('root', () => {
//     it('should return "Hello World!"', () => {
//       expect(appController.getHello()).toBe('Hello World!');
//     });
//   });
// });

describe('Builder', () => {
  // let appController: BuilderController;
  describe('createMessage', () => {
    it('should Message', () => {
      const messagePayload = FeedconnBuilder.createMessage({
        headings: {
          all: 'Hello World!',
        },
        contents: {
          all: 'this is test,',
        },
      });
      expect(messagePayload.headings.all).toBe('Hello World!');
      expect(messagePayload._id).not.toBeNull()
    });
  });
});
