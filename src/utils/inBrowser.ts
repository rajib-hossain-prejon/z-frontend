export const getWindow = () =>
  typeof window === 'undefined' ? undefined : window;

const inBrowser = (fn: Function, defaultReturn: any) => {
  if (typeof window === 'undefined') return defaultReturn;
  return fn();
};

export default inBrowser;
