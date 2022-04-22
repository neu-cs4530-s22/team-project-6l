import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import ForgotPassword from './ForgotPassword';
import LoginForm from './LoginForm';
import Register from './Register';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../firebaseAuth/firebase-config', () => ({
  auth: jest.fn().mockReturnThis(),
}));

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn().mockRejectedValue(() => Promise.reject()),
  signInWithEmailAndPassword: jest.fn().mockRejectedValue(() => Promise.reject()),
  createUserWithEmailAndPassword: jest.fn().mockRejectedValue(() => Promise.reject()),
  signInWithPopup: jest.fn().mockRejectedValue(() => Promise.reject()),
}));

describe('ForgotPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistoryPush.mockReset();
  });
  it('should not successfully login', async () => {
    const { getByTestId, queryByTestId, container } = render(<LoginForm />);
    const emailEl = getByTestId('login-email');
    const passEl = getByTestId('login-password');
    fireEvent.change(emailEl, { target: { value: 'testing@gmail.com' } });
    fireEvent.change(passEl, { target: { value: '123456' } });
    fireEvent.click(getByTestId('sign-in-btn'));
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toBeCalled();
      expect(queryByTestId('alert-message')).toBeDefined();
    })
    expect(container.firstChild).toMatchSnapshot();
    expect(mockHistoryPush).not.toBeCalled();
  });
  it('should not successfully create a new user', async () => {
    const { getByTestId, queryByTestId } = render(<Register />);
    fireEvent.change(getByTestId('reg-email'), { target: { value: 'testing@gmail.com' } });
    fireEvent.change(getByTestId('reg-password'), { target: { value: '123456' } });
    fireEvent.change(getByTestId('reg-confirmpassword'), { target: { value: '123456' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toBeCalled();
      expect(queryByTestId('error')).toBeDefined();
    })
    expect(mockHistoryPush).not.toBeCalled();
  });
  it('should unsuccessfully send the reset email in ForgotPassword', async () => {
    const { getByTestId, getByText, queryByTestId, queryByText, container } = render(<ForgotPassword />);
    const email = getByTestId('forgot-email');
    fireEvent.change(email, { target: { value: 'testing@gmail.com' } });
    const btn = getByText('Reset');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(queryByTestId('error-message')).toBeDefined();
      expect(queryByText('A reset link has been sent to your email.')).toBeNull();
      expect(sendPasswordResetEmail).toBeCalled();
    })
    // the snapshot should show the error message
    expect(container.firstChild).toMatchSnapshot();
  });
}) 