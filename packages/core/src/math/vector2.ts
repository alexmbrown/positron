import { Cloneable } from '../util/cloneable';
import { OutputCapsule } from '../export/output-capsule';
import { Logger } from '../util/logger';
import { InputCapsule } from '../export/input-capsule';
import { Savable } from '../export/savable';
import { isNumber, isNumberArray } from '../util/type-utils';
import { Vector3 } from './vector3';
import { NumberUtils } from '../util/number-utils';
import { Exporter } from '../export/exporter';
import { Importer } from '../export/importer';

/**
 * <code>Vector2</code> defines a Vector for a two value : number vector.
 */
export class Vector2 implements Savable, Cloneable<Vector2> {

  private static logger: Logger = Logger.getLogger('Vector2');

  public static ZERO: Vector2 = new Vector2(0, 0);
  public static UNIT_XY: Vector2 = new Vector2(1, 1);

  /**
   * the x value of the vector.
   */
  public x: number;
  /**
   * the y value of the vector.
   */
  public y: number;

  /**
   * Creates a Vector2 with x and y set to 0. Equivalent to Vector2(0,0).
   */
  constructor();

  /**
   * Creates a Vector2 with the given initial x and y values.
   *
   * @param x
   *            The x value of this Vector2.
   * @param y
   *            The y value of this Vector2.
   */
  constructor(x: number, y: number);

  /**
   * Creates a new Vector2 that contains the passed vector's information
   *
   * @param copy
   *            The vector to copy
   */
  constructor(copy: Vector2);

  /**
   * Implementation
   */
  constructor(arg1?: number|Vector2, y?: number) {
    if (arg1 instanceof Vector2) {
      this.copy(arg1);
    } else if (isNumber(arg1) && isNumber(y)) {
      this.x = arg1;
      this.y = y;
    } else {
      this.x = this.y = 0;
    }
  }

  /**
   * set the x and y values of the vector
   *
   * @param x
   *            the x value of the vector.
   * @param y
   *            the y value of the vector.
   * @return this vector
   */
  public set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * set the x and y values of the vector from another vector
   *
   * @param vec
   *            the vector to copy from
   * @return this vector
   */
  public copy(vec: Vector2) {
    this.x = vec.x;
    this.y = vec.y;
    return this;
  }

  /**
   * <code>add</code> adds a provided vector to this vector creating a
   * resultant vector which is returned. If the provided vector is null, null
   * is returned.
   *
   * @param vec
   *            the vector to add to this.
   * @return the resultant vector.
   */
  public addVec(vec: Vector2): Vector2 {
    if (!vec) {
      Vector2.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    return new Vector2(this.x + vec.x, this.y + vec.y);
  }

  /**
   * <code>addLocal</code> adds a provided vector to this vector internally,
   * and returns a handle to this vector for easy chaining of calls. If the
   * provided vector is null, null is returned.
   *
   * @param vec
   *            the vector to add to this vector.
   * @return this
   */
  public addVecLocal(vec: Vector2): Vector2 {
    if (!vec) {
      Vector2.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  /**
   * <code>addLocal</code> adds the provided values to this vector
   * internally, and returns a handle to this vector for easy chaining of
   * calls.
   *
   * @param addX
   *            value to add to x
   * @param addY
   *            value to add to y
   * @return this
   */
  public addLocal(addX: number, addY: number): Vector2 {
    this.x += addX;
    this.y += addY;
    return this;
  }

  /**
   * <code>add</code> adds this vector by <code>vec</code> and stores the
   * result in <code>result</code>.
   *
   * @param vec
   *            The vector to add.
   * @param result
   *            The vector to store the result in.
   * @return The result vector, after adding.
   */
  public add(vec: Vector2): Vector2;
  public add(vec: Vector2, result: Vector2): Vector2;
  public add(vec: Vector2, result?: Vector2): Vector2 {
    if (null == vec) {
      Vector2.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    if (!result) {
      result = new Vector2();
    }
    result.x = this.x + vec.x;
    result.y = this.y + vec.y;
    return result;
  }

  /**
   * <code>dot</code> calculates the dot product of this vector with a
   * provided vector. If the provided vector is null, 0 is returned.
   *
   * @param vec
   *            the vector to dot with this vector.
   * @return the resultant dot product of this vector and a given vector.
   */
  public dot(vec: Vector2): number {
    if (!vec) {
      Vector2.logger.warning("Provided vector is null, 0 returned.");
      return 0;
    }
    return this.x * vec.x + this.y * vec.y;
  }

  /**
   * <code>cross</code> calculates the cross product of this vector with a
   * parameter vector v.
   *
   * @param vec
   *            the vector to take the cross product of with this.
   * @return the cross product vector.
   */
  public cross(vec: Vector2): Vector3 {
    return new Vector3(0, 0, this.determinant(vec));
  }

  public determinant(vec: Vector2): number {
    return (this.x * vec.y) - (this.y * vec.x);
  }

  /**
   * Sets this vector to the interpolation by changeAmnt from this to the
   * finalVec this=(1-changeAmnt)*this + changeAmnt * finalVec
   *
   * @param finalVec
   *            The final vector to interpolate towards
   * @param changeAmt
   *            An amount between 0.0 - 1.0 representing a percentage change
   *            from this towards finalVec
   */
  public interpolateLocal(changeAmt: number, finalVec: Vector2): Vector2;

  /**
   * Sets this vector to the interpolation by changeAmnt from beginVec to
   * finalVec this=(1-changeAmnt)*beginVec + changeAmnt * finalVec
   *
   * @param beginVec
   *            The beginning vector (delta=0)
   * @param finalVec
   *            The final vector to interpolate towards (delta=1)
   * @param changeAmt
   *            An amount between 0.0 - 1.0 representing a percentage change
   *            from beginVec towards finalVec
   */
  public interpolateLocal(changeAmt: number, finalVec: Vector2, beginVec: Vector2 = Vector2.UNIT_XY): Vector2 {
    this.x = (1 - changeAmt) * beginVec.x + changeAmt * finalVec.x;
    this.y = (1 - changeAmt) * beginVec.y + changeAmt * finalVec.y;
    return this;
  }

  /**
   * Check a vector... if it is null or its  are : number NaN or infinite, return
   * false. Else return true.
   *
   * @param vec
   *            the vector to check
   * @return true or false as stated above.
   */
  public static isValidVector(vec: Vector2): boolean {
    if (!vec) {
      return false;
    }
    if (Number.isNaN(vec.x) || Number.isNaN(vec.y)) {
      return false;
    }
    return Number.isFinite(vec.x) && Number.isFinite(vec.y);
  }

  /**
   * <code>length</code> calculates the magnitude of this vector.
   *
   * @return the length or magnitude of the vector.
   */
  public length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  /**
   * <code>lengthSquared</code> calculates the squared value of the
   * magnitude of the vector.
   *
   * @return the magnitude squared of the vector.
   */
  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * <code>distanceSquared</code> calculates the distance squared between
   * this vector and vector v.
   *
   * @param v the second vector to determine the distance squared.
   * @return the distance squared between the two vectors.
   */
  public distanceSquaredVec(v: Vector2): number {
    const dx: number = this.x - v.x;
    const dy: number = this.y - v.y;
    return dx * dx + dy * dy;
  }

  /**
   * <code>distanceSquared</code> calculates the distance squared between
   * this vector and vector v.
   *
   * @param otherX The X coordinate of the v vector
   * @param otherY The Y coordinate of the v vector
   * @return the distance squared between the two vectors.
   */
  public distanceSquared(otherX: number, otherY: number): number {
    const dx: number = this.x - otherX;
    const dy: number = this.y - otherY;
    return dx * dx + dy * dy;
  }

  /**
   * <code>distance</code> calculates the distance between this vector and
   * vector vec.
   *
   * @param vec the second vector to determine the distance.
   * @return the distance between the two vectors.
   */
  public distanceVec(vec: Vector2): number {
    return Math.sqrt(this.distanceSquaredVec(vec));
  }

  /**
   * <code>mult</code> multiplies this vector by a scalar. The resultant
   * vector is returned.
   *
   * @param scalar
   *            the value to multiply this vector by.
   * @return the new vector.
   */
  public multScalar(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * <code>multLocal</code> multiplies this vector by a scalar internally,
   * and returns a handle to this vector for easy chaining of calls.
   *
   * @param scalar
   *            the value to multiply this vector by.
   * @return this
   */
  public multScalarLocal(scalar: number): Vector2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * <code>multLocal</code> multiplies a provided vector by this vector
   * internally, and returns a handle to this vector for easy chaining of
   * calls. If the provided vector is null, null is returned.
   *
   * @param vec
   *            the vector to mult to this vector.
   * @return this
   */
  public multVecLocal(vec: Vector2): Vector2 {
    if (!vec) {
      Vector2.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    this.x *= vec.x;
    this.y *= vec.y;
    return this;
  }

  /**
   * Multiplies this Vector2's x and y by the scalar and stores the result in
   * product. The result is returned for chaining. Similar to
   * product=this*scalar;
   *
   * @param scalar
   *            The scalar to multiply by.
   * @param product
   *            The vector2f to store the result in.
   * @return product, after multiplication.
   */
  public multVec(scalar: number): Vector2;
  public multVec(scalar: number, product: Vector2): Vector2;
  public multVec(scalar: number, product?: Vector2): Vector2 {
    if (!product) {
      product = new Vector2();
    }
    product.x = this.x * scalar;
    product.y = this.y * scalar;
    return product;
  }

  /**
   * <code>divide</code> divides the values of this vector by a scalar and
   * returns the result. The values of this vector remain untouched.
   *
   * @param scalar
   *            the value to divide this vectors attributes by.
   * @return the result <code>Vector</code>.
   */
  public divideScalar(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  /**
   * <code>divideLocal</code> divides this vector by a scalar internally,
   * and returns a handle to this vector for easy chaining of calls. Dividing
   * by zero will result in an exception.
   *
   * @param scalar
   *            the value to divides this vector by.
   * @return this
   */
  public divideScalarLocal(scalar: number ): Vector2 {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * <code>negate</code> returns the negative of this vector. All values are
   * negated and set to a new vector.
   *
   * @return the negated vector.
   */
  public negate(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  /**
   * <code>negateLocal</code> negates the internal values of this vector.
   *
   * @return this.this.
   */
  public negateLocal(): Vector2 {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  /**
   * <code>subtract</code> subtracts the values of a given vector from those
   * of this vector creating a new vector object. If the provided vector is
   * null, an exception is thrown.
   *
   * @param vec
   *            the vector to subtract from this vector.
   * @return the result vector.
   */
  public subtractVec(vec: Vector2): Vector2;


  /**
   * <code>subtract</code> subtracts the values of a given vector from those
   * of this vector storing the result in the given vector object. If the
   * provided vector is null, an exception is thrown.
   *
   * @param vec
   *            the vector to subtract from this vector.
   * @param store
   *            the vector to store the result in. It is safe for this to be
   *            the same as vec. If null, a new vector is created.
   * @return the result vector.
   */
  public subtractVec(vec: Vector2, store: Vector2): Vector2;

  /**
   * Implementation
   */
  public subtractVec(vec: Vector2, store?: Vector2): Vector2 {
    if (!store) {
      store = new Vector2();
    }
    store.x = this.x - vec.x;
    store.y = this.y - vec.y;
    return store;
  }

  /**
   * <code>subtract</code> subtracts the given x,y values from those of this
   * vector creating a new vector object.
   *
   * @param valX
   *            value to subtract from x
   * @param valY
   *            value to subtract from y
   * @return this
   */
  public subtract(valX: number , valY: number): Vector2 {
    return new Vector2(this.x - valX, this.y - valY);
  }

  /**
   * <code>subtractLocal</code> subtracts a provided vector to this vector
   * internally, and returns a handle to this vector for easy chaining of
   * calls. If the provided vector is null, null is returned.
   *
   * @param vec
   *            the vector to subtract
   * @return this
   */
  public subtractVecLocal(vec: Vector2): Vector2 {
    if (!vec) {
      Vector2.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  /**
   * <code>subtractLocal</code> subtracts the provided values from this
   * vector internally, and returns a handle to this vector for easy chaining
   * of calls.
   *
   * @param valX
   *            value to subtract from x
   * @param valY
   *            value to subtract from y
   * @return this
   */
  public subtractLocal(valX: number, valY: number): Vector2 {
    this.x -= valX;
    this.y -= valY;
    return this;
  }

  /**
   * <code>normalize</code> returns the unit vector of this vector.
   *
   * @return unit vector of this vector.
   */
  public normalize(): Vector2 {
    const length: number = this.length();
    if (length !== 0) {
      return this.divideScalar(length);
    }

    return this.divideScalar(1);
  }

  /**
   * <code>normalizeLocal</code> makes this vector into a unit vector of
   * itself.
   *
   * @return this.
   */
  public normalizeLocal(): Vector2 {
    const length: number = this.length();
    if (length !== 0) {
      return this.divideScalarLocal(length);
    }

    return this.divideScalarLocal(1);
  }

  /**
   * <code>smallestAngleBetween</code> returns (in radians) the minimum
   * angle between two vectors. It is assumed that both this vector and the
   * given vector are unit vectors (iow, normalized).
   *
   * @param otherVector
   *            a unit vector to find the angle against
   * @return the angle in radians.
   */
  public smallestAngleBetween(otherVector: Vector2): number {
    const dotProduct: number = this.dot(otherVector);
    return Math.acos(dotProduct);
  }

  /**
   * <code>angleBetween</code> returns (in radians) the angle required to
   * rotate a ray represented by this vector to be colinear with a ray
   * described by the given vector. It is assumed that both this vector and
   * the given vector are unit vectors (iow, normalized).
   *
   * @param vec
   *            the "destination" unit vector
   * @return the angle in radians.
   */
  public angleBetween(vec: Vector2): number {
    return Math.atan2(vec.y, vec.x) - Math.atan2(this.y, this.x);
  }

  public getX(): number {
    return this.x;
  }

  public setX(x: number): Vector2 {
    this.x = x;
    return this;
  }

  public getY(): number {
    return this.y;
  }

  public setY(y: number): Vector2 {
    this.y = y;
    return this;
  }
  /**
   * <code>getAngle</code> returns (in radians) the angle represented by
   * this Vector2 as expressed by a conversion from rectangular coordinates (<code>x</code>,&nbsp;<code>y</code>)
   * to polar coordinates (r,&nbsp;<i>theta</i>).
   *
   * @return the angle in radians. [-pi, pi)
   */
  public getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * <code>zero</code> resets this vector's data to zero internally.
   */
  public zero(): Vector2 {
    this.x = this.y = 0;
    return this;
  }

  /**
   * <code>hashCode</code> returns a unique code for this vector object
   * based on its values. If two vectors are logically equivalent, they will
   * return the same hash code value.
   *
   * @return the hash code value of this vector.
   */
  public hashCode(): number {
    let hash: number = 37;
    hash += 37 * hash + NumberUtils.floatToIntBits(this.x);
    hash += 37 * hash + NumberUtils.floatToIntBits(this.y);
    return hash;
  }

  public clone(): Vector2 {
    return new Vector2(this);
  }

  /**
   * Saves this Vector2 into the given ] : number object.
   *
   * @param
   : number *            The  to : number take this Vector2. If null, a new 2] : number is
   *            created.
   * @return The array, with X, Y values : number in that order
   */
  public toArray(vec: number[]): number[] {
    if (!isNumberArray(vec)) {
      vec = [];
    }
    vec[0] = this.x;
    vec[1] = this.y;
    return vec;
  }

  /**
   * are these two vectors the same? they are is they both have the same x and
   * y values.
   *
   * @param o
   *            the object to compare for equality
   * @return true if they are equal
   */
  public equals(o: any): boolean {
    if (!(o instanceof Vector2)) {
      return false;
    }

    if (this === o) {
      return true;
    }

    const comp: Vector2 = o as Vector2;
    if (NumberUtils.compare(this.x,comp.x) !== 0) {
      return false;
    }
    return NumberUtils.compare(this.y,comp.y) === 0;
  }

  /**
   * Returns true if this vector is similar to the specified vector within
   * some value of epsilon.
   */
  public isSimilar(other: Vector2, epsilon: number): boolean {
    if (!other) {
      return false;
    }
    if (NumberUtils.compare(Math.abs(other.x - this.x), epsilon) > 0) {
      return false;
    }
    return NumberUtils.compare(Math.abs(other.y - this.y), epsilon) <= 0;
  }

  /**
   * <code>toString</code> returns the string representation of this vector
   * object. The format of the string is such: com.jme.math.Vector2
   * [X=XX.XXXX, Y=YY.YYYY]
   *
   * @return the string representation of this vector.
   */
  public toString(): string {
    return `Vector2 (${this.x}, ${this.y})`;
  }

  public write(e: Exporter): void {
    const capsule: OutputCapsule = e.getCapsule(this);
    capsule.writeNumber(this.x, "x", 0);
    capsule.writeNumber(this.y, "y", 0);
  }

  public read(e: Importer): void {
    const capsule: InputCapsule = e.getCapsule(this);
    this.x = capsule.readNumber("x", 0);
    this.y = capsule.readNumber("y", 0);
  }

  public rotateAroundOrigin(angle: number, cw: boolean): void {
    if (cw) {
      angle = -angle;
    }
    const newX: number = Math.cos(angle) * this.x - Math.sin(angle) * this.y;
    const newY: number = Math.sin(angle) * this.x + Math.cos(angle) * this.y;
    this.x = newX;
    this.y = newY;
  }
}
