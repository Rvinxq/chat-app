export const detectDevTools = () => {
  const redirectToError = () => {
    window.location.href = '/error';
  };

  // Check if dev tools is already open
  const checkDevTools = () => {
    const threshold = 160;
    
    // Multiple detection methods
    const isDevToolsOpen = 
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold ||
      window.Firebug?.chrome?.isInitialized ||
      /Chrome/.test(window.navigator.userAgent) && /Google Inc/.test(window.navigator.vendor) && window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
      window.devtools?.isOpen ||
      window.performance.memory?.usedJSHeapSize;

    if (isDevToolsOpen) {
      redirectToError();
      return true;
    }
    return false;
  };

  // Continuous monitoring
  const startMonitoring = () => {
    if (checkDevTools()) return;

    // Method 1: Size check
    setInterval(checkDevTools, 1000);

    // Method 2: Debugger detection
    setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        redirectToError();
      }
    }, 1000);

    // Method 3: Console override
    const consoleProxy = new Proxy(console, {
      get: (target, prop) => {
        redirectToError();
        return () => {};
      }
    });
    window.console = consoleProxy;

    // Method 4: Prevent keyboard shortcuts
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