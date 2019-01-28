export abstract class InputEvent {

  protected time: number;
  protected consumed: boolean = false;

  public getTime(): number{
    return this.time;
  }

  public setTime(time: number): void {
    this.time = time;
  }

  public isConsumed(): boolean {
    return this.consumed;
  }

  public setConsumed(): void {
    this.consumed = true;
  }

}
