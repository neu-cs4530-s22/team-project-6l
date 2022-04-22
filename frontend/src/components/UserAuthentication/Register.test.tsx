import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
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
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve('account created')),
  signOut: jest.fn(),
}));

describe('Register Part1 - rendered properly', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistoryPush.mockReset();
  });
  it('should render all the element properly without the Error Alert', () => {
    const { getByTestId, queryByTestId, getByText } = render(<Register />);
    expect(getByTestId('reg-email')).toBeInTheDocument();
    expect(getByTestId('reg-password')).toBeInTheDocument();
    expect(getByTestId('reg-confirmpassword')).toBeInTheDocument();
    expect(getByTestId('sign-up')).toBeDefined();
    expect(getByTestId('sign-in')).toBeDefined();
    expect(getByText('Already have an account?')).toBeDefined();
    expect(queryByTestId('error')).toBeNull();
  })
  it('should successfully sign up', async () => {
    const { getByTestId } = render(<Register />);
    fireEvent.change(getByTestId('reg-email'), { target: { value: 'testing@gmail.com' } });
    fireEvent.change(getByTestId('reg-password'), { target: { value: '123456' } });
    fireEvent.change(getByTestId('reg-confirmpassword'), { target: { value: '123456' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(createUserWithEmailAndPassword).toBeCalled();
    });
    expect(mockHistoryPush).toBeCalled();
    expect(mockHistoryPush).toHaveBeenCalledWith('/pre-join-screen')
  })
})

describe('Register Part2 - check error handling', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistoryPush.mockReset();
  });
  it('should render error message when the input is invalid',async () => {
    const { getByTestId, queryByText } = render(<Register />);
    expect(queryByText('Please enter your email')).toBeNull();

    // error since email is empty
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(queryByText('Please enter your email')).toBeDefined();
    });

    // error since this is invalid email 
    fireEvent.change(getByTestId('reg-email'), { target: { value: 'testing' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(getByTestId('reg-email')).toHaveValue('testing');
      expect(queryByText('Invalid email')).toBeDefined();
    });

    // email passed 
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
    // empty pass
    await waitFor(() => {
      expect(getByTestId('reg-email')).toHaveValue('testing@gmail.com');
      expect(queryByText('Please enter your password')).toBeDefined();
    });

    // ok password but no confirm
    fireEvent.change(getByTestId('reg-password'), { target: { value: '123456' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(queryByText('Please confirm your password')).toBeDefined();
    });

    // confirmed password but weak pass
    fireEvent.change(getByTestId('reg-password'), { target: { value: '123' } });
    fireEvent.change(getByTestId('reg-confirmpassword'), { target: { value: '123' } });
    fireEvent.click(getByTestId('sign-up'));
    await waitFor(() => {
      expect(queryByText('Weak password! Password length must be at least 6')).toBeDefined();
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
});

describe('Part3 - when the user decides to go back to log-in page', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistoryPush.mockReset();
  });
  it('should return to the sign in page which has path /', () => {
    const { getByTestId } = render(<Register />);
    fireEvent.click(getByTestId('sign-in'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  })
})