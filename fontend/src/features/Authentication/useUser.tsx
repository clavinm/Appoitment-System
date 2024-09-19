import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/loginApi';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../hooks/useAlert';
// import toast from 'react-hot-toast';
// import { useLocalStorageState } from '../../hooks/useLocalStorageState';

export function useUser() {
  // const userid = localStorage.getItem('userid');

  const navigate = useNavigate();
  const { showErrorToast } = useAlert();
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => getCurrentUser(),
    onError: (error: Error & { response?: { status: number } }) => {
      if (!error?.response || error?.response?.status !== 401)
        showErrorToast(error.message);

      navigate('/login');
    },
    retry: (failureCount, error: Error & { response?: { status: number } }) => {
      // Don't retry if the error status is 401
      if (error?.response?.status === 401) return false;

      // Otherwise, retry up to 3 times
      return failureCount < 3;
    },
  });
  // console.log('user hello', user);

  return {
    user:user?.data,
    isAuthenticated: user && user?.data?.role,
    isLoading,
  };
}

// import { useQueryClient } from '@tanstack/react-query';
// import { ROLES } from '../../constants';

// export function useUser() {
//   const queryClient = useQueryClient();

//   // Get user details directly from the query cache
//   let user = queryClient.getQueryData(['user']);

//   // If no user data in cache, try to get it from localStorage
//   if (!user) {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       user = JSON.parse(storedUser);
//       // Optionally set the user data back into the cache
//       queryClient.setQueryData(['user'], user);
//     }
//   }

//   // Determine if the user is authenticated
//   const isAuthenticated =
//     user && Object.values(ROLES).includes((user as any)?.data?.role);

//   const isLoading = !user; // Set loading state if user data is not available

//   return { user, isAuthenticated, isLoading };
// }
