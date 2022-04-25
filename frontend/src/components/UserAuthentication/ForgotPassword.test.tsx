import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import ForgotPassword from './ForgotPassword';

const mockHistory = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistory,
  }),
}));

jest.mock('../../firebaseAuth/firebase-config', () => ({
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
  it('should render all initial element properly', () => {
    const { getByTestId, getByText } = render(<ForgotPassword />);
    expect(getByText('Forgot Your Password?')).toBeInTheDocument();
    expect(getByText('Enter your email')).toBeInTheDocument();
    expect(getByTestId('forgot-email')).toBeDefined();
    expect(getByTestId('forgot-email')).toHaveValue('');
    expect(getByText('Reset')).toBeDefined();
    expect(sendPasswordResetEmail).not.toBeCalled();
    expect(mockHistory).not.toBeCalled();
  });
  it('should show error if the email is not registered/invalid', async () => {
    const { getByTestId, getByText, queryByTestId, queryByText } = render(<ForgotPassword />);
    const email = getByTestId('forgot-email');
    fireEvent.change(email, { target: { value: 'testing' } });
    const btn = getByText('Reset');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(queryByTestId('error-message')).toBeDefined();
      expect(queryByText('Invalid email')).toBeDefined();
    });
  });
  it('should succesfully send the email and return back to log0in page', async () => {
    const { getByTestId, getByText, queryByTestId, queryByText } = render(<ForgotPassword />);
    const email = getByTestId('forgot-email');
    fireEvent.change(email, { target: { value: 'testing@gmail.com' } });
    const btn = getByText('Reset');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(sendPasswordResetEmail).toBeCalled();
      expect(getByText('A reset link has been sent to your email.')).toBeDefined();
      expect(queryByTestId('signin-btn')).toBeInTheDocument();
      expect(queryByText('Reset')).toBeNull();
    });
    const btnSignIn = getByTestId('signin-btn');
    fireEvent.click(btnSignIn);
    expect(mockHistory).toBeCalled();
    expect(mockHistory).toHaveBeenCalledWith('/');
  });
});
