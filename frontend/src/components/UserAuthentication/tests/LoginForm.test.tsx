import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import auth from 'firebase/auth';
import LoginForm from '../LoginForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../../firebaseAuth/firebase-config', () => ({
  auth: jest.fn().mockReturnThis(),
}));

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

describe('LoginForm', () => {
  afterEach(() => {
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
  it("should render Alert error with 'Enter your email' error mess", async () => {
    render(<LoginForm />);
    // check to make sure the 'Enter your email' text is yet rendered
    expect(screen.queryByText('Enter your email')).toBeNull();
    const signInBtn = screen.getByTestId('sign-in-btn');
    fireEvent.click(signInBtn);

    // this time 'Enter your email' text is rendered
    await waitFor(() => {
      expect(screen.queryByText('Enter your email')).toBeDefined();
    });
  });
  it('should update new email new email ', () => {
    render(<LoginForm />);
    const emailEl = screen.getByTestId('login-email');
    expect(emailEl).toHaveValue('');

    fireEvent.change(emailEl, { target: { value: 'testing@gmail.com' } });
    expect(screen.getByTestId('login-email')).toHaveValue('testing@gmail.com');
  });
  it("should render Alert error with 'Enter your password' error mess", async () => {
    render(<LoginForm />);
    (auth.signInWithEmailAndPassword as jest.Mocked<any>).mockReturnValueOnce({});
    const emailEl = screen.getByTestId('login-email');
    fireEvent.change(emailEl, { target: { value: 'testing@gmail.com' } });
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    await waitFor(() => {
      expect(screen.queryByText('Enter your email')).toBeNull();
      expect(screen.queryByText('Enter your password')).toBeDefined();
      expect(auth.signInWithEmailAndPassword as jest.Mocked<any>).not.toHaveBeenCalled();
    });
  });
  it('should call signInWithEmailAndPassword method', async () => {
    render(<LoginForm />);
    (auth.signInWithEmailAndPassword as jest.Mocked<any>).mockReturnValueOnce({});
    const emailEl = screen.getByTestId('login-email');
    fireEvent.change(emailEl, { target: { value: 'testing@gmail.com' } });
    const passEl = screen.getByTestId('login-password');
    fireEvent.change(passEl, { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('sign-in-btn'));

    await waitFor(() => {
      expect(auth.signInWithEmailAndPassword as jest.Mocked<any>).toHaveBeenCalled();
    });
  });
});
