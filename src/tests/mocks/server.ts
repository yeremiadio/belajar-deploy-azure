import { setupServer } from 'msw/node';
import { handlers } from './handlers';

/**
 * @description msw entry point (node environment)
 */
export const server = setupServer(...handlers);
