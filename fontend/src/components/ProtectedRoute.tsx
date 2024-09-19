/* eslint-disable react/prop-types */
import { useUser } from '../features/Authentication/useUser';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Loader from '../common/Loader';
// import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  //   const userid = useLocalStorageState('', 'userid')[0];

  // 1. Load the authenticated user
  const { isAuthenticated, isLoading } = useUser();

  // 3. If there is NO authenticated user, redirect to the login page
  useEffect(
    function () {
      if (!isAuthenticated && !isLoading) navigate('/login');
    },
    [isAuthenticated, isLoading, navigate],
  );

  // 2. While loading show a spinner
  if (isLoading) return <Loader />;

  // 4. If there is a user render the app
  if (isAuthenticated) return children;
}

export default ProtectedRoute;
