/**
 * @file ScrollToTop.jsx
 * @description Helper component that scrolls the window to top (0, 0)
 * whenever the React Router route location changes.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Instant jump to top
    });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
