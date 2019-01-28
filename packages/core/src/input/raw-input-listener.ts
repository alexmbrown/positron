import { KeyInputEvent } from './event/key-input-event';

export interface RawInputListener {
  beginInput(): void;
  endInput(): void;
  // onJoyAxisEvent(evt: JoyAxisEvent): void;
  // onJoyButtonEvent(evt: JoyButtonEvent): void;
  // onMouseMotionEvent(evt: MouseMotionEvent): void;
  // onMouseButtonEvent(evt: MouseButtonEvent): void;
  onKeyEvent(evt: KeyInputEvent): void;
  // onTouchEvent(evt: TouchEvent): void;
}
