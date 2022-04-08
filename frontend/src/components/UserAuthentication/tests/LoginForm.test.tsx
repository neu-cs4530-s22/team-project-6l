import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all the elements properly without Alert box', () => {
    const { getByTestId, queryByTestId } = render(<LoginForm />);

    const email = getByTestId('login-email');
    const password = getByTestId('login-password');
    const forgotPassBtn = getByTestId('forgot-password-btn');
    const signInBtn = getByTestId('sign-in-btn');
    const alertErr = queryByTestId('alert-error');

    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(forgotPassBtn).toBeInTheDocument();
    expect(signInBtn).toBeInTheDocument();
    expect(alertErr).toBeNull(); // Alert UI comp should be rendered. 
  });
  it('should render Alert error with \'Enter your email\' error mess', async () => {
    render(<LoginForm />);

    // check to make sure the 'Enter your email' text is yet rendered
    expect(screen.queryByText('Enter your email')).toBeNull()
    const signInBtn = screen.getByTestId('sign-in-btn');
    fireEvent.click(signInBtn);

    // this time 'Enter your email' text is rendered
    await waitFor(() => {
      expect(screen.queryByText('Enter your email')).toBeDefined();
    })
  });
  it('should render Alert error with \'Enter your password\' error mess', () => {
    render(<LoginForm />);
    
  })
})




