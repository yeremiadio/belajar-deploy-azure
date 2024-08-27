import { describe, it } from 'vitest';
import { screen } from '@testing-library/react';

import { renderWithProviders } from '@/tests/setup';
import PurchaseOrderBoard from '@/pages/PurchaseOrder/PurchaseOrderList/_components/PurchaseOrderBoard';

describe.skip('Purchase Order Board', () => {
  beforeEach(() => {
    renderWithProviders(<PurchaseOrderBoard searchKeyword="" />);
  });

  it.skip('triggers navigation on purchase order item click', async () => {
    const boardNames = [
      'Quotation',
      'In confirmation',
      'Confirm',
      'In production',
      'Delivery ready',
    ];

    boardNames.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });
});
