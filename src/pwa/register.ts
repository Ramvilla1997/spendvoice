/** Offline support only runs in production builds, so development never serves stale files. */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return;
  }
  void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
}
