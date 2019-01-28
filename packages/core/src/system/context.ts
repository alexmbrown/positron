import { SystemListener } from './system-listener';
import { ContextType } from './context-type';
import { KeyInput } from '../input/key-input';

export interface Context {
  attach(element?: HTMLElement): void;
  getType(): ContextType;
  // setSettings(settings: AppSettings): void;
  setSystemListener(listener: SystemListener): void;
  // getSettings(): AppSettings;
  // getRenderer(): Renderer;
  // getOpenCLContext(): CLContext;
  // getMouseInput(): MouseInput;
  getKeyInput(): KeyInput;
  // getJoyInput(): JoyInput;
  // getTouchInput(): TouchInput;
  // getTimer(): Timer;
  isAttached(): boolean;
  isCreated(): boolean;
  isRenderable(): boolean;
  // setAutoFlushFrames(enabled: boolean): boolean;
  create(waitFor?: boolean): void;
  start(): void;
  restart(): boolean;
  destroy(waitFor: boolean): boolean;
}
