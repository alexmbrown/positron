import { InputListener } from './input-listener';

export type OnAction = (name: string, isPressed: boolean, tpf: number) => void;

export class ActionListener implements InputListener {

  constructor(private listener: OnAction) {}

  public onAction(name: string, isPressed: boolean, tpf: number): void {
    this.listener(name, isPressed, tpf);
  };
}
