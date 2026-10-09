import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls window to top ("upper side") whenever route changes.
 * If a hash anchor is provided (e.g. #section-id), it scrolls to that element.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Default: auto scroll to upper side (top)
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
