import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import SunDistancePage from '../src/pages/sunDistance';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('SunDistancePage', () => {
  beforeAll(() => {
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn()
    };
  });

  it('displays distance to the sun when geolocation succeeds', async () => {
    // Mock getCurrentPosition to call the success callback
    navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success({
        coords: {
          latitude: 34.0522,
          longitude: -118.2437
        }
      })
    );

    render(<SunDistancePage />);
    
    // Wait for the component to update based on the geolocation
    await waitFor(() => {
      expect(screen.getByTestId('distance-to-sun')).toHaveTextContent(/Distance to the Sun's core: \d+\.?\d* km/);
    });
  });

  it('displays an error if geolocation fails', async () => {
    // Mock getCurrentPosition to call the error callback
    navigator.geolocation.getCurrentPosition.mockImplementationOnce((_, error) =>
      error(new Error('Geolocation error'))
    );

    render(<SunDistancePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to retrieve your location./i)).toBeInTheDocument();
    });
  });

});
