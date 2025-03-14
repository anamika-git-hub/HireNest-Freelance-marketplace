
export {};

declare global {
  interface Window {
    global: Window;
    process: any;
  }
}

window.global = window;
window.process = {
  env: { DEBUG: undefined },
  version: '',
  nextTick: require('next-tick')
};