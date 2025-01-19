const disableDevTools = () => {
  // Only disable console logs
  const clearConsole = () => {
    console.clear();
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  };

  clearConsole();
};

export default disableDevTools; 