/**
 * Interface for Collidable objects.
 * Classes that implement this interface are marked as collidable, meaning
 * they support collision detection between other objects that are also
 * collidable.
 */
import { CollisionResults } from './collision-results';

export interface Collidable {

  /**
   * Check collision with another Collidable.
   *
   * @param other The object to check collision against
   * @param results Will contain the list of {@link CollisionResult}s.
   * @return how many collisions were found between this and other
   */
  collideWith(other: Collidable, results: CollisionResults): number;
}
