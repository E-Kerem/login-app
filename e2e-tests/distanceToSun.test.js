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
  beforeEach(() => {
    global.navigator.geolocation = {
      getCurrentPosition: jest.fn().mockImplementation((success) => success({
        coords: {
          latitude: 39.863722,
          longitude: 32.746838
        }
      }))
    };
    render(<SunDistancePage />);
  });
  
  it('displays the latitude and longitude of the user correctly', async () => {
    render(<SunDistancePage />);

      await waitFor(() => {
        const latitudeTexts = screen.getAllByTestId('latitude');
        latitudeTexts.forEach(latitudeText => {
          expect(latitudeText.textContent).toMatch(/Latitude: 39.863722/);
        });
        const longitudeTexts = screen.getAllByTestId('longitude');
        longitudeTexts.forEach(longitudeText => {
          expect(longitudeText.textContent).toMatch(/Longitude: 32.746838/);
        });
      });
  });

  it('displays distance to the sun when geolocation succeeds', async () => {
    navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success({
        coords: {
          latitude: 34.0522,
          longitude: -118.2437
        }
      })
    );
  
    render(<SunDistancePage />);
    
    await waitFor(() => {
      const distanceElements = screen.getAllByTestId('distance-to-sun');
      distanceElements.forEach(element => {
        expect(element).toHaveTextContent(/Distance to the Sun's core: \d+\.?\d* km/);
      });
    });
  });
  

  it('displays an error if geolocation fails', async () => {
    navigator.geolocation.getCurrentPosition.mockImplementationOnce((_, error) =>
      error(new Error('Geolocation error'))
    );

    render(<SunDistancePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to retrieve your location./i)).toBeInTheDocument();
    });
  });

});
