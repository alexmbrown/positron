import { Trigger } from './trigger';
import { MouseInput } from '../mouse-input';

export class MouseAxisTrigger implements Trigger {

  constructor(
    private readonly mouseAxis: number,
    private readonly negative: boolean
  ) {
    if (mouseAxis < 0 || mouseAxis > 2) {
      throw new Error("Mouse Axis must be between 0 and 2");
    }
    this.mouseAxis = mouseAxis;
    this.negative = negative;
  }

  public getMouseAxis(): number {
    return this.mouseAxis;
  }

  public isNegative(): boolean {
    return this.negative;
  }

  public getName(): string {
    const sign: string = this.negative ? "Negative" : "Positive";
    switch (this.mouseAxis){
      case MouseInput.AXIS_X: return "Mouse X Axis " + sign;
      case MouseInput.AXIS_Y: return "Mouse Y Axis " + sign;
      case MouseInput.AXIS_WHEEL: return "Mouse Wheel " + sign;
      default: throw new Error();
    }
  }

  public static mouseAxisHash(mouseAxis: number, negative: boolean): number {
    if (mouseAxis >= 0 && mouseAxis <= 255) {
      return (negative ? 768 : 512) | (mouseAxis & 0xff);
    }
  }

  public triggerHashCode(): number {
    return MouseAxisTrigger.mouseAxisHash(this.mouseAxis, this.negative);
  }
}
