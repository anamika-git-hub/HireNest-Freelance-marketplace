/// <reference types="react-scripts" />
declare module 'simple-peer/simplepeer.min.js' {
    const SimplePeer: any;
    export default SimplePeer;
  }
  
  interface Window {
    global: Window;
    process: any;
  }