// e2e-tests/loginTests.test.js

import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import {UserAuthForm} from '../src/components/user-auth-form';

const originalLocation = window.location;

beforeAll(() => {
  delete window.location;
  window.location = { ...originalLocation, href: 'http://localhost/' };
});

afterAll(() => {
  window.location = originalLocation;
});

jest.mock('@/components/icons', () => ({
    Icons: {
      google: () => <div>Google Icon</div>,
      facebook: () => <div>Facebook Icon</div>,
      spinner: () => <div>Spinner Icon</div>
    }
  }));
  
  jest.mock('@/components/button', () => ({
    Button: ({ children, onClick, ...props }) => <button onClick={onClick} {...props}>{children}</button>
  }));
  
  jest.mock('@/components/input', () => ({
    Input: (props) => <input {...props} />
  }));
  
  jest.mock('@/components/label', () => ({
    Label: ({ children }) => <label>{children}</label>
  }));
  
  jest.mock('@/lib/supabaseClient', () => ({
    signInWithEmail: jest.fn(() => Promise.reject(new Error("Failed to log in. Please try again."))),
    signInWithGoogle: jest.fn(),
    signInWithFacebook: jest.fn()
  }));

describe('UserAuthForm Component', () => {
  beforeEach(() => {
    render(<UserAuthForm />);
  });

  it('should display input fields for email and password', () => {
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your password')).toBeInTheDocument();
  });


  it('should allow users to enter email and password', () => {
    fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Your password'), { target: { value: 'password123' } });

    expect(screen.getByPlaceholderText('name@example.com').value).toBe('user@example.com');
    expect(screen.getByPlaceholderText('Your password').value).toBe('password123');
  });

  it('should show an error message if login fails', async () => {
    const errorMessage = 'Failed to log in. Please try again.';
    jest.mock('@/lib/supabaseClient', () => ({
      signInWithEmail: jest.fn().mockRejectedValue(new Error(errorMessage))
    }));

    fireEvent.click(screen.getByText('Sign In with Email'));
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should redirect after successful Google sign-in', async () => {
    jest.mock('@/lib/supabaseClient', () => ({
      signInWithGoogle: jest.fn().mockResolvedValue({ user: { id: '123' } }),
      signInWithFacebook: jest.fn(),
      signInWithEmail: jest.fn()
    }));

    fireEvent.click(screen.getByTestId('google-login-button'));

    await waitFor(() => {
      expect(window.location.href).toContain('/nearestSea');
    });
  });

  it('should redirect after successful Facebook sign-in', async () => {
    jest.mock('@/lib/supabaseClient', () => ({
      signInWithFacebook: jest.fn().mockResolvedValue({ user: { id: '123' } }),
      signInWithGoogle: jest.fn(),
      signInWithEmail: jest.fn()
    }));

    fireEvent.click(screen.getByTestId('facebook-login-button'));

    await waitFor(() => {
      expect(window.location.href).toContain('/nearestSea');
    });
  });
});