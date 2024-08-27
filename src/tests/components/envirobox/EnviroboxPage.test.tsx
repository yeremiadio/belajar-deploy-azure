import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import { setupStore } from '@/stores/index.ts';

import EnviroboxPage from '@/pages/Envirobox/EnviroboxPage';

describe('Envirobox Page', () => {
  let store;

  beforeEach(() => {
    store = setupStore();

    render(
      <Provider store={store}>
        <Router>
          <EnviroboxPage />
        </Router>
      </Provider>,
    );
  });

  it('should render the page', () => {
    const page = screen.getByTestId('envirobox-page');
    expect(page).toBeInTheDocument();
  });

  it('should render device summary component', () => {
    const deviceSummary = screen.getByTestId('device-summary-envirobox');
    expect(deviceSummary).toBeInTheDocument();
  });

  it('should render device location component', () => {
    const deviceLocation = screen.getByTestId('device-location-envirobox');
    expect(deviceLocation).toBeInTheDocument();
  });

  it('should render device list component', () => {
    const deviceList = screen.getByTestId('device-list-envirobox');
    expect(deviceList).toBeInTheDocument();
  });

  it('should have element with id enviroboxId', () => {
    const element = document.getElementById('enviroboxId');
    expect(element).toBeInTheDocument();
  });

  it('should have a card with Active, Inactive, Warning, Critical, and Total Device', () => {
    const active = screen.getByText('Active');
    const inactive = screen.getByText('Inactive');
    const totalDevice = screen.getByText('Total Device');
    const warning = screen.getByText('Warning');
    const critical = screen.getByText('Critical');

    expect(active).toBeInTheDocument();
    expect(inactive).toBeInTheDocument();
    expect(totalDevice).toBeInTheDocument();
    expect(warning).toBeInTheDocument();
    expect(critical).toBeInTheDocument();
  });
});
