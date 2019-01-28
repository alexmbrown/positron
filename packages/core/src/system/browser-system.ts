import { SystemDelegate } from './system-delegate';
import { ContextType } from './context-type';
import { Context } from './context';
import { BrowserContext } from '../browser/browser-context';

export class BrowserSystem extends SystemDelegate {

  public initialize(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    // TODO: log build info

  }

  public newContext(contextType: ContextType): Context {
    this.initialize();
    return new BrowserContext();
  }

}
