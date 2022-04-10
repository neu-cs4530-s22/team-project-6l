import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { sendPasswordResetEmail } from 'firebase/auth';
import ForgotPassword from '../ForgotPassword';

const mockHistory = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistory,
  }),
}));

jest.mock('../../../firebaseAuth/firebase-config', () => ({
  auth: jest.fn().mockReturnThis(),
}));

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(() => Promise.resolve('reset')),
}));

describe('ForgotPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistory.mockReset();
  });
  it('should initially render all the elements properly with empty email', async () => {
    const { getByTestId, getByText, queryByTestId } = render(<ForgotPassword />);
    const email = getByTestId('forgot-email');
    fireEvent.change(email, { target: { value: 'testing@gmail.com' } });
    const btn = getByText('Reset');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(sendPasswordResetEmail).toBeCalled();
      expect(getByText('A reset link has been sent to your email.')).toBeDefined();
      expect(queryByTestId('signin-btn')).toBeInTheDocument();
    })
    const btnSignIn = getByTestId('signin-btn');
    fireEvent.click(btnSignIn);
    await waitFor(() => {
      expect(mockHistory).toBeCalled();
    });
  });
  
})