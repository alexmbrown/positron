import { RawInputListener } from './raw-input-listener';

export interface Input {
  initialize(): void;
  update(): void;
  destroy(): void;
  isInitialized(): boolean;
  setInputListener(listener: RawInputListener): void;
  getInputTime(): number;
}
