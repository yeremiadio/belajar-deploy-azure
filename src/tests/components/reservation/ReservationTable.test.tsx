import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupStore } from '@/stores/index.ts';

import ReservationTable from '@/pages/Reservation/ReservationList/_components/ReservationTable';

describe.skip('Reservation Table', () => {
  let store;
  let viewParameter;

  beforeEach(() => {
    store = setupStore();
    viewParameter = 'active';

    render(
      <Provider store={store}>
        <Router>
          <ReservationTable viewParameter={viewParameter} />
        </Router>
      </Provider>,
    );
  });

  it.skip('should render status column', () => {
    // const statusCol = screen.getByText('Status');
    // expect(statusCol).toBeInTheDocument();
  });

  it.skip('should render vendor name column', () => {
    // const vendorNameCol = screen.getByText('Vendor Name');
    // expect(vendorNameCol).toBeInTheDocument();
  });
});
