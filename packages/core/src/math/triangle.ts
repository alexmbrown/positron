/**
 * <code>Triangle</code> defines an object for containing triangle information.
 * The triangle is defined by a collection of three {@link Vector3f}
 * objects.
 */
import { Cloneable } from '../util/cloneable';
import { Savable } from '../export/savable';
import { AbstractTriangle } from './abstract-triangle';
import { Vector3 } from './vector3';
import { FastMath } from './fast-math';
import { Exporter } from '../export/exporter';
import { Importer } from '../export/importer';

export class Triangle extends AbstractTriangle implements Savable, Cloneable<Triangle> {

  private pointa: Vector3 = new Vector3();
  private pointb: Vector3 = new Vector3();
  private pointc: Vector3 = new Vector3();

  private center: Vector3;
  private normal: Vector3;
  private projection: number;
  private index: number;

  /**
   * Instantiate a zero-size Triangle at the origin.
   */
  constructor();

  /**
   * Constructor instantiates a new <Code>Triangle</code> object with the
   * supplied vectors as the points. It is recommended that the vertices
   * be supplied in a counter clockwise winding to support normals for a
   * right handed coordinate system.
   * @param p1 the first point of the triangle.
   * @param p2 the second point of the triangle.
   * @param p3 the third point of the triangle.
   */
  constructor(p1: Vector3, p2: Vector3, p3: Vector3);
  constructor(p1?: Vector3, p2?: Vector3, p3?: Vector3) {
    super();
    this.pointa.copy(p1);
    this.pointb.copy(p2);
    this.pointc.copy(p3);
  }

  /**
   * <code>get</code> retrieves a point on the triangle denoted by the index
   * supplied.
   *
   * @param i the index of the point (0, 1, or 2)
   * @return a pre-existing location vector
   */
  public get(i: number): Vector3 {
    switch (i) {
      case 0:
        return this.pointa;
      case 1:
        return this.pointb;
      case 2:
        return this.pointc;
      default:
        return null;
    }
  }

  /**
   * Access the location of the 1st point (A).
   *
   * @return the pre-existing vector (not null)
   */
  public get1(): Vector3 {
    return this.pointa;
  }

  /**
   * Access the location of the 2nd point (B).
   *
   * @return the pre-existing vector (not null)
   */
  public get2(): Vector3 {
    return this.pointb;
  }

  /**
   * Access the location of the 3rd point (C).
   *
   * @return the pre-existing vector (not null)
   */
  public get3(): Vector3 {
    return this.pointc;
  }

  /**
   * <code>set</code> sets one of the triangle's points to that specified as a
   * parameter.
   *
   * @param i the index to place the point (0, 1, or 2)
   * @param point the desired location of the point (not null, unaffected)
   */
  public set(i: number, point: Vector3): void {
    delete this.center;
    delete this.normal;

    switch (i) {
      case 0:
        this.pointa.copy(point);
        break;
      case 1:
        this.pointb.copy(point);
        break;
      case 2:
        this.pointc.copy(point);
        break;
    }
  }

  /**
   * <code>set</code> alters the location of one of the triangle's points.
   *
   * @param i the index to place the point (0, 1, or 2)
   * @param x the desired X-component of the point's location
   * @param y the desired Y-component of the point's location
   * @param z the desired Z-component of the point's location
   */
  public setPoint(i: number, x: number, y: number, z: number): void {
    delete this.center;
    delete this.normal;

    switch (i) {
      case 0:
        this.pointa.set(x, y, z);
        break;
      case 1:
        this.pointb.set(x, y, z);
        break;
      case 2:
        this.pointc.set(x, y, z);
        break;
    }
  }

  /**
   * <code>set1</code> alters the location of the triangle's 1st point.
   *
   * @param v the desired location (not null, unaffected)
   */
  public set1(v: Vector3): void {
    delete this.center;
    delete this.normal;

    this.pointa.copy(v);
  }

  /**
   * <code>set2</code> alters the location of the triangle's 2nd point.
   *
   * @param v the desired location (not null, unaffected)
   */
  public set2(v: Vector3): void {
    delete this.center;
    delete this.normal;

    this.pointb.copy(v);
  }

  /**
   * <code>set3</code> alters the location of the triangle's 3rd point.
   *
   * @param v the desired location (not null, unaffected)
   */
  public set3(v: Vector3): void {
    delete this.center;
    delete this.normal;

    this.pointc.copy(v);
  }

  /**
   * <code>set</code> alters the locations of all 3 points.
   *
   * @param v1 the desired location of the 1st point (not null, unaffected)
   * @param v2 the desired location of the 2nd point (not null, unaffected)
   * @param v3 the desired location of the 3rd point (not null, unaffected)
   */
  public setPoints(v1: Vector3, v2: Vector3, v3: Vector3): void {
    delete this.center;
    delete this.normal;

    this.pointa.copy(v1);
    this.pointb.copy(v2);
    this.pointc.copy(v3);
  }

  /**
   * calculateCenter finds the average point of the triangle.
   *
   */
  public calculateCenter(): void {
    if (!this.center) {
      this.center = new Vector3(this.pointa);
    } else {
      this.center.copy(this.pointa);
    }
    this.center.addVecLocal(this.pointb).addVecLocal(this.pointc).multScalarLocal(FastMath.ONE_THIRD);
  }

  /**
   * calculateNormal generates the normal for this triangle
   *
   */
  public calculateNormal(): void {
    if (!this.normal) {
      this.normal = new Vector3(this.pointb);
    } else {
      this.normal.copy(this.pointb);
    }
    this.normal.subtractVecLocal(this.pointa).crossLocal(
      this.pointc.x - this.pointa.x,
      this.pointc.y - this.pointa.y,
      this.pointc.z - this.pointa.z
    );
    this.normal.normalizeLocal();
  }

  /**
   * obtains the center point of this triangle (average of the three triangles)
   * @return the center point.
   */
  public getCenter(): Vector3 {
    if (!this.center) {
      this.calculateCenter();
    }
    return this.center;
  }

  /**
   * sets the center point of this triangle (average of the three triangles)
   * @param center the center point.
   */
  public setCenter(center: Vector3): void {
    this.center = center;
  }

  /**
   * obtains the unit length normal vector of this triangle, if set or
   * calculated
   *
   * @return the normal vector
   */
  public getNormal(): Vector3 {
    if (!this.normal) {
      this.calculateNormal();
    }
    return this.normal;
  }

  /**
   * sets the normal vector of this triangle (to conform, must be unit length)
   * @param normal the normal vector.
   */
  public setNormal(normal: Vector3): void {
    this.normal = normal;
  }

  /**
   * obtains the projection of the vertices relative to the line origin.
   * @return the projection of the triangle.
   */
  public getProjection(): number {
    return this.projection;
  }

  /**
   * sets the projection of the vertices relative to the line origin.
   * @param projection the projection of the triangle.
   */
  public setProjection(projection: number): void {
    this.projection = projection;
  }

  /**
   * obtains an index that this triangle represents if it is contained in a OBBTree.
   * @return the index in an OBBtree
   */
  public getIndex(): number {
    return this.index;
  }

  /**
   * sets an index that this triangle represents if it is contained in a OBBTree.
   * @param index the index in an OBBtree
   */
  public setIndex(index: number): void {
    this.index = index;
  }

  public static computeTriangleNormal(v1: Vector3, v2: Vector3, v3: Vector3, store: Vector3): Vector3 {
    if (!store) {
      store = new Vector3(v2);
    } else {
      store.copy(v2);
    }

    store.subtractVecLocal(v1).crossLocal(v3.x - v1.x, v3.y - v1.y, v3.z - v1.z);
    return store.normalizeLocal();
  }

  public write(e: Exporter): void {
    e.getCapsule(this).writeVector3(this.pointa, "pointa", Vector3.ZERO);
    e.getCapsule(this).writeVector3(this.pointb, "pointb", Vector3.ZERO);
    e.getCapsule(this).writeVector3(this.pointc, "pointc", Vector3.ZERO);
  }

  public read(e: Importer): void {
    this.pointa = e.getCapsule(this).readVector3("pointa", Vector3.ZERO.clone());
    this.pointb = e.getCapsule(this).readVector3("pointb", Vector3.ZERO.clone());
    this.pointc = e.getCapsule(this).readVector3("pointc", Vector3.ZERO.clone());
  }

  public clone(): Triangle {
    return new Triangle(this.pointa, this.pointb, this.pointc);
  }
}
