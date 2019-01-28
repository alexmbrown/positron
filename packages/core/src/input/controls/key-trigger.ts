import { Trigger } from './trigger';

export class KeyTrigger implements Trigger {

  constructor(private keyCode: number) {}

  public getName(): string {
    return "KeyCode " + this.keyCode;
  }

  public getKeyCode(): number{
    return this.keyCode;
  }

  public static keyHash(keyCode: number): number {
    if (keyCode >= 0 && keyCode <= 255) {
      return keyCode & 0xff;
    }
  }

  public triggerHashCode(): number {
    return KeyTrigger.keyHash(this.keyCode);
  }

}
