// Timer service
export const timerService = {
  start(callback: () => void): number {
    return window.setInterval(callback, 1000);
  },

  stop(interval_id: number): void {
    clearInterval(interval_id);
  },
};





