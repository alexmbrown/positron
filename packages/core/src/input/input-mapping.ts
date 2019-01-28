import { InputListener } from './controls/input-listener';
import { Trigger } from './controls/trigger';

export class InputMapping {

  public triggers: Trigger[] = [];
  public listeners: InputListener[] = [];

  constructor(private name: string) {}

  public getName(): string {
    return this.name;
  }
}
