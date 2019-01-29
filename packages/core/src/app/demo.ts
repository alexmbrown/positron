import { Application } from './application';

export class Demo extends Application {

  // public initialize() {
  //   super.initialize();
  // }

  start(): Promise<boolean> {
    return super.start();
  }

  public prepare(): void {}

}
