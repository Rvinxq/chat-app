const disableDevTools = () => {
  // Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Disable keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Disable F12
    if (e.keyCode === 123) e.preventDefault();
    
    // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
      e.preventDefault();
    }
    
    // Disable Ctrl+U
    if (e.ctrlKey && e.keyCode === 85) e.preventDefault();
  });

  // Detect DevTools
  const detectDevTools = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if (widthThreshold || heightThreshold) {
      document.body.innerHTML = 'DevTools detected. Access denied.';
    }
  };

  // Clear console
  const clearConsole = () => {
    console.clear();
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  };

  window.addEventListener('resize', detectDevTools);
  setInterval(detectDevTools, 1000);
  clearConsole();
};

export default disableDevTools; 