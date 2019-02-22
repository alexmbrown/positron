import { Savable } from '../export/savable';
import { Cloneable } from '../util/cloneable';
import { Logger } from '../util/logger';
import { Vector3 } from './vector3';
import { PlaneSide } from './plane-side';
import { AbstractTriangle } from './abstract-triangle';
import { Exporter } from '../export/exporter';
import { Importer } from '../export/importer';
import { OutputCapsule } from '../export/output-capsule';
import { InputCapsule } from '../export/input-capsule';

export class Plane implements Savable, Cloneable<Plane> {

  private static logger: Logger = Logger.getLogger('Plane');

  /**
   * Vector normal to the plane.
   */
  protected normal: Vector3 = new Vector3();

  /**
   * Constant of the plane. See formula in class definition.
   */
  protected constant: number;

  /**
   * Constructor instantiates a new <code>Plane</code> object. This is the
   * default object and contains a normal of (0,0,0) and a constant of 0.
   */
  constructor();

  /**
   * Constructor instantiates a new <code>Plane</code> object. The normal
   * and constant values are set at creation.
   *
   * @param normal
   *            the normal of the plane.
   * @param constant
   *            the constant of the plane.
   */
  constructor(normal: Vector3, constant: number);

  /**
   * Constructor instantiates a new <code>Plane</code> object.
   *
   * @param normal      The normal of the plane.
   * @param displacement A vector representing a point on the plane.
   */
  constructor(normal: Vector3, displacement: Vector3);

  /**
   * Implementation
   */
  constructor(normal?: Vector3, arg2?: Vector3|number) {
    if (normal) {
      this.normal.copy(normal);
    }
    if (arg2 instanceof Vector3) {
      this.constant = arg2.dot(normal)
    } else if (typeof arg2 === 'number') {
      this.constant = arg2;
    }
  }

  /**
   * <code>setNormal</code> sets the normal of the plane.
   *
   * @param normal
   *            the new normal of the plane.
   */
  public setNormalVec(normal: Vector3): void {
    if (!normal) {
      throw new Error("normal cannot be null");
    }
    this.normal.copy(normal);
  }

  /**
   * <code>setNormal</code> sets the normal of the plane.
   *
   */
  public setNormal(x: number, y: number, z: number) {
    this.normal.set(x, y, z);
  }

  /**
   * <code>getNormal</code> retrieves the normal of the plane.
   *
   * @return the normal of the plane.
   */
  public getNormal(): Vector3 {
    return this.normal;
  }

  /**
   * <code>setConstant</code> sets the constant value that helps define the
   * plane.
   *
   * @param constant
   *            the new constant value.
   */
  public setConstant(constant: number): void {
    this.constant = constant;
  }

  /**
   * <code>getConstant</code> returns the constant of the plane.
   *
   * @return the constant of the plane.
   */
  public getConstant(): number {
    return this.constant;
  }

  public getClosestPoint(point: Vector3): Vector3;
  public getClosestPoint(point: Vector3, store?: Vector3): Vector3 {
    if (!store) {
      store = new Vector3();
    }
    const t: number = (this.constant - this.normal.dot(point)) / this.normal.dot(this.normal);
    return store.copy(this.normal).multScalarLocal(t).addVecLocal(point);
  }

  public reflect(point: Vector3, store: Vector3): Vector3 {
    if (!store) {
      store = new Vector3();
    }

    const d: number = this.pseudoDistance(point);
    store.copy(this.normal).negateLocal().multScalarLocal(d * 2);
    store.addVecLocal(point);
    return store;
  }

  /**
   * <code>pseudoDistance</code> calculates the distance from this plane to
   * a provided point. If the point is on the negative side of the plane the
   * distance returned is negative, otherwise it is positive. If the point is
   * on the plane, it is zero.
   *
   * @param point
   *            the point to check.
   * @return the signed distance from the plane to a point.
   */
  public pseudoDistance(point: Vector3): number {
    return this.normal.dot(point) - this.constant;
  }

  /**
   * <code>whichSide</code> returns the side at which a point lies on the
   * plane. The positive values returned are: NEGATIVE_SIDE, POSITIVE_SIDE and
   * NO_SIDE.
   *
   * @param point
   *            the point to check.
   * @return the side at which the point lies.
   */
  public whichSide(point: Vector3): PlaneSide {
    let dis: number = this.pseudoDistance(point);
    if (dis < 0) {
      return PlaneSide.Negative;
    } else if (dis > 0) {
      return PlaneSide.Positive;
    } else {
      return PlaneSide.None;
    }
  }

  public isOnPlane(point: Vector3): boolean {
    let dist: number = this.pseudoDistance(point);
    return dist < Number.EPSILON && dist > -Number.EPSILON;
  }

  /**
   * Initialize this plane using the three points of the given triangle.
   *
   * @param t
   *            the triangle
   */
  public fromTriangle(t: AbstractTriangle): void {
    this.fromPoints(t.get1(), t.get2(), t.get3());
  }

  /**
   * Initialize this plane using a point of origin and a normal.
   *
   * @param origin
   * @param normal
   */
  public fromOriginNormal(origin: Vector3, normal: Vector3): void {
    this.normal.copy(normal);
    this.constant = normal.x * origin.x + normal.y * origin.y + normal.z * origin.z;
  }

  /**
   * Initialize the Plane using the given 3 points as coplanar.
   *
   * @param v1
   *            the first point
   * @param v2
   *            the second point
   * @param v3
   *            the third point
   */
  public fromPoints(v1: Vector3, v2: Vector3, v3: Vector3): void {
    this.normal.copy(v2).subtractVecLocal(v1);
    this.normal.crossLocal(v3.x - v1.x, v3.y - v1.y, v3.z - v1.z)
      .normalizeLocal();
    this.constant = this.normal.dot(v1);
  }

  /**
   * <code>toString</code> returns a string thta represents the string
   * representation of this plane. It represents the normal as a
   * <code>Vector3f</code> object, so the format is the following:
   * com.jme.math.Plane [Normal: org.jme.math.Vector3f [X=XX.XXXX, Y=YY.YYYY,
   * Z=ZZ.ZZZZ] - Constant: CC.CCCCC]
   *
   * @return the string representation of this plane.
   */
  public toString(): string {
    return `Plane [Normal: ${this.normal.toString()} - Constant: ${this.constant.toString()} ]`
  }

  public write(e: Exporter): void {
    const capsule: OutputCapsule = e.getCapsule(this);
    capsule.writeVec3(this.normal, "normal", Vector3.ZERO);
    capsule.writeNumber(this.constant, "constant", 0);
  }

  public read(e: Importer): void {
    const capsule: InputCapsule = e.getCapsule(this);
    this.normal = capsule.readVec3("normal", Vector3.ZERO.clone());
    this.constant = capsule.readNumber("constant", 0);
  }

  public clone(): Plane {
    return new Plane(this.normal, this.constant);
  }
}
