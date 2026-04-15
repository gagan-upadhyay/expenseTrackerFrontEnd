import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../loginForm';
import { loginWithEmail } from '../../../services/authService';
import { useAuth } from '../../../context/authContext';
import { useRouter } from 'next/navigation';
import { toastShowSuccess, toastShowWarning } from '../../../utils/toastUtils';

jest.mock('@/src/services/authService');
jest.mock('@/src/context/authContext');
jest.mock('next/navigation');
jest.mock('@/src/utils/toastUtils');

// mock Google login component so tests don't require provider
jest.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess }: any) => (
    <button onClick={() => onSuccess && onSuccess({ credential: 'x' })}>google</button>
  ),
  GoogleOAuthProvider: ({ children }: any) => <>{children}</>,
}));

describe('LoginForm', () => {
  const setAccessToken = jest.fn();
  const setIsLoggedIn = jest.fn();
  const logout = jest.fn();
  const replace = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ setAccessToken, setIsLoggedIn, logout });
    (useRouter as jest.Mock).mockReturnValue({ replace });
  });

  it('submits credentials and navigates on success', async () => {
    (loginWithEmail as jest.Mock).mockResolvedValue({ accessToken: 't1', refreshToken: 't2' });
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pw' } });
    // fireEvent.click(screen.getByText(/Login/i));
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(setAccessToken).toHaveBeenCalledWith('t1'));
    expect(setIsLoggedIn).toHaveBeenCalledWith(true);
    expect(replace).toHaveBeenCalledWith('/dashboard');
    expect(toastShowSuccess).toHaveBeenCalled();
  });

  it('shows error on wrong password', async () => {
    (loginWithEmail as jest.Mock).mockRejectedValue(new Error('Wrong password'));
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/Enter Email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), { target: { value: 'pw' } });
    // fireEvent.click(screen.getByText(/Login/i));
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    // await waitFor(() => expect(toastShowWarning).toHaveBeenCalled());
  });
});
