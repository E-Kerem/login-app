import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import NearestSeaPage from '../src/pages/nearestSea';
import axios from 'axios';
import '@testing-library/jest-dom';  // Ensure jest-dom extensions are imported

jest.mock('axios');
jest.mock('next/router', () => ({ useRouter: jest.fn() }));

const mockGeolocation = {
    getCurrentPosition: jest.fn()
};

global.navigator.geolocation = mockGeolocation;

beforeEach(() => {
    jest.resetAllMocks();
});

describe('Nearest Sea Page', () => {
    beforeEach(() => {
        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
                latitude: 39.863722,
                longitude: 32.746838
            }
        })));
        axios.get.mockResolvedValue({
            data: { name: "Marmara Denizi", distance: "386.77 kms" }
        });
    });

    it('displays the latitude and longitude of the user correctly', async () => {
      render(<NearestSeaPage />);

        await waitFor(() => {
            const latitudeText = screen.getByTestId('latitude');
            const longitudeText = screen.getByTestId('longitude');
            expect(latitudeText.textContent).toMatch(/39.863722/);
            expect(longitudeText.textContent).toMatch(/32.746838/);
        });
    });

    it('displays an error if the geolocation fails', async () => {
      // Ensure the mock simulates a geolocation error
      mockGeolocation.getCurrentPosition.mockImplementationOnce((_, reject) =>
          reject({ code: 1, message: 'Permission denied' })
      );
  
      render(<NearestSeaPage />);
      await waitFor(() => {
          // This message should match the one set in the component when geolocation fails
          expect(screen.getByText(/Permission denied for location access./i)).toBeInTheDocument();
      });
  });
  

    it('displays an error if the API call fails', async () => {
        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => Promise.resolve(success({
            coords: {
                latitude: 39.871707,
                longitude: 32.749921
            }
        })));
        axios.get.mockRejectedValue(new Error('API error'));

        render(<NearestSeaPage />);
        await waitFor(() => {
            expect(screen.getByText(/Failed to retrieve data for the nearest sea./i)).toBeInTheDocument();
        });
    });

    it('handles empty data response gracefully for nearest sea', async () => {
        mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => 
            Promise.resolve(success({
                coords: {
                    latitude: 39.871707,
                    longitude: 32.749921
                }
            }))
        );

        axios.get.mockResolvedValue({ data: {} });  // Assuming the API returns an empty object for no data

        render(<NearestSeaPage />);
        await waitFor(() => {
            expect(screen.getByText(/No nearest sea found/i)).toBeInTheDocument();
        });
    });

    it('displays the nearest sea correctly when data is returned from the API', async () => {
        render(<NearestSeaPage />);

        await waitFor(() => {
            expect(screen.getByText(/The nearest sea, Marmara Denizi, is 386.77 kms away/i)).toBeInTheDocument();
        });
    });
});
