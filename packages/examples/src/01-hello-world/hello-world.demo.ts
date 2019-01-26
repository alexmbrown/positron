import { Demo, Box } from '@positron/core';

export class HelloWorldDemo extends Demo {

  public prepare() {
    const b: Box = new Box(1, 1, 1);
    // const geom: Geometry = new Geometry("Box", b);
  }

}
