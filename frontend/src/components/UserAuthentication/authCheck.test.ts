import authCheck from './authCheck';

describe('authCheck', () => {
  const expected = {
    invalidEmai : 'Invalid email',
    emailAlreadyInUse: 'Email is already in use',
    weakPassword: 'Weak password! Password length must be at least 6',
    userNotFound: 'This email has not yet been used in Covey Town',
    userDisabled: 'This account has been disabled',
    wrongPassword: 'Wrong password',
    accountExistsWithDifferentCredential: 'Account exists with different credential',
    authDomainConfigRequired: 'Domain is not provided',
    popupBlocked: 'Pop-up is blocked',
    unauthorizedDomain: 'Unauthorized domain',
    others: 'Error!!!',
  }
  it('should return the right messages for each error', () => {
    expect(authCheck('auth/invalid-email')).toBe(expected.invalidEmai);
    expect(authCheck('auth/email-already-in-use')).toBe(expected.emailAlreadyInUse);
    expect(authCheck('auth/weak-password')).toBe(expected.weakPassword);
    expect(authCheck('auth/user-not-found')).toBe(expected.userNotFound);
    expect(authCheck('auth/user-disabled')).toBe(expected.userDisabled);
    expect(authCheck('auth/wrong-password')).toBe(expected.wrongPassword);
    expect(authCheck('auth/account-exists-with-different-credential')).toBe(expected.accountExistsWithDifferentCredential);
    expect(authCheck('auth/auth-domain-config-required')).toBe(expected.authDomainConfigRequired);
    expect(authCheck('auth/popup-blocked')).toBe(expected.popupBlocked);
    expect(authCheck('auth/unauthorized-domain')).toBe(expected.unauthorizedDomain);
    expect(authCheck('auth/others')).toBe(expected.others);
  })
});