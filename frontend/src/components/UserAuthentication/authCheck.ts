/**
 * Check the error codes and return the messages
 * @param code the given error code
 * @returns the messages
 */
const authCheck = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email';
    case 'auth/email-already-in-use':
      return 'Email is already in use';
    case 'auth/weak-password':
      return 'Weak password! Password length must be at least 6';
    case 'auth/user-not-found':
      return 'This email has not yet been registered in Covey Town';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/wrong-password':
      return 'Wrong password';
    case 'auth/account-exists-with-different-credential':
      return 'Account exists with different credential';
    case 'auth/auth-domain-config-required':
      return 'Domain is not provided';
    case 'auth/popup-blocked':
      return 'Pop-up is blocked';
    case 'auth/unauthorized-domain':
      return 'Unauthorized domain';
    default:
      return 'Error!!!'; // other cases
  }
};

export default authCheck;
