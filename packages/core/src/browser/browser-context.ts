import { Context } from '../system/context';
import { ContextType } from '../system/context-type';
import { SystemListener } from '../system/system-listener';
import { WebGL } from './webgl';
import { KeyInput } from '../input/key-input';
import { BrowserKeyInput } from './browser-key-input';

export class BrowserContext implements Context {

  protected canvas: HTMLCanvasElement = document.createElement('canvas');
  private glContext: WebGLRenderingContext = this.canvas.getContext('webgl');

  private systemListener: SystemListener;

  private created = false;
  private attached = false;
  private renderable = false;

  protected createContext() {
    if (!this.attached) {
      this.attach();
    }
    if (!this.glContext) {
      console.error('Unable to initialize WebGL. Your browser or machine may not support it.');
    } else {
      this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
      this.glContext.clear(WebGL.COLOR_BUFFER_BIT);
    }
  }

  public start(): void {
    if (!this.systemListener) {
      throw new Error('Context contains no system listener')
    }

    while(true) {
      this.runLoop();
    }
  }

  protected runLoop() {
    if (!this.created) {
      throw new Error('Context has not been created');
    }

    this.systemListener.update();
  }

  public create(waitFor?: boolean) {
    if (!this.attached) {
      this.attach();
    }
    if (!this.glContext) {
      console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
    } else {
      this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
      this.glContext.clear(WebGL.COLOR_BUFFER_BIT);
    }
    this.created = true;
  }

  public destroy(waitFor: boolean): boolean {
    return false;
  }

  public getType(): ContextType {
    return undefined;
  }

  public isCreated(): boolean {
    return false;
  }

  public isRenderable(): boolean {
    return false;
  }

  public restart(): boolean {
    return false;
  }

  public setSystemListener(listener: SystemListener): void {
    this.systemListener = listener;
  }

  /*
  * Attach canvas to element or body
  */
  public attach(element?: HTMLElement) {
    if (element) {
      element.appendChild(this.canvas);
    } else {
      document.body.appendChild(this.canvas);
    }
    this.attached = true;
  }

  public isAttached(): boolean {
    return this.attached;
  }

  public getKeyInput(): KeyInput {
    // TODO: shouldn't be creating a new input every time
    return new BrowserKeyInput(this);
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

}
