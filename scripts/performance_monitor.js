/**
 * @file PerformanceMonitor.js
 * @description Provides on-screen performance metrics for debugging mobile stuttering.
 */
class PerformanceMonitor {
  static frames = 0;
  static lastTime = performance.now();
  static fps = 0;
  static soundCalls = 0;
  static soundCallsPerSecond = 0;
  static lastSoundTime = performance.now();

  static update() {
    this.frames++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = now;
      this.soundCallsPerSecond = this.soundCalls;
      this.soundCalls = 0;
    }
  }

  static trackSound() {
    this.soundCalls++;
  }

  static draw(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, 10, 150, 60);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`FPS: ${this.fps}`, 20, 30);
    ctx.fillText(`Sound Calls/s: ${this.soundCallsPerSecond}`, 20, 55);
    ctx.restore();
  }
}
window.PerformanceMonitor = PerformanceMonitor;
