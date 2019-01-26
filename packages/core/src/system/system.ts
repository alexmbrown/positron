import { Context } from './context';
import { ContextType } from './context-type';
import { SystemDelegate } from './system-delegate';
import { BrowserSystem } from './browser-system';

export class System {

  private static delegate: SystemDelegate;

  static newContext(type: ContextType): Context {
    this.checkDelegate();
    return System.delegate.newContext(type);
  }

  private static checkDelegate() {
    this.delegate = new BrowserSystem();
  }

}
