import { screen, waitFor, within } from '@testing-library/react';

import MachinePage from '@/pages/Management/Machine/Machine';

import { renderWithProviders } from '@/tests/setup';
import { initiateServer } from '@/tests/testUtils';

describe('Machine Page with Table', () => {
  initiateServer();

  beforeEach(() => {
    renderWithProviders(<MachinePage />);
  });
  it('should render machine table', () => {
    const tableElement = screen.getByRole('table');
    // screen.debug(tableElement);
    expect(tableElement).toBeInTheDocument();
  });
  it('should render 1 data in machine table', async () => {
    // Check if the table headers are rendered
    // expect(screen.getByText(/Name/i)).toBeInTheDocument();
    const tableElement = screen.getByRole('table');

    // Wait for the data to be rendered
    await waitFor(() => {
      screen.debug(tableElement);
      expect(within(tableElement).getByRole('cell', { name: /Machine001/ }));
    });
  });
});
