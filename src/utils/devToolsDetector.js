export const detectDevTools = () => {
  const redirectToError = () => {
    // Only redirect if not already on error page
    if (!window.location.pathname.includes('/error')) {
      window.location.href = '/error';
    }
  };

  // More reliable dev tools detection with less false positives
  const checkDevTools = () => {
    try {
      // Method 1: More accurate size comparison
      const widthThreshold = window.outerWidth - window.innerWidth > 200;
      const heightThreshold = window.outerHeight - window.innerHeight > 200;
      const isResized = widthThreshold && heightThreshold;

      // Method 2: Dev tools object check
      const hasDevTools = !!(
        window.Firebug || 
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.renderers?.size > 0
      );

      if (isResized || hasDevTools) {
        redirectToError();
        return true;
      }
    } catch (e) {
      // Only redirect on specific errors
      if (e.toString().includes('devtools')) {
        redirectToError();
        return true;
      }
    }
    return false;
  };

  // Less aggressive monitoring
  const startMonitoring = () => {
    // Initial check with delay to avoid false positives
    setTimeout(() => {
      if (checkDevTools()) return;
    }, 1000);

    // Less frequent monitoring
    const interval = setInterval(checkDevTools, 2000);

    // Keyboard shortcuts prevention
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        redirectToError();
      }
    });

    // Prevent right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Override common dev tools detection evasion
    Object.defineProperty(window, 'devtools', {
      get: () => {
        redirectToError();
        return undefined;
      }
    });

    // Monitor for source code viewing attempts
    document.addEventListener('keypress', (e) => {
      if (e.ctrlKey && (e.key === 'u' || e.key === 's')) {
        e.preventDefault();
        redirectToError();
      }
    });

    return () => {
      clearInterval(interval);
    };
  };

  return { startMonitoring };
}; 