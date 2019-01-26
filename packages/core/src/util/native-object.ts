
export class NativeObject {

  public static INVALID_ID = -1;
  protected static OBJTYPE_VERTEXBUFFER = 1;
  protected static OBJTYPE_TEXTURE      = 2;
  protected static OBJTYPE_FRAMEBUFFER  = 3;
  protected static OBJTYPE_SHADER       = 4;
  protected static OBJTYPE_SHADERSOURCE = 5;
  protected static OBJTYPE_AUDIOBUFFER  = 6;
  protected static OBJTYPE_AUDIOSTREAM  = 7;
  protected static OBJTYPE_FILTER       = 8;
  protected static OBJTYPE_BO           = 9;

  protected id: number = NativeObject.INVALID_ID;
  protected handleRef: any = null;
  protected updateNeeded: boolean = true;

  constructor();
  constructor(id: number);
  constructor(id?: number) {
    this.handleRef = {};
    if (Number.isInteger(id)) {
      this.id = id;
    }
  }

  setUpdateNeeded(){
    this.updateNeeded = true;
  }

}
