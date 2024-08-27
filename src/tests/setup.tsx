import 'whatwg-fetch';

import { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { afterEach, expect } from 'vitest';
import { RequestHandler } from 'msw';
import { BrowserRouter as Router } from 'react-router-dom';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup, render, RenderOptions } from '@testing-library/react';

import { AppStore, RootState, setupStore } from '@/stores';

// import { worker } from '@/tests/mocks/browser';
import { server } from '@/tests/mocks/server';
import { handlers as defaultHandlers } from '@/tests/mocks/handlers';

expect.extend(matchers);

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
  handlers?: RequestHandler[];
}

export function renderWithProviders(
  element: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    handlers = defaultHandlers,
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  server.use(...handlers);

  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return (
      <Provider store={store}>
        <Router>{children}</Router>
      </Provider>
    );
  }

  const result = {
    store,
    ...render(element, { wrapper: Wrapper, ...renderOptions }),
  };

  return result;
}

export function customWrapper({
  preloadedState = {},
  store = setupStore(preloadedState),
  handlers = defaultHandlers,
}: ExtendedRenderOptions = {}) {
  server.use(...handlers);

  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return Wrapper;
}

afterEach(() => {
  cleanup();
  server.resetHandlers();
});
