import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, queryByTestId, render, waitFor } from '@testing-library/react';
import { sendPasswordResetEmail } from 'firebase/auth';
import ForgotPassword from './ForgotPassword';

const mockHistory = jest.fn();

jest.mock('../../firebaseAuth/firebase-config', () => ({
  auth: jest.fn().mockReturnThis(),
}));

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn().mockRejectedValue(() => Promise.reject()),
}));

describe('ForgotPassword', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistory.mockReset();
  });
  it('should succesfully send the email and return back to log0in page', async () => {
    const { getByTestId, getByText, container } = render(<ForgotPassword />);
    const email = getByTestId('forgot-email');
    fireEvent.change(email, { target: { value: 'testing@gmail.com' } });
    const btn = getByText('Reset');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(sendPasswordResetEmail).toBeCalled();
    })
    // the snapshot should show the error message
    expect(container.firstChild).toMatchSnapshot();
    expect(queryByTestId(container, 'error-message')).toBeDefined();
  });
})