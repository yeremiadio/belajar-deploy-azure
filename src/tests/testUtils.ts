// import { worker } from '@/tests/mocks/browser';
import { server } from '@/tests/mocks/server';

// export function initiateWorker() {
//   beforeAll(() => {
//     worker.start({ onUnhandledRequest: 'warn' });
//   });

//   afterAll(() => {
//     worker.stop();
//   });

//   afterEach(() => {
//     worker.resetHandlers();
//   });
// }

export function initiateServer() {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'warn' });
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });
}
