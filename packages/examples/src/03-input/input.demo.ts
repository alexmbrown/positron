import { Demo, Box, KeyInput, KeyTrigger, MouseInput, MouseAxisTrigger, MouseButtonTrigger } from '@positron/core';
export class InputDemo extends Demo {

  public prepare() {
    // const b: Box = new Box(1, 1, 1);
    // const geom:  Geometry = new Geometry(''Box'', b);
    this.initKeys();
  }

  private initKeys(): void {
    // You can map one or several inputs to one named action
    this.inputManager.addMapping('Pause',  new KeyTrigger(KeyInput.KEY_P));
    this.inputManager.addMapping('Left',   new KeyTrigger(KeyInput.KEY_J));
    this.inputManager.addMapping('Right',  new MouseAxisTrigger(MouseInput.AXIS_WHEEL, true));
    this.inputManager.addMapping('Rotate',
      new KeyTrigger(KeyInput.KEY_SPACE),
      new MouseButtonTrigger(MouseInput.BUTTON_LEFT));
    // this.inputManager.addListener((name: string, keyPressed: boolean, tpf: number) => {
    //   console.log('BLAR', keyPressed);
    // }, 'Right');
    this.inputManager.addAnalogListener((name: string, value: number, tpf: number) => {
      console.log('HAR', value);
    }, 'Right');
  }

}
