import { Input } from './input';
import { RawInputListener } from './raw-input-listener';

export abstract class MouseInput implements Input {

  public static AXIS_X: number = 0;
  public static AXIS_Y: number = 1;
  public static AXIS_WHEEL: number = 2;
  public static BUTTON_LEFT: number = 0;
  public static BUTTON_RIGHT: number = 1;
  public static BUTTON_MIDDLE: number = 2;
  public static BUTTON_4: number = 3;
  public static BUTTON_5: number = 4;

  // public abstract setCursorVisible(visible: boolean): void;
  // public abstract getButtonCount(): number
  // public abstract setNativeCursor(cursor): void;

  public abstract destroy(): void;
  public abstract getInputTime(): number;
  public abstract initialize(): void;
  public abstract isInitialized(): boolean;
  public abstract setInputListener(listener: RawInputListener): void;
  public abstract update(): void;
}
