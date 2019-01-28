export abstract class Timer {

  public abstract getTime(): number;

  public getTimeInSeconds(): number {
    return this.getTime() / this.getResolution();
  }

  public abstract getResolution(): number;
  public abstract getFrameRate(): number;
  public abstract getTimePerFrame(): number;
  public abstract update(): void;
  public abstract reset(): void;
}
