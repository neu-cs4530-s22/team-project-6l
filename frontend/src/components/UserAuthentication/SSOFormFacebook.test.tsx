import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
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
        providerId: 'facebook.com'
      }
    }))
  )),
  GoogleAuthProvider: jest.fn(),
  FacebookAuthProvider: jest.fn(),
}));

describe('SSO Form - Facebook sign In',  () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockHistoryPush.mockReset();
  });
  it('should signIn using Facebook account successfully',async () => {
    const facebookProvider = new FacebookAuthProvider();
    const {getByTestId, queryByTestId} = render(<SSOForm />);
    
    fireEvent.click(getByTestId('facebook-btn'));
    await waitFor(() => {
      expect(signInWithPopup).toBeCalledWith(auth, facebookProvider);
      expect(queryByTestId('error')).toBeNull();
    });
  })
  it('should signIn using Google account fail, the error modal appears',async () => {
    const googleProvider = new GoogleAuthProvider();
    const {getByTestId, queryByTestId} = render(<SSOForm />);
    
    fireEvent.click(getByTestId('google-btn'));
    await waitFor(() => {
      expect(signInWithPopup).toBeCalledWith(auth, googleProvider);
      expect(queryByTestId('error')).toBeDefined();
    });
  })
})