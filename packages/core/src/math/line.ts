/**
 * <code>Line</code> defines a line. Where a line is defined as infinite along
 * two points. The two points of the line are defined as the origin and direction.
 */
import { Cloneable } from '../util/cloneable';
import { Savable } from '../export/savable';
import { Vector3 } from './vector3';
import { Exporter } from '../export/exporter';
import { Importer } from '../export/importer';
import { OutputCapsule } from '../export/output-capsule';
import { InputCapsule } from '../export/input-capsule';
import { Matrix3 } from './matrix3';
import { Eigen3 } from './eigen3';

export class Line implements Savable, Cloneable<Line> {

  /**
   * Constructor instantiates a new <code>Line</code> object. The origin and
   * direction are set to defaults (0,0,0).
   *
   */
  constructor();

  /**
   * Constructor instantiates a new <code>Line</code> object. The origin
   * and direction are set via the parameters.
   * @param origin the origin of the line.
   * @param direction the direction of the line.
   */
  constructor(origin: Vector3, direction: Vector3);

  /**
   * Implementation
   */
  constructor(
    private origin: Vector3 = new Vector3(),
    private direction: Vector3 = new Vector3()
  ) {}

  /**
   *
   * <code>getOrigin</code> returns the origin of the line.
   * @return the origin of the line.
   */
  public getOrigin(): Vector3 {
    return this.origin;
  }

  /**
   *
   * <code>setOrigin</code> sets the origin of the line.
   * @param origin the origin of the line.
   */
  public setOrigin(origin: Vector3): void {
    this.origin = origin;
  }

  /**
   *
   * <code>getDirection</code> returns the direction of the line.
   * @return the direction of the line.
   */
  public getDirection(): Vector3 {
    return this.direction;
  }

  /**
   *
   * <code>setDirection</code> sets the direction of the line.
   * @param direction the direction of the line.
   */
  public setDirection(direction: Vector3): void {
    this.direction = direction;
  }

  public distanceSquared(point: Vector3): number {
    const compVec1: Vector3 = new Vector3();
    const compVec2: Vector3 = new Vector3();

    point.subtractVec(this.origin, compVec1);
    const lineParameter: number = this.direction.dot(compVec1);
    this.origin.addVec(this.direction.multScalar(lineParameter, compVec2), compVec2);
    compVec2.subtractVec(point, compVec1);
    return compVec1.lengthSquared();
  }

  public distance(point: Vector3): number {
    return Math.sqrt(this.distanceSquared(point));
  }

  public orthogonalLineFit(points: Float32Array): void {
    if (points == null) {
      return;
    }

    const compVec1: Vector3 = new Vector3();
    const compVec2: Vector3 = new Vector3();
    const compMat1: Matrix3 =  new Matrix3();
    const compEigen1: Eigen3 = new Eigen3();

    // points.rewind();

    // compute average of points
    const length: number = points.length / 3;

    // BufferUtils.populateFromBuffer(origin, points, 0);
    for (let i = 1; i < length; i++) {
      // BufferUtils.populateFromBuffer(compVec1, points, i);
      this.origin.addVecLocal(compVec1);
    }

    this.origin.multScalarLocal(1 / length);

    // compute sums of products
    let sumXX: number = 0.0, sumXY = 0.0, sumXZ = 0.0;
    let sumYY: number = 0.0, sumYZ = 0.0, sumZZ = 0.0;

    // points.rewind();
    for (let i = 0; i < length; i++) {
      // BufferUtils.populateFromBuffer(compVec1, points, i);
      compVec1.subtractVec(this.origin, compVec2);
      sumXX += compVec2.x * compVec2.x;
      sumXY += compVec2.x * compVec2.y;
      sumXZ += compVec2.x * compVec2.z;
      sumYY += compVec2.y * compVec2.y;
      sumYZ += compVec2.y * compVec2.z;
      sumZZ += compVec2.z * compVec2.z;
    }

    //find the smallest eigen vector for the direction vector
    compMat1.m00 = sumYY + sumZZ;
    compMat1.m01 = -sumXY;
    compMat1.m02 = -sumXZ;
    compMat1.m10 = -sumXY;
    compMat1.m11 = sumXX + sumZZ;
    compMat1.m12 = -sumYZ;
    compMat1.m20 = -sumXZ;
    compMat1.m21 = -sumYZ;
    compMat1.m22 = sumXX + sumYY;

    compEigen1.calculateEigen(compMat1);
    this.direction = compEigen1.getEigenVector(0);

    // /*vars.release();*/
  }

  /**
   *
   * <code>random</code> determines a random point along the line.
   * @return a random point on the line.
   */
  public random(): Vector3;

  /**
   * <code>random</code> determines a random point along the line.
   *
   * @param result Vector to store result in
   * @return a random point on the line.
   */
  public random(result: Vector3): Vector3;
  public random(result: Vector3 = new Vector3()) {
    const rand: number = Math.random();

    result.x = (this.origin.x * (1 - rand)) + (this.direction.x * rand);
    result.y = (this.origin.y * (1 - rand)) + (this.direction.y * rand);
    result.z = (this.origin.z * (1 - rand)) + (this.direction.z * rand);

    return result;
  }

  public write(e: Exporter): void {
    const capsule: OutputCapsule = e.getCapsule(this);
    capsule.writeVector3(this.origin, "origin", Vector3.ZERO);
    capsule.writeVector3(this.direction, "direction", Vector3.ZERO);
  }

  public read(e: Importer): void {
    const capsule: InputCapsule = e.getCapsule(this);
    this.origin = capsule.readVector3("origin", Vector3.ZERO.clone());
    this.direction = capsule.readVector3("direction", Vector3.ZERO.clone());
  }

  public clone(): Line {
    return new Line(this.origin, this.direction)
  }
}
