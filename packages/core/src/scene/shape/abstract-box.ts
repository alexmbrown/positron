import { Mesh } from '../mesh';
import { Vector3 } from '../../math/vector3';
import { isNumber } from '../../util/type-utils';

export abstract class AbstractBox extends Mesh {

  center: Vector3 = new Vector3(0, 0, 0);
  xExtent: number;
  yExtent: number;
  zExtent: number;

  protected computeVertices(): Vector3[] {
    let axes: Vector3[] = [
      Vector3.UNIT_X.mult(this.xExtent),
      Vector3.UNIT_Y.mult(this.yExtent),
      Vector3.UNIT_Z.mult(this.zExtent)
    ];
    return [
      this.center.subtractVec(axes[0]).subtractLocalVec(axes[1]).subtractLocalVec(axes[2]),
      this.center.addVec(axes[0]).subtractLocalVec(axes[1]).subtractLocalVec(axes[2]),
      this.center.addVec(axes[0]).addLocalVec(axes[1]).subtractLocalVec(axes[2]),
      this.center.subtractVec(axes[0]).addLocalVec(axes[1]).subtractLocalVec(axes[2]),
      this.center.addVec(axes[0]).subtractLocalVec(axes[1]).addLocalVec(axes[2]),
      this.center.subtractVec(axes[0]).subtractLocalVec(axes[1]).addLocalVec(axes[2]),
      this.center.addVec(axes[0]).addLocalVec(axes[1]).addLocalVec(axes[2]),
      this.center.subtractVec(axes[0]).addLocalVec(axes[1]).addLocalVec(axes[2])
    ];
  }

  protected abstract doUpdateGeometryIndices(): void;
  protected abstract doUpdateGeometryNormals(): void;
  protected abstract doUpdateGeometryTextures(): void;
  protected abstract doUpdateGeometryVertices(): void;

  getCenter(): Vector3 {
      return this.center;
  }

  getXExtent(): number {
    return this.xExtent;
  }

  getYExtent(): number {
    return this.yExtent;
  }

  getZExtent(): number {
    return this.zExtent;
  }

  updateGeometry(): void;
  updateGeometry(center: Vector3, x: number, y: number, z: number): void;
  updateGeometry(center?: Vector3, x?: number, y?: number, z?: number): void {
    if (center instanceof Vector3 && isNumber(x) && isNumber(y) && isNumber(z)) {
      this.center.setVec(center);
      this.xExtent = x;
      this.yExtent = y;
      this.zExtent = z;
    }

    this.doUpdateGeometryVertices();
    this.doUpdateGeometryNormals();
    this.doUpdateGeometryTextures();
    this.doUpdateGeometryIndices();
    this.setStatic();
  }
}
