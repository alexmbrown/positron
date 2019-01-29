import { Demo, Box, KeyInput, KeyTrigger } from '@positron/core';

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
    this.inputManager.addMapping('Right',  new KeyTrigger(KeyInput.KEY_K));
    this.inputManager.addMapping('Rotate', new KeyTrigger(KeyInput.KEY_SPACE));
    //   new MouseButtonTrigger(MouseInput.BUTTON_LEFT));
    // // Add the names to the action listener.
    this.inputManager.addListener((name: string, keyPressed: boolean, tpf: number) => {
      console.log('BLAR');
    }, 'Rotate');
    // inputManager.addListener(analogListener, ''Left'', ''Right'', ''Rotate'');
  }

}
