import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { setupStore } from '@/stores/index.ts';

// import ReservationForm from '@/pages/Reservation/_components/ReservationForm';

describe.skip('Reservation Form', () => {
  let store;

  beforeEach(() => {
    store = setupStore();

    render(
      <Provider store={store}>
        <Router>{/* <ReservationForm toggle={() => {}} /> */}</Router>
      </Provider>,
    );
  });

  it.skip('should have Reservation form ID', () => {
    // const form = document.getElementById('reservationActivityForm');
    // expect(form).toBeInTheDocument();
  });

  it.skip('should render Vendor Name input', () => {
    // const vendorNameInput = screen.getByText('Vendor Name');
    // expect(vendorNameInput).toBeInTheDocument();
  });
});
