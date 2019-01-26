import { SystemDelegate } from './system-delegate';
import { ContextType } from './context-type';
import { Context } from './context';
import { WebglContext } from '../webgl/webgl-context';

export class BrowserSystem extends SystemDelegate {

  public initialize(): void {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    // TODO: log build info

  }

  public newContext(contextType: ContextType): Context {
    return new WebglContext();
  }

}
