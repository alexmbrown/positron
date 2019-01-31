import { MouseInput } from '../input/mouse-input';
import { BrowserContext } from './browser-context';
import { RawInputListener } from '../input/raw-input-listener';
import { MouseMotionEvent } from '../input/event/mouse-motion-event';
import { MouseButtonEvent } from '../input/event/mouse-button-event';

export class BrowserMouseInput implements MouseInput {

  private static WHEEL_SCALE: number = 120;

  private mouseMotionEvents: MouseMotionEvent[] = [];
  private mouseButtonEvents: MouseButtonEvent[] = [];

  private listener: RawInputListener;

  private mouseX: number;
  private mouseY: number;
  private mouseWheel: number;
  private currentWidth: number;
  private currentHeight: number;

  private cursorVisible: boolean;
  private initialized: boolean;

  public constructor(private context: BrowserContext) {
    this.context = context;
    this.cursorVisible = true;
  }

  private onCursorPos = (event: MouseEvent): void => {
    const x = Math.round(event.x);
    const y = this.currentHeight - Math.round(event.y);
    const xDelta = x - this.mouseX;
    const yDelta = y - this.mouseY;
    this.mouseX = x;
    this.mouseY = y;

    if (xDelta != 0 || yDelta != 0) {
      const mouseMotionEvent: MouseMotionEvent = new MouseMotionEvent(
        x,
        y,
        xDelta,
        yDelta,
        this.mouseWheel,
        0
      );
      mouseMotionEvent.setTime(this.getInputTime());
      this.mouseMotionEvents.push(mouseMotionEvent);
    }
  };

  private onWheelScroll = (event: WheelEvent): void => {
    this.mouseWheel += event.deltaY;
    const mouseMotionEvent: MouseMotionEvent = new MouseMotionEvent(
      this.mouseX,
      this.mouseY,
      0,
      0,
      this.mouseWheel,
      event.deltaY
    );
    mouseMotionEvent.setTime(this.getInputTime());
    this.mouseMotionEvents.push(mouseMotionEvent);
  };

  private onMouseButtonDown = (event: MouseEvent): void => {
    const mouseButtonEvent: MouseButtonEvent = new MouseButtonEvent(
      this.convertButton(event.button),
      true,
      this.mouseX,
      this.mouseY
    );
    mouseButtonEvent.setTime(this.getInputTime());
    this.mouseButtonEvents.push(mouseButtonEvent);
  };

  private onMouseButtonUp = (event: MouseEvent): void => {
    const mouseButtonEvent: MouseButtonEvent = new MouseButtonEvent(
      this.convertButton(event.button),
      false,
      this.mouseX,
      this.mouseY
    );
    mouseButtonEvent.setTime(this.getInputTime());
    this.mouseButtonEvents.push(mouseButtonEvent);
  };

  public initialize(): void {

    this.currentWidth = this.context.getCanvas().width;
    this.currentHeight = this.context.getCanvas().height;

    this.context.getCanvas().addEventListener('mousemove', this.onCursorPos);
    this.context.getCanvas().addEventListener('mousewheel', this.onWheelScroll);
    this.context.getCanvas().addEventListener('mousedown', this.onMouseButtonDown);
    this.context.getCanvas().addEventListener('mouseup', this.onMouseButtonUp);
    this.context.getCanvas().addEventListener('resize', (event: any) => {
      // this.onResize(event);
      // currentHeight = height;
      // currentWidth = width;
    });

    if(!this.listener) {
      this.sendFirstMouseEvent();
    }

    // this.setCursorVisible(this.cursorVisible);
    this.initialized = true;
  }

  private sendFirstMouseEvent(): void {
    if (this.listener) {
      const evt: MouseMotionEvent = new MouseMotionEvent(
        this.mouseX,
        this.mouseY,
        0,
        0,
        this.mouseWheel,
        0
      );
      evt.setTime(this.getInputTime());
      this.listener.onMouseMotionEvent(evt);
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public update(): void {

    // Process events
    while (this.mouseMotionEvents.length > 0) {
      this.listener.onMouseMotionEvent(this.mouseMotionEvents.pop());
    }

    while (this.mouseButtonEvents.length > 0) {
      this.listener.onMouseButtonEvent(this.mouseButtonEvents.pop());
    }
  }

  public destroy(): void {
    // if (!this.context.isRenderable()) {
    //   return;
    // }

    document.removeEventListener('mousemove', this.onCursorPos);
    document.removeEventListener('mousewheel', this.onWheelScroll);
    document.removeEventListener('mousedown', this.onMouseButtonDown);
    document.removeEventListener('mouseup', this.onMouseButtonUp);
    // document.removeEventListener('resize', this.onKeypress);
  }

  public setInputListener(listener: RawInputListener): void {
    this.listener = listener;
    if (!listener && this.initialized) {
      this.sendFirstMouseEvent();
    }
  }

  public getInputTime(): number {
    return performance.now() / 1000.0;
  }


  private convertButton(button: number): number {
    switch (button) {
      case 0:
        return MouseInput.BUTTON_LEFT;
      case 1:
        return MouseInput.BUTTON_MIDDLE;
      case 2:
        return MouseInput.BUTTON_RIGHT;
      case 3:
        return MouseInput.BUTTON_4;
      case 4:
        return MouseInput.BUTTON_5;
      default:
        return button;
    }
  }
}
