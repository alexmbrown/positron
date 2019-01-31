import { InputEvent } from './input-event';

export class MouseButtonEvent extends InputEvent {

  constructor(
    private btnIndex: number,
    private pressed: boolean,
    private x: number,
    private y: number
  ) {
    super();
  }

  public getButtonIndex(): number {
    return this.btnIndex;
  }

  public isPressed(): boolean {
    return this.pressed;
  }

  public isReleased(): boolean {
    return !this.pressed;
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public toString(): string {
    const str: string = "MouseButton(BTN="+ this.btnIndex;
    if (this.pressed){
      return str + ", PRESSED)";
    }else{
      return str + ", RELEASED)";
    }
  }

}
