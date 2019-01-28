import { Context } from './context';
import { ContextType } from './context-type';
import { SystemDelegate } from './system-delegate';
import { BrowserSystem } from './browser-system';

export class System {

  // TODO: eventual this delegate will be used to support different system types
  private static delegate: SystemDelegate = new BrowserSystem();

  static newContext(type: ContextType): Context {
    return System.delegate.newContext(type);
  }

}
