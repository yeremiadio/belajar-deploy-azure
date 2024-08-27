import { machineHandlers } from '@/tests/mocks/handlers/machineHandlers';
import { reservationHandlers } from '@/tests/mocks/handlers/reservationHandlers';
import { recipeHandlers } from './handlers/recipeHandlers';
import { gatewayHandlers } from './handlers/gatewayHandlers';

/**
 * @description Global endpoint handlers to be consumed by msw server.
 * Handlers are grouped by their respective RTK query store.
 * Define the test suites from the tests/api folder.
 */
export const handlers = [
  ...machineHandlers,
  ...reservationHandlers,
  ...recipeHandlers,
  ...gatewayHandlers,
];
