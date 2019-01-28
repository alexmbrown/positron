import { InputEvent } from './input-event';

export class KeyInputEvent extends InputEvent {

  constructor(
    private keyCode: number,
    private keyChar: string,
    private pressed: boolean,
    private repeating: boolean
  ) {
    super();
  }

  public getKeyChar(): string {
    return this.keyChar;
  }

  public getKeyCode(): number {
    return this.keyCode;
  }


  public isPressed(): boolean {
    return this.pressed;
  }

  public isRepeating(): boolean {
    return this.repeating;
  }

  public isReleased(): boolean {
    return !this.pressed;
  }

  public toString(): string {
    let str: string = "Key(CODE="+ this.keyCode;
    if (this.keyChar != '\0')
      str = str + ", CHAR=" + this.keyChar;
    if (this.repeating){
      return str + ", REPEATING)";
    }else if (this.pressed){
      return str + ", PRESSED)";
    }else{
      return str + ", RELEASED)";
    }
  }
}
