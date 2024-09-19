import { dashboardItems } from './SideBarItems';
import { useUser } from '../../features/Authentication/useUser';

export function useFilterNavItems() {
  const { user, isAuthenticated } = useUser();
  console.log(user, 'user');
  console.log(isAuthenticated, 'isAuthenticated');

  const { links } =
    dashboardItems.find((navLink) => navLink.role === user?.role) ?? {};
  console.log(links);

  return { links };
}
