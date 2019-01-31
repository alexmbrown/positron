import { InputListener } from './input-listener';

export type OnAnalog = (name: string, value: number, tpf: number) => void;

export class AnalogListener implements InputListener {

  constructor(private listener: OnAnalog) {}

  public onAnalog(name: string, value: number, tpf: number): void {
    this.listener(name, value, tpf);
  };
}
