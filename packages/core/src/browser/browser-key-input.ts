import { KeyInput } from '../input/key-input';
import { RawInputListener } from '../input/raw-input-listener';
import { BrowserContext } from './browser-context';
import { KeyInputEvent } from '../input/event/key-input-event';

export class BrowserKeyInput extends KeyInput {

  private listener: RawInputListener;
  private keyInputEvents: KeyInputEvent[] = [];
  private initialized: boolean = false;

  constructor(private context: BrowserContext) {
    super();
  }

  public initialize(): void {
    // if (!this.context.isRenderable()) {
    //   return;
    // }

    // TODO: this probably shouldn't be at the document level
    document.addEventListener('keypress', (event: KeyboardEvent) => {
      this.onKeypress(event);
    });

    this.initialized = true;
  }

  private onKeypress(keyEvent: KeyboardEvent): void {
    let code: number = keyEvent.keyCode;
    if (code < 0 || code > KeyInput.KEY_LAST) {
      return;
    }

    // TODO: may have to possibly map key

    const event: KeyInputEvent = new KeyInputEvent(code, keyEvent.key, true, keyEvent.repeat);
    event.setTime(this.getInputTime());

    this.keyInputEvents.push(event);
  }

  public getKeyCount(): number {
    // TODO fix this
    return 255;
  }

  public update(): void {
    // if (!this.context.isRenderable()) {
    //   return;
    // }

    while (this.keyInputEvents.length > 0) {
      this.listener.onKeyEvent(this.keyInputEvents.pop());
    }
  }

  public destroy(): void {
    if (!this.context.isRenderable()) {
      return;
    }

    this.context.getCanvas().removeEventListener('keypress', this.onKeypress);
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public setInputListener(listener: RawInputListener): void {
    this.listener = listener;
  }


  public getInputTime(): number {
    // TODO: this should be in a utility
    return performance.now() * 1000000000;
  }

}
