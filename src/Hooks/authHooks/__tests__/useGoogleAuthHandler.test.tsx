import { render, act } from '@testing-library/react';
import React, { useEffect } from 'react';
import { useGoogleOauthHandler } from '../useGoogleAuthHandler';
import { loginWithGoogle } from '@/src/services/authService';
import { toastShowError, toastShowSuccess, toastShowLoading } from '@/src/utils/toastUtils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/context/authContext';

jest.mock('@/src/services/authService');
jest.mock('@/src/utils/toastUtils');
jest.mock('next/navigation');
jest.mock('@/src/context/authContext');

describe('useGoogleOauthHandler', () => {
  const setAccessToken = jest.fn();
  const setIsLoggedIn = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ setAccessToken, setIsLoggedIn });
    (useRouter as jest.Mock).mockReturnValue({ push });
    (toastShowLoading as jest.Mock).mockReturnValue('toast');
  });

  function TestComp({ cred }: { cred: any }) {
    const { handleGoogleLoginSuccess } = useGoogleOauthHandler();
    useEffect(() => {
      if (cred) handleGoogleLoginSuccess(cred);
    }, [cred]);
    return null;
  }

  it('successful login updates state and navigates', async () => {
    (loginWithGoogle as jest.Mock).mockResolvedValue({ tokens: { accessToken: 'a', refreshToken: 'r' } });
    await act(async () => {
      render(<TestComp cred={{ credential: 'x' }} />);
    });
    expect(setAccessToken).toHaveBeenCalledWith('a');
    expect(setIsLoggedIn).toHaveBeenCalledWith(true);
    expect(push).toHaveBeenCalledWith('/dashboard');
    expect(toastShowSuccess).toHaveBeenCalled();
  });

  it('failed login shows error', async () => {
    (loginWithGoogle as jest.Mock).mockRejectedValue(new Error('fail'));
    await act(async () => {
      render(<TestComp cred={{ credential: 'x' }} />);
    });
    expect(toastShowError).toHaveBeenCalled();
  });
});
