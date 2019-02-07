import { BufferType } from './buffer/buffer-type';
import { VertexBuffer } from './vertex-buffer';
import { BufferUsage } from './buffer/buffer-usages';
import { BufferFormat } from './buffer/buffer-format';
import { MeshMode } from './mesh-mode';

export class Mesh {

  private mode: MeshMode = MeshMode.Triangles;
  private buffers: Map<BufferType, VertexBuffer> = new Map();

  private vertCount: number = -1;
  private elementCount: number = -1;
  private instanceCount: number = -1;
  private patchVertexCount: number = 3; //only used for tessellation

  protected getBuffer(type: BufferType): VertexBuffer {
    return this.buffers.get(type)
  }

  setVertexBuffer(vb: VertexBuffer) {
    if (this.buffers.get(vb.getBufferType())) {
      throw new Error("Buffer type already set: " + vb.getBufferType());
    }

    this.buffers.set(vb.getBufferType(), vb);
    // buffersList.add(vb);
    this.updateCounts();
  }

  protected setBuffer(type: BufferType, components: number, buffer: ArrayBufferLike) {
    const format: BufferFormat = BufferFormat.fromBuffer(buffer);
    const vb: VertexBuffer = this.getBuffer(type);
    if (!vb) {
      let vb: VertexBuffer = new VertexBuffer(type);
      vb.setupData(BufferUsage.Dynamic, components, format, buffer);
      this.setVertexBuffer(vb);
    } else {
      if (vb.getNumComponents() !== components || vb.getFormat() !== format){
        throw new Error("The buffer already set is incompatible with the given parameters");
      }
      vb.updateData(buffer);
      this.updateCounts();
    }
  }

  public updateCounts() {
    if (this.getBuffer(BufferType.InterleavedData)) {
      throw new Error("Should update counts before interleave");
    }

    const pb: VertexBuffer = this.getBuffer(BufferType.Position);
    const ib: VertexBuffer = this.getBuffer(BufferType.Index);
    if (pb != null){
      this.vertCount = pb.getData().byteLength / pb.getNumComponents();
    }
    if (ib != null){
      this.elementCount = this.computeNumElements(ib.getData().byteLength);
    }else{
      this.elementCount = this.computeNumElements(this.vertCount);
    }
    this.instanceCount = this.computeInstanceCount();
  }

  private computeNumElements(bufSize: number): number {
    switch (this.mode){
      case MeshMode.Triangles:
          return bufSize / 3;
      case MeshMode.TriangleFan:
      case MeshMode.TriangleStrip:
          return bufSize - 2;
      case MeshMode.Points:
          return bufSize;
      case MeshMode.Lines:
          return bufSize / 2;
      case MeshMode.LineLoop:
          return bufSize;
      case MeshMode.LineStrip:
          return bufSize - 1;
      case MeshMode.Patch:
          return bufSize/this.patchVertexCount;
      default:
        throw new Error();
    }
  }

  private computeInstanceCount(): number {
    let max: number = 0;
    this.buffers.forEach((vb: VertexBuffer) => {
      if(vb.getBaseInstanceCount() > max ) {
        max = vb.getBaseInstanceCount();
      }
    });
    return max;
  }

  setStatic() {
    this.buffers.forEach((vb: VertexBuffer) => {
      vb.setUsage(BufferUsage.Static);
    });
  }


}
