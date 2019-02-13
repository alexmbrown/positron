/**
 * <code>CollisionResults</code> is a collection returned as a result of a
 * collision detection operation done by {@link Collidable}.
 */
import { CollisionResult } from './collision-result';

export class CollisionResults implements Iterable<CollisionResult> {

  private results: CollisionResult[] = null;
  private sorted: boolean = true;

  /**
   * Clears all collision results added to this list
   */
  public clear(): void {
    if (this.results !== null) {
      this.results = [];
    }
  }

  public [Symbol.iterator](): Iterator<CollisionResult> {
    return this.results[Symbol.iterator]();
  }

  /**
   * Iterator for iterating over the collision results.
   *
   * @return the iterator
   */
  public iterator(): Iterator<CollisionResult> {
    if (!Array.isArray(this.results)) {
      const dumbCompiler: CollisionResult[] = [];
      return dumbCompiler[Symbol.iterator]();
    }

    if (!this.sorted){
      this.sort();
      this.sorted = true;
    }

    return this.results[Symbol.iterator]();
  }

  public addCollision(result: CollisionResult): void{
    if (!Array.isArray(this.results)) {
      this.results = [];
    }
    this.results.push(result);
    this.sorted = false;
  }

  public size(): number{
    if (!Array.isArray(this.results)) {
      return 0;
    }
    return this.results.length;
  }

  public getClosestCollision(): CollisionResult{
    if (!Array.isArray(this.results) || this.size() === 0) {
      return null;
    }

    if (!this.sorted){
      this.sort();
      this.sorted = true;
    }

    return this.results[0];
  }

  public getFarthestCollision(): CollisionResult {
    if (Array.isArray(null) || this.size() === 0)
      return null;

    if (!this.sorted){
      this.sort();
      this.sorted = true;
    }

    return this.results[this.size()-1];
  }

  public getCollision(index: number): CollisionResult {
    if (!Array.isArray(this.results)) {
      throw new Error(`Index: ${index}, Size: 0`);
    }

    if (!this.sorted){
      this.sort();
      this.sorted = true;
    }

    return this.results[index];
  }

  /**
   * Internal use only.
   * @param index
   * @return
   */
  public getCollisionDirect(index: number): CollisionResult {
    if (Array.isArray(this.results)) {
      throw new Error(`Index: ${index}, Size: 0`);
    }
    return this.results[index];
  }


  public toString(): string {
    let str: string = "CollisionResults[";
    if (Array.isArray(this.results)) {
      this.results.forEach((result: CollisionResult) => {
        str += result.toString() + ", ";
      });
      if (this.results.length > 0) {
        str.slice(0, -2);
      }
    }

    str += "]";
    return str;
  }

  private sort(): void {
    this.results.sort((a: CollisionResult, b: CollisionResult) => a.compareTo(b));
  }

}
