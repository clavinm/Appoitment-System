import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = location.pathname.substring(1);
    document.title = `Appoitment | ${
      title.charAt(0).toUpperCase() + title.slice(1)
    }`;
  }, [location]);

  return null; // This component doesn't render anything
}
