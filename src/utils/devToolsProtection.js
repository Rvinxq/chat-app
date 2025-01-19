export const enableDevToolsProtection = () => {
  const handleKeyDown = (e) => {
    // Prevent Ctrl+U, Ctrl+Shift+I, F12, Ctrl+Shift+J, Ctrl+Shift+C
    if (
      (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
      (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
      e.keyCode === 123 || // F12
      (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
      (e.ctrlKey && e.shiftKey && e.keyCode === 67) // Ctrl+Shift+C
    ) {
      e.preventDefault();
    }
  };

  // Prevent right-click inspect
  const handleContextMenu = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return true; // Allow right-click on input fields
    }
    const selection = window.getSelection().toString();
    if (selection.length > 0) {
      return true; // Allow right-click on text selection
    }
    if (e.target.closest('.allow-context-menu')) {
      return true; // Allow right-click on elements with this class
    }
    const menuItems = ['inspect', 'inspect element', 'view page source'];
    if (menuItems.includes(e.target.textContent.toLowerCase())) {
      e.preventDefault();
    }
  };

  // Detect and prevent DevTools
  const detectDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    if (widthThreshold || heightThreshold) {
      document.body.innerHTML = 'Developer tools are not allowed on this site.';
      window.location.reload();
    }
  };

  // Prevent debugging
  const preventDebugging = () => {
    setInterval(() => {
      debugger;
    }, 100);
  };

  // Add all event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('resize', detectDevTools);
  preventDebugging();

  // Disable console methods
  const disableConsole = () => {
    const noop = () => undefined;
    const methods = [
      'debug', 'error', 'info', 'log', 'warn', 'dir', 'dirxml', 'table',
      'trace', 'group', 'groupCollapsed', 'groupEnd', 'clear', 'count',
      'countReset', 'assert', 'profile', 'profileEnd', 'time', 'timeLog',
      'timeEnd', 'timeStamp', 'context', 'memory'
    ];
    methods.forEach((method) => {
      console[method] = noop;
    });
  };

  disableConsole();

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('resize', detectDevTools);
  };
}; 