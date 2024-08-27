import { describe, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupStore } from '@/stores/index.ts';
import GatewayForm from '@/pages/Management/Gateway/components/GatewayForm';

describe('Gateway Form', () => {
  let store;

  beforeEach(() => {
    store = setupStore();

    render(
      <Provider store={store}>
        <Router>
          <GatewayForm toggle={() => {}} />
        </Router>
      </Provider>,
    );
  });

  it('should have Gateway form ID', async () => {
    await waitFor(() => {
      const form = document.getElementById('gatewayForm');
      expect(form).toBeInTheDocument();
    });
  });

  it('should renders form fields and elements correctly', async () => {
    await waitFor(() => {
      expect(screen.getByText('Gateway Name')).toBeInTheDocument();
      expect(screen.getByText('Gateway Theme')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });
  });
});
