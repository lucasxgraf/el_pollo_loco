/**
 * @file PerformanceMonitor.js
 * @description Provides on-screen performance metrics for debugging mobile stuttering.
 */
class PerformanceMonitor {
  static soundCalls = 0;
  static soundCallsPerSecond = 0;
  static playCalls = 0;
  static playCallsPerSecond = 0;
  static lastTime = performance.now();

  static update() {
    this.frames++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.soundCallsPerSecond = this.soundCalls;
      this.soundCalls = 0;
      this.playCallsPerSecond = this.playCalls;
      this.playCalls = 0;
      this.lastTime = now;
    }
  }

  static trackSound() {
    this.soundCalls++;
  }

  static trackPlay() {
    this.playCalls++;
  }

  static draw(ctx) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(10, 10, 180, 80);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`FPS: ${this.fps}`, 20, 30);
    ctx.fillText(`API Access/s: ${this.soundCallsPerSecond}`, 20, 50);
    ctx.fillText(`API Play()/s: ${this.playCallsPerSecond}`, 20, 70);
    ctx.restore();
  }
}
window.PerformanceMonitor = PerformanceMonitor;
