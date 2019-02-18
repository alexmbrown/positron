import { Comparable } from '../util/comparable';
import { Vector3 } from '../math/vector3';
import { Geometry } from '../scene/geometry';
import { Mesh } from '../scene/mesh';
import { NumberUtils } from '../util/number-utils';

/**
 * A <code>CollisionResult</code> represents a single collision instance
 * between two {@link Collidable}. A collision check can result in many
 * collision instances (places where collision has occured).
 */
export class CollisionResult implements Comparable<CollisionResult> {

  private contactNormal: Vector3;

  constructor();
  constructor(contactPoint: Vector3, distance: number);
  constructor(contactPoint: Vector3, distance: number, geometry: Geometry, triangleIndex: number);
  constructor(
    private contactPoint?: Vector3,
    private distance?: number,
    private geometry?: Geometry,
    private triangleIndex?: number
  ) {}

  public setGeometry(geom: Geometry): void {
    this.geometry = geom;
  }

  public setContactNormal(norm: Vector3): void {
    this.contactNormal = norm;
  }

  public setContactPoint(point: Vector3): void {
    this.contactPoint = point;
  }

  public setDistance(dist: number): void {
    this.distance = dist;
  }

  public setTriangleIndex(index: number): void {
    this.triangleIndex = index;
  }

  public getTriangle(store: Triangle): Triangle {
    if (!store) {
      store = new Triangle();
    }

    const m: Mesh = geometry.getMesh();
    m.getTriangle(triangleIndex, store);
    store.calculateCenter();
    store.calculateNormal();
    return store;
  }

  public compareTo(other: CollisionResult): number {
    return NumberUtils.compare(this.distance, other.distance);
  }

  public equals(obj: any): boolean {
    if (obj === this) {
      return true;
    }

    if (obj instanceof CollisionResult){
      return (obj as CollisionResult).compareTo(this) == 0;
    }

    return false;
  }

  public hashCode(): number {
    return NumberUtils.floatToIntBits(this.distance);
  }

  public getContactPoint(): Vector3 {
    return this.contactPoint;
  }

  public getContactNormal(): Vector3 {
    return this.contactNormal;
  }

  public getDistance(): number {
    return this.distance;
  }

  public getGeometry(): Geometry {
    return this.geometry;
  }

  public getTriangleIndex(): number {
    return this.triangleIndex;
  }

  public toString(): string {
    return `CollisionResult[
        geometry=${this.geometry}
        contactPoint=${this.contactPoint}
        contactNormal=${this.contactNormal}
        distance=${this.distance}
        triangleIndex=${this.triangleIndex}
      ]`;
  }
}
