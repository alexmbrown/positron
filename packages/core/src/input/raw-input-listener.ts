import { KeyInputEvent } from './event/key-input-event';
import { MouseMotionEvent } from './event/mouse-motion-event';
import { MouseButtonEvent } from './event/mouse-button-event';

export interface RawInputListener {
  beginInput(): void;
  endInput(): void;
  // onJoyAxisEvent(evt: JoyAxisEvent): void;
  // onJoyButtonEvent(evt: JoyButtonEvent): void;
  onMouseMotionEvent(evt: MouseMotionEvent): void;
  onMouseButtonEvent(evt: MouseButtonEvent): void;
  onKeyEvent(evt: KeyInputEvent): void;
  // onTouchEvent(evt: TouchEvent): void;
}
