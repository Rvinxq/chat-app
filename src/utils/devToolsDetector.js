export const detectDevTools = () => {
  const redirectToError = () => {
    // Only redirect if not already on error page
    if (!window.location.pathname.includes('/error')) {
      window.location.href = '/error';
    }
  };

  // Simple and reliable detection
  const checkDevTools = () => {
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    if (widthDiff > threshold || heightDiff > threshold) {
      redirectToError();
      return true;
    }
    return false;
  };

  // Less aggressive monitoring
  const startMonitoring = () => {
    // Initial check
    if (checkDevTools()) return;

    // Regular monitoring
    const interval = setInterval(checkDevTools, 1000);

    // Prevent keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        redirectToError();
      }
    });

    // Prevent right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    return () => clearInterval(interval);
  };

  return { startMonitoring };
}; 