import { ContextType } from './context-type';
import { Context } from './context';

export abstract class SystemDelegate {

  protected initialized: boolean = false;

  abstract initialize(): void;

  abstract newContext(contextType: ContextType): Context;

}
