import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../features/Authentication/useUser';

interface AccessControlRoutes {
  allowedRoles: string[];
}

function AccessControlRoute({ allowedRoles }: AccessControlRoutes) {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  // console.log(user, 'userWTF');

  // Redirect to dashboard if no roles are allowed (meaning open to all)
  if (!allowedRoles.length) {
    navigate('/dashboard');
    return null; // Return null to prevent further rendering
  }

  // If the user is not authenticated, or their role is not allowed, redirect them
  if (!isAuthenticated || !allowedRoles.includes(user?.role)) {
    navigate('/login'); // Change '/unauthorized' to whatever route you'd like for unauthorized access
    return null;
  }

  // If the user is authenticated and their role is allowed, render the requested route
  return <Outlet />;
}

export default AccessControlRoute;
