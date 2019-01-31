import { InputEvent } from './input-event';

export class MouseMotionEvent extends InputEvent {

  constructor(
    private x: number,
    private y: number,
    private dx: number,
    private dy: number,
    private wheel: number,
    private deltaWheel: number
  ) {
      super()
  }

  public getDeltaWheel(): number {
    return this.deltaWheel;
  }

  public getDX(): number {
    return this.dx;
  }

  public getDY(): number {
    return this.dy;
  }

  public getWheel(): number {
    return this.wheel;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public toString(): string {
    return "MouseMotion(X=" + this.x + ", Y=" + this.y + ", DX=" + this.dx +", DY="+ this.dy +
      ", Wheel= "+ this.wheel + ", dWheel=" + this.deltaWheel + ")";
  }

}
