import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginAdmin as loginApi } from '../../services/loginApi';
import { useNavigate } from 'react-router-dom';
import { ROLES } from '../../constants';
import { useAlert } from '../../hooks/useAlert';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showErrorToast, showSuccessToast } = useAlert();

  const { mutate: login, error: loginError } = useMutation<
    any,
    Error,
    { email?: string; password?: string; userid: string; code?: string }
  >({
    mutationFn: ({ email, password, userid, code }) =>
      loginApi({ email, password, userid, code }),

    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);

      showSuccessToast('Logged In Successfully');
      // Navigate based on user role
      if (Object.values(ROLES).includes(user?.data.role)) {
        navigate('/dashboard');
        // console.log('hey user');
      } else {
        console.log('error');
        // console.log(user,'user');
      }
    },

    onError: (error: Error & { response?: { status: number } }) => {
      if (!error?.response || error?.response?.status !== 401)
        showErrorToast(error.message);
    },
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      // Don't retry if the error status is 401
      if (error?.response?.status === 401) return false;

      // Otherwise, retry up to 3 times
      return failureCount < 3;
    },
  });

  const error =
    (loginError as Error & { response?: { status: number } })?.response
      ?.status === 401
      ? (loginError as Error & { response?: { status: number } })?.message
      : '';

  return { login, error };
}
