import { InputListener } from './input-listener';

export abstract class ActionListener implements InputListener {
  public onAction(name: string, isPressed: boolean, tpf: number): void {};
}
