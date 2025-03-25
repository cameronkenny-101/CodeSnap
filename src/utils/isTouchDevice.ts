/**
 * Detects if the current device is a touch device
 * This is used to determine which backend to use for react-dnd
 */
export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers that might not have maxTouchPoints
    (navigator.msMaxTouchPoints !== undefined && navigator.msMaxTouchPoints > 0);
}; 