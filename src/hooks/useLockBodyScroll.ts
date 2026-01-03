import { useEffect } from 'react';

export const useLockBodyScroll = () => {
  useEffect(() => {
    // Lock body and html scroll when component mounts
    const originalBodyStyle = window.getComputedStyle(document.body).overflow;
    const originalHtmlStyle = window.getComputedStyle(
      document.documentElement
    ).overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalBodyStyle;
      document.documentElement.style.overflow = originalHtmlStyle;
    };
  }, []);
};
