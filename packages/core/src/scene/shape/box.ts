import { AbstractBox } from './abstract-box';
import { Vector3 } from '../../math/vector3';
import { isNumber } from '../../util/type-utils';
import { BufferType } from '../buffer/buffer-type';

export class Box extends AbstractBox {

  private static GEOMETRY_INDICES_DATA: number[] = [
    2,  1,  0,  3,  2,  0, // back
    6,  5,  4,  7,  6,  4, // right
    10,  9,  8, 11, 10,  8, // front
    14, 13, 12, 15, 14, 12, // left
    18, 17, 16, 19, 18, 16, // top
    22, 21, 20, 23, 22, 20  // bottom
  ];

  private static GEOMETRY_NORMALS_DATA: number[] = [
    0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1, // back
    1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0, // right
    0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1, // front
    -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, // left
    0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0, // top
    0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0  // bottom
  ];

  private static GEOMETRY_TEXTURE_DATA: number[] = [
    1, 0, 0, 0, 0, 1, 1, 1, // back
    1, 0, 0, 0, 0, 1, 1, 1, // right
    1, 0, 0, 0, 0, 1, 1, 1, // front
    1, 0, 0, 0, 0, 1, 1, 1, // left
    1, 0, 0, 0, 0, 1, 1, 1, // top
    1, 0, 0, 0, 0, 1, 1, 1  // bottom
  ];


  constructor(x?: number, y?: number, z?: number) {
    super();
    if (isNumber(x) && isNumber(y) && isNumber(z)) {
      this.updateGeometry(Vector3.ZERO, x, y, z);
    }
  }

  // public clone(): Box {
  //   return new Box(center.clone(), xExtent, yExtent, zExtent);
  // }

  protected doUpdateGeometryIndices() {
    if (this.getBuffer(BufferType.Index) == null){
      this.setBuffer(BufferType.Index, 3, new Int16Array(Box.GEOMETRY_INDICES_DATA));
    }
  }

  protected doUpdateGeometryNormals() {
    if (this.getBuffer(BufferType.Normal) == null){
      this.setBuffer(BufferType.Normal, 3, new Float32Array(Box.GEOMETRY_NORMALS_DATA));
    }
  }

  protected doUpdateGeometryTextures() {
    if (this.getBuffer(BufferType.TexCoord) == null){
      this.setBuffer(BufferType.TexCoord, 2, new Float32Array(Box.GEOMETRY_TEXTURE_DATA));
    }
  }

  protected doUpdateGeometryVertices() {
    // FloatBuffer fpb = BufferUtils.createVector3Buffer(24);
    // Vector3f[] v = computeVertices();
    // fpb.put(new float[] {
    //   v[0].x, v[0].y, v[0].z, v[1].x, v[1].y, v[1].z, v[2].x, v[2].y, v[2].z, v[3].x, v[3].y, v[3].z, // back
    //     v[1].x, v[1].y, v[1].z, v[4].x, v[4].y, v[4].z, v[6].x, v[6].y, v[6].z, v[2].x, v[2].y, v[2].z, // right
    //     v[4].x, v[4].y, v[4].z, v[5].x, v[5].y, v[5].z, v[7].x, v[7].y, v[7].z, v[6].x, v[6].y, v[6].z, // front
    //     v[5].x, v[5].y, v[5].z, v[0].x, v[0].y, v[0].z, v[3].x, v[3].y, v[3].z, v[7].x, v[7].y, v[7].z, // left
    //     v[2].x, v[2].y, v[2].z, v[6].x, v[6].y, v[6].z, v[7].x, v[7].y, v[7].z, v[3].x, v[3].y, v[3].z, // top
    //     v[0].x, v[0].y, v[0].z, v[5].x, v[5].y, v[5].z, v[4].x, v[4].y, v[4].z, v[1].x, v[1].y, v[1].z  // bottom
    // });
    // setBuffer(Type.Position, 3, fpb);
    // updateBound();
  }

}
