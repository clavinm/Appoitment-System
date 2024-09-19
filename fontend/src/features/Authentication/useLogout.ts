import { Logout as logoutApi } from '../../services/loginApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// import { useLocalStorageState } from '../../hooks/useLocalStorageState';

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
//   const userid = useLocalStorageState('', 'userid')[0];

  const { mutate: logout } = useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      queryClient.removeQueries();
      navigate(`/login`, { replace: true });
    },

    onError: () => {
      queryClient.removeQueries();
      navigate(`/login`, { replace: true });
    },
  });

  return { logout };
}
