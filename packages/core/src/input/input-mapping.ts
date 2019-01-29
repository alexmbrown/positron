import { InputListener } from './controls/input-listener';

export class InputMapping {

  public triggers: number[] = [];
  public listeners: InputListener[] = [];

  constructor(private name: string) {}

  public getName(): string {
    return this.name;
  }
}
