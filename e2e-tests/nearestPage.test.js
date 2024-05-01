import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import NearestSeaPage from '../src/pages/nearestSea';
import axios from 'axios';
import '@testing-library/jest-dom';  // Ensure jest-dom extensions are imported

jest.mock('axios');
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));

axios.get.mockResolvedValue({ data: { name: "Sea & Fish" } }); 

const mockGeolocation = {
  getCurrentPosition: jest.fn()
    .mockImplementationOnce((success) => Promise.resolve(success({
      coords: {
        latitude: 39.871707,
        longitude: 32.749921
      }
    })))
};

global.navigator.geolocation = mockGeolocation;

describe('Nearest Sea Page', () => {
  it('displays the latitude and longitude', async () => {
    render(<NearestSeaPage />);

    await waitFor(() => {
      const latitudeText = screen.getByTestId('latitude');
      const longitudeText = screen.getByTestId('longitude');
      const distanceText = screen.getByText(/Nearest sea: Sea & Fish/i);
      expect(latitudeText.textContent).toMatch(/39.871707/);
      expect(longitudeText.textContent).toMatch(/32.749921/);
      expect(distanceText).toBeInTheDocument();
    });
  });

  it('displays an error if the geolocation fails', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((_, reject) =>
      reject(new Error('Geolocation error'))
    );

    render(<NearestSeaPage />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to retrieve your location./i)).toBeInTheDocument();
    });
  });

  it('displays an error if the API call fails', async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
      return Promise.resolve(success({
        coords: {
          latitude: 39.871707,
          longitude: 32.749921
        }
      }));
    });
    axios.get.mockRejectedValue(new Error('API error'));

    render(<NearestSeaPage />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to retrieve data for the nearest sea./i)).toBeInTheDocument();
    });
  });
});
