import { BufferType } from './buffer/buffer-type';
import { BufferUsage } from './buffer/buffer-usages';
import { BufferFormat } from './buffer/buffer-format';
import { NativeObject } from '../util/native-object';

export class VertexBuffer extends NativeObject {

  protected offset: number = 0;
  protected lastLimit: number = 0;
  protected stride: number = 0;
  protected components: number = 0;

  protected componentsLength: number = 0;
  protected data: ArrayBufferLike = null;
  protected usage: BufferUsage;
  protected bufType: BufferType;
  protected format: BufferFormat;
  protected normalized: boolean = false;
  protected instanceSpan: number = 0;
  protected dataSizeChanged: boolean = false;

  constructor(type: BufferType) {
    super();
    this.bufType = type;
  }

  setupData(usage: BufferUsage, components: number, format: BufferFormat, data: ArrayBufferLike) {
    if (this.id != -1) {
      throw new Error("Data has already been sent. Cannot setupData again.");
    }

    if (usage == null || format == null || data == null) {
      throw new Error("None of the arguments can be null");
    }

    if (this.bufType != BufferType.InstanceData) {
      if (components < 1 || components > 4) {
        throw new Error("components must be between 1 and 4");
      }
    }

    this.data = data;
    this.components = components;
    this.usage = usage;
    this.format = format;
    this.componentsLength = components * format;
    this.lastLimit = data.byteLength;
    this.setUpdateNeeded();
  }

  updateData(data: ArrayBufferLike) {
    if (this.lastLimit !== data.byteLength){
      this.dataSizeChanged = true;
    }

    this.data = data;
    this.setUpdateNeeded();
  }

  getBufferType(): BufferType {
    return this.bufType;
  }

  getNumComponents(): number {
    return this.components;
  }

  getFormat(): BufferFormat {
    return this.format;
  }

  getData(): ArrayBufferLike {
    return this.data;
  }

  getBaseInstanceCount(): number {
    if(this.instanceSpan === 0) {
      return 1;
    }
    return this.getNumElements() * this.instanceSpan;
  }

  getNumElements(): number {
    if (this.data == null ) {
      return 0;
    }
    let elements: number = this.data.byteLength / this.components;
    if (this.format == BufferFormat.Half) {
      elements /= 2;
    }
    return elements;
  }

  setUsage(usage: BufferUsage) {
    this.usage = usage;
  }

}
