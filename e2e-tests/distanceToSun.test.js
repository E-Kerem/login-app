import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SunDistancePage from '../src/pages/sunDistance';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('SunDistancePage', () => {
  it('allows manual entry of latitude and longitude and displays calculated distance', async () => {
    render(<SunDistancePage />);
    
    fireEvent.change(screen.getByPlaceholderText('Enter latitude'), { target: { value: '34.0522' } });
    fireEvent.change(screen.getByPlaceholderText('Enter longitude'), { target: { value: '-118.2437' } });
    
    fireEvent.click(screen.getByText('Calculate Distance'));

    await waitFor(() => {
      expect(screen.getByText(/Distance to the Sun's core:/)).toHaveTextContent(/km/);
    });
  });

  it('displays distance to the sun when geolocation succeeds', async () => {
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) =>
        success({
          coords: {
            latitude: 34.0522,
            longitude: -118.2437
          }
        })
      )
    };

    render(<SunDistancePage />);
    
    fireEvent.click(screen.getByText('Get My Location'));

    await waitFor(() => {
      expect(screen.getByText(/Distance to the Sun's core:/)).toHaveTextContent(/km/);
    });
  });

  it('displays an error if geolocation fails', async () => {
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((_, error) =>
        error(new Error('Geolocation error'))
      )
    };

    render(<SunDistancePage />);
    
    fireEvent.click(screen.getByText('Get My Location'));

    await waitFor(() => {
      expect(screen.getByText(/Failed to retrieve your location./)).toBeInTheDocument();
    });
  });
});
