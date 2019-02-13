import { Collidable } from '../collision/collidable';
import { Vector3 } from './vector3';
import { CollisionResults } from '../collision/collision-results';

export abstract class AbstractTriangle implements Collidable {

  public abstract get1(): Vector3;
  public abstract get2(): Vector3;
  public abstract get3(): Vector3;
  public abstract setPoints(v1: Vector3, v2: Vector3, v3: Vector3): void;

  public collideWith(other: Collidable, results: CollisionResults): number {
    return other.collideWith(this, results);
  }

}
