import { Timer } from './timer';

export class PerformanceTimer extends Timer {

  private static TIMER_RESOLUTION: number = 1000;
  private static INVERSE_TIMER_RESOLUTION: number = 1.0/PerformanceTimer.TIMER_RESOLUTION;

  private startTime: number;
  private previousTime: number;
  private tpf: number;
  private fps: number;

  public PerformanceTimer() {
    // TODO: validate performance exists
    this.startTime = performance.now();
  }

  public getTimeInSeconds(): number {
    return this.getTime() * PerformanceTimer.INVERSE_TIMER_RESOLUTION;
  }

  public getTime(): number {
    return performance.now() - this.startTime;
  }

  public getResolution(): number {
    return PerformanceTimer.TIMER_RESOLUTION;
  }

  public getFrameRate(): number {
    return this.fps;
  }

  public getTimePerFrame(): number {
    return this.tpf;
  }

  public update(): void {
    this.tpf = (this.getTime() - this.previousTime) * (1.0 / PerformanceTimer.TIMER_RESOLUTION);
    this.fps = 1.0 / this.tpf;
    this.previousTime = this.getTime();

    console.log(this.tpf);
  }

  public reset(): void {
    this.startTime = performance.now();
    this.previousTime = this.getTime();
  }
}
