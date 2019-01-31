import { Trigger } from './trigger';

export class MouseButtonTrigger implements Trigger {

  constructor(private mouseButton: number) {
    if  (mouseButton < 0) {
      throw new Error('Mouse Button cannot be negative');
    }
  }

  public getMouseButton(): number {
    return this.mouseButton;
  }

  public getName(): string {
    return "Mouse Button " + this.mouseButton;
  }

  public static mouseButtonHash(mouseButton: number): number{
    if(mouseButton >= 0 && mouseButton <= 255) {
      return 256 | (mouseButton & 0xff);
    }
  }

  public triggerHashCode(): number {
    return MouseButtonTrigger.mouseButtonHash(this.mouseButton);
  }

}
