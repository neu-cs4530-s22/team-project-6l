import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { renderHook } from "@testing-library/react-hooks";
import LoginForm from '../LoginForm';

jest.mock('../../../firebase/firebase-config', () => ({
  auth: jest.fn().mockReturnThis(),
  currentUser: {
    email: 'test',
    uid: '123',
    emailVerified: true
  },
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(() => ({
    user: {
      sendEmailVerification: jest.fn(),
    },
  })),
  initializeApp: jest.fn()
}));

describe('LoginForm', () => {
  it('should render all the elements properly without Alert box', () => {
    const { getByTestId } = render(<LoginForm />);
    const email = getByTestId('login-email');
    const password = getByTestId('login-password');
    const forgotPassBtn = getByTestId('forgot-password-btn');
    const signInBtn = getByTestId('sign-in-btn');
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(forgotPassBtn).toBeInTheDocument();
    expect(signInBtn).toBeInTheDocument();
  });
})




