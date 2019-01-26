export enum BufferFormat {
  Half = 2,
  Float32 = 4,
  Float64 = 8,
  Int8 = 1,
  Uint8 = 1,
  Int16 = 2,
  Uint16 = 2,
  Int32 = 4,
  Uint32 = 4
}

export namespace BufferFormat {

  export function fromBuffer(buffer: ArrayBufferLike): BufferFormat {
    if(buffer instanceof Int16Array) {
      return BufferFormat.Int16;
    } else if (buffer instanceof Float32Array) {
      return BufferFormat.Float32;
    }
  }

}
