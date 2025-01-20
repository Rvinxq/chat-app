export const detectDevTools = () => {
  const redirectToError = () => {
    // Only redirect if not already on error page
    if (!window.location.pathname.includes('/error')) {
      window.location.href = '/error';
    }
  };

  // Check if dev tools is already open
  const checkDevTools = () => {
    const threshold = 160;
    
    // Multiple detection methods but less aggressive
    const isDevToolsOpen = 
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold ||
      window.Firebug?.chrome?.isInitialized;

    if (isDevToolsOpen) {
      redirectToError();
      return true;
    }
    return false;
  };

  // Less aggressive monitoring
  const startMonitoring = () => {
    if (checkDevTools()) return;

    // Method 1: Size check - reduced frequency
    setInterval(checkDevTools, 3000);

    // Method 2: Prevent keyboard shortcuts
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
  };

  return { startMonitoring };
}; 