import { describe, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import TabSwitch from '@/pages/Reservation/ReservationList/_components/TabSwitch';

describe('Reservation TabSwitch component', () => {
  it('should render default state when viewParameter is not active or completed', () => {
    render(<TabSwitch handleViewChange={() => {}} viewParameter={null} />);
    const defaultTab = screen.getByText('Active');
    expect(defaultTab).toBeInTheDocument();
  });

  it('should trigger handleViewChange with "active" when Active button is clicked', () => {
    const handleViewChangeMock = vi.fn();
    render(
      <TabSwitch
        handleViewChange={handleViewChangeMock}
        viewParameter="completed"
      />,
    );
    const activeButton = screen.getByText('Active');
    fireEvent.click(activeButton);
    expect(handleViewChangeMock).toHaveBeenCalledWith('active');
  });

  it('should trigger handleViewChange with "completed" when Completed button is clicked', () => {
    const handleViewChangeMock = vi.fn();
    render(
      <TabSwitch
        handleViewChange={handleViewChangeMock}
        viewParameter="active"
      />,
    );
    const completedButton = screen.getByText('Completed');
    fireEvent.click(completedButton);
    expect(handleViewChangeMock).toHaveBeenCalledWith('completed');
  });
});
