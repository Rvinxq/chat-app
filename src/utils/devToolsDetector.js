export const detectDevTools = () => {
  const redirectToError = () => {
    // Only redirect if not already on error page
    if (!window.location.pathname.includes('/error')) {
      window.location.href = '/error';
    }
  };

  // More reliable dev tools detection
  const checkDevTools = () => {
    try {
      // Method 1: Size comparison
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      // Method 2: Dev tools element detection
      const devToolsElement = window.document.getElementById('__react-dev-tools-hook__');
      
      // Method 3: Check for dev tools object
      const isDevToolsOpen = !!(window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || 
        window.Firebug || 
        window.chrome?.webstore);

      // Method 4: Performance timing
      const startTime = performance.now();
      console.profile();
      console.profileEnd();
      const endTime = performance.now();
      const timingCheck = endTime - startTime > 20;

      // Method 5: RegExp toString check
      const regexCheck = /./;
      regexCheck.toString = () => {
        redirectToError();
        return 'devtools';
      };
      console.log(regexCheck);

      if (widthThreshold || heightThreshold || devToolsElement || isDevToolsOpen || timingCheck) {
        redirectToError();
        return true;
      }
    } catch (e) {
      // If any error occurs during checks, assume dev tools might be open
      redirectToError();
      return true;
    }
    return false;
  };

  // Less aggressive monitoring
  const startMonitoring = () => {
    // Initial check for pre-opened dev tools
    if (checkDevTools()) return;

    // Continuous monitoring
    const interval = setInterval(checkDevTools, 1000);

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
      redirectToError();
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