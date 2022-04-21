import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import React from 'react';
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
  createUserWithEmailAndPassword: jest.fn(),
}));


describe('Register Part1 - check error handling', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistoryPush.mockReset();
  });
  it('should render all the element properly', () => {
    const { getByTestId, queryByTestId, getByText } = render(<Register />);
    expect(getByTestId('reg-email')).toBeInTheDocument();
    expect(getByTestId('reg-password')).toBeInTheDocument();
    expect(getByTestId('reg-confirmpassword')).toBeInTheDocument();
    expect(getByTestId('sign-up')).toBeDefined();
    expect(getByTestId('sign-in')).toBeDefined();
    expect(getByText('Already have an account?')).toBeDefined();
    expect(queryByTestId('error')).toBeNull();
  })
  it('should render error message when the input is invalid',async () => {
    const { getByTestId, queryByText } = render(<Register />);
    expect(queryByText('Please enter your email')).toBeNull();
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(queryByText('Please enter your email')).toBeDefined();
    });

    fireEvent.change(getByTestId('reg-email'), { target: { value: 'testing@gmail.com' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(getByTestId('reg-email')).toHaveValue('testing@gmail.com');
      expect(queryByText('Please enter your password')).toBeDefined();
    });

  })
  it('shouid render error when password is wrong/invalid', async () => {
    const { getByTestId, queryByText } = render(<Register />);
    fireEvent.change(getByTestId('reg-email'), { target: { value: 'testing@gmail.com' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(getByTestId('reg-email')).toHaveValue('testing@gmail.com');
      expect(queryByText('Please enter your password')).toBeDefined();
    });

    fireEvent.change(getByTestId('reg-password'), { target: { value: '123456' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(queryByText('Please confirm your password')).toBeDefined();
    });
  })
  it('should render error when confirm password is wrong',async () => {
    const { getByTestId, queryByText } = render(<Register />);
    fireEvent.change(getByTestId('reg-email'), { target: { value: 'testing@gmail.com' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(getByTestId('reg-email')).toHaveValue('testing@gmail.com');
      expect(queryByText('Please enter your password')).toBeDefined();
    });

    fireEvent.change(getByTestId('reg-password'), { target: { value: '123456' } });
    fireEvent.change(getByTestId('reg-confirmpassword'), { target: { value: '12345689' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(queryByText('Passwords do not match')).toBeDefined();
    });
  })
})