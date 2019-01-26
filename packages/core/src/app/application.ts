import { SystemListener } from '../system/system-listener';
import { ContextType } from '../system/context-type';
import { System } from '../system/system';
import { Context } from '../system/context';

export class Application implements SystemListener {

  private context: Context;

  prepare() {}

  /*
   * Attach canvas to element or body
   */
  attach(element?: HTMLElement) {
    this.context.attach(element);
  }

  start() {
    // TODO: load settings
    this.context = System.newContext(ContextType.Display);
    this.context.setSystemListener(this);
    this.context.create();
  }

  destroy(): void {
    console.log('destroy');
  }

  gainFocus(): void {
    console.log('gainFocus');
  }

  handleError(errorMsg: string, t: Error): void {
    console.log('handleError');
  }

  loseFocus(): void {
    console.log('loseFocus');
  }

  requestClose(esc: boolean): void {
    console.log('requestClose');
  }

  reshape(width: number, height: number): void {
    console.log('reshape');
  }

  update(): void {
    console.log('update');
  }

  public initialize(): void {
  }

}
