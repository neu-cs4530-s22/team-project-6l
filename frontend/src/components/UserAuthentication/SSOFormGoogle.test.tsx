import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import auth from '../../firebaseAuth/firebase-config';
import SSOForm from './SSOForm';

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
  signInWithPopup: jest.fn(() => Promise.resolve(
    jest.fn().mockImplementation(() => ({
      provider: {
        providerId: 'google.com'
      }
    }))
  )),
  GoogleAuthProvider: jest.fn(),
  FacebookAuthProvider: jest.fn(),
}));

describe('SSO Form', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistoryPush.mockReset();
  });
  it('should render properly', () => {
    const {queryByTestId, getByText, getByTestId } = render(<SSOForm />);
    expect(getByText('Sign in with Facebook')).toBeDefined();
    expect(getByText('Sign in with Google')).toBeDefined();
    expect(getByTestId('google-btn')).toBeDefined();
    expect(queryByTestId('error')).toBeNull();
  })
});

describe('SSO Form Part 2 - Google sign In',  () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistoryPush.mockReset();
  });
  it('should signIn using Google account successfully',async () => {
    const googleProvider = new GoogleAuthProvider();
    const {getByTestId} = render(<SSOForm />);
    
    fireEvent.click(getByTestId('google-btn'));
    await waitFor(() => {
      expect(signInWithPopup).toBeCalledWith(auth, googleProvider);
    });
  })
  it('should signIn using Google account and then navigate to PreJoinScreen successfully',async () => {
    const googleProvider = new GoogleAuthProvider();
    const {getByTestId} = render(<SSOForm />);
    
    fireEvent.click(getByTestId('google-btn'));
    await waitFor(() => {
      expect(signInWithPopup).toBeCalledWith(auth, googleProvider);
    });
    expect(mockHistoryPush).toBeCalled();
    expect(mockHistoryPush).toBeCalledWith('/pre-join-screen');
  });
})