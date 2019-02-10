import { Savable } from '../export/savable';
import { Cloneable } from '../util/cloneable';
import { Logger } from '../util/logger';
import { isNumber, isNumberArray } from '../util/type-utils';
import { NumberUtils } from '../util/number-utils';
import { Exporter } from '../export/exporter';
import { OutputCapsule } from '../export/output-capsule';
import { InputCapsule } from '../export/input-capsule';
import { Importer } from '../export/importer';

export class Vector4 implements Savable, Cloneable<Vector4> {

  private static logger: Logger = Logger.getLogger('Vector4');

  public static ZERO: Vector4 = new Vector4(0, 0, 0, 0);
  public static NAN: Vector4 = new Vector4(Number.NaN, Number.NaN, Number.NaN, Number.NaN);
  public static UNIT_X: Vector4 = new Vector4(1, 0, 0, 0);
  public static UNIT_Y: Vector4 = new Vector4(0, 1, 0, 0);
  public static UNIT_Z: Vector4 = new Vector4(0, 0, 1, 0);
  public static UNIT_W: Vector4 = new Vector4(0, 0, 0, 1);
  public static UNIT_XYZW: Vector4 = new Vector4(1, 1, 1, 1);
  public static POSITIVE_INFINITY: Vector4 = new Vector4(
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    Number.MAX_VALUE);
  public static NEGATIVE_INFINITY: Vector4 = new Vector4(
    Number.MIN_VALUE,
    Number.MIN_VALUE,
    Number.MIN_VALUE,
    Number.MIN_VALUE);

  /**
   * the x value of the vector.
   */
  public x: number;

  /**
   * the y value of the vector.
   */
  public y: number;

  /**
   * the z value of the vector.
   */
  public z: number;

  /**
   * the w value of the vector.
   */
  public w: number;

  /**
   * Constructor instantiates a new <code>Vector4f</code> with default
   * values of (0,0,0, 0).
   *
   */
  constructor();

  /**
   * Constructor instantiates a new <code>Vector4f</code> with provides
   * values.
   *
   * @param x
   *            the x value of the vector.
   * @param y
   *            the y value of the vector.
   * @param z
   *            the z value of the vector.
   * @param w
   *            the w value of the vector.
   */
  constructor(x: number, y: number, z: number, w: number);

  /**
   * Constructor instantiates a new <code>Vector3f</code> that is a copy
   * of the provided vector
   * @param copy The Vector3f to copy
   */
  constructor(copy: Vector4);

  /**
   * Implementation
   */
  constructor(arg1?: number|Vector4, y?: number, z?: number, w?: number) {
    if (arg1 instanceof Vector4) {
      this.copy(arg1);
    } else if (isNumber(arg1) && isNumber(y) && isNumber(z) && isNumber(w)) {
      this.x = arg1;
      this.y = y;
      this.z = z;
      this.w = w;
    } else {
      this.x = this.y = this.z = this.w = 0;
    }
  }

  /**
   * <code>set</code> sets the x,y,z,w values of the vector based on passed
   * parameters.
   *
   * @param x
   *            the x value of the vector.
   * @param y
   *            the y value of the vector.
   * @param z
   *            the z value of the vector.
   * @param w
   *            the w value of the vector.
   * @return this vector
   */
  public set(x: number, y: number, z: number, w: number): Vector4 {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  /**
   * <code>copy</code> sets the x,y,z values of the vector by copying the
   * supplied vector.
   *
   * @param vec
   *            the vector to copy.
   * @return this vector
   */
  public copy(vec: Vector4): Vector4 {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    this.w = vec.w;
    return this;
  }

  /**
   *
   * <code>add</code> adds a provided vector to this vector creating a
   * resultant vector which is returned. If the provided vector is null, null
   * is returned.
   *
   * @param vec
   *            the vector to add to this.
   * @return the resultant vector.
   */
  public addVec(vec: Vector4): Vector4;
  /**
   *
   * <code>add</code> adds the values of a provided vector storing the
   * values in the supplied vector.
   *
   * @param vec
   *            the vector to add to this
   * @param result
   *            the vector to store the result in
   * @return result returns the supplied result vector.
   */
  public addVec(vec: Vector4, result: Vector4): Vector4;

  /**
   * Implementation
   */
  public addVec(vec: Vector4, result?: Vector4): Vector4 {
    if (!vec) {
      Vector4.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    if (!result) {
      return new Vector4(this.x + vec.x, this.y + vec.y, this.z + vec.z, this.w + vec.w);
    }
    result.x = this.x + vec.x;
    result.y = this.y + vec.y;
    result.z = this.z + vec.z;
    result.w = this.w + vec.w;
    return result;
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
  public addVecLocal(vec: Vector4): Vector4 {
    if (!vec) {
      Vector4.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    this.x += vec.x;
    this.y += vec.y;
    this.z += vec.z;
    this.w += vec.w;
    return this;
  }

  /**
   *
   * <code>add</code> adds the provided values to this vector, creating a
   * new vector that is then returned.
   *
   * @param addX
   *            the x value to add.
   * @param addY
   *            the y value to add.
   * @param addZ
   *            the z value to add.
   * @return the result vector.
   */
  public add(addX: number, addY: number, addZ: number, addW: number): Vector4 {
    return new Vector4(this.x + addX, this.y + addY, this.z + addZ, this.w + addW);
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
   * @param addZ
   *            value to add to z
   * @return this
   */
  public addLocal(addX: number, addY: number, addZ: number, addW: number): Vector4 {
    this.x += addX;
    this.y += addY;
    this.z += addZ;
    this.w += addW;
    return this;
  }

  /**
   *
   * <code>scaleAdd</code> multiplies this vector by a scalar then adds the
   * given Vector3f.
   *
   * @param scalar
   *            the value to multiply this vector by.
   * @param add
   *            the value to add
   */
  public scaleAdd(scalar: number, add: Vector4): Vector4 {
    this.x = this.x * scalar + add.x;
    this.y = this.y * scalar + add.y;
    this.z = this.z * scalar + add.z;
    this.w = this.w * scalar + add.w;
    return this;
  }

  /**
   *
   * <code>scaleAdd</code> multiplies the given vector by a scalar then adds
   * the given vector.
   *
   * @param scalar
   *            the value to multiply this vector by.
   * @param mult
   *            the value to multiply the scalar by
   * @param add
   *            the value to add
   */
  public scaleVecAdd(scalar: number, mult: Vector4, add: Vector4): Vector4 {
    this.x = mult.x * scalar + add.x;
    this.y = mult.y * scalar + add.y;
    this.z = mult.z * scalar + add.z;
    this.w = mult.w * scalar + add.w;
    return this;
  }

  /**
   *
   * <code>dot</code> calculates the dot product of this vector with a
   * provided vector. If the provided vector is null, 0 is returned.
   *
   * @param vec
   *            the vector to dot with this vector.
   * @return the resultant dot product of this vector and a given vector.
   */
  public dot(vec: Vector4): number {
    if (!vec) {
      Vector4.logger.warning("Provided vector is null, 0 returned.");
      return 0;
    }
    return this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w;
  }

  public project(other: Vector4): Vector4 {
    const n: number = this.dot(other); // A . B
    const d: number = other.lengthSquared(); // |B|^2
    return new Vector4(other).multScalarLocal(n/d);
  }

  /**
   * Returns true if this vector is a unit vector (length() ~= 1),
   * returns false otherwise.this.
   *
   * @return true if this vector is a unit vector (length() ~= 1),
   * or false otherwise.
   */
  public isUnitVector(): boolean {
    const len: number = this.length();
    return 0.99 < len && len < 1.01;
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
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  /**
   * <code>distanceSquared</code> calculates the distance squared between
   * this vector and vector v.
   *
   * @param v the second vector to determine the distance squared.
   * @return the distance squared between the two vectors.
   */
  public distanceSquared(v: Vector4): number {
    const dx: number = this.x - v.x;
    const dy: number = this.y - v.y;
    const dz: number = this.z - v.z;
    const dw: number = this.w - v.w;
    return dx * dx + dy * dy + dz * dz + dw * dw;
  }

  /**
   * <code>distance</code> calculates the distance between this vector and
   * vector v.
   *
   * @param v the second vector to determine the distance.
   * @return the distance between the two vectors.
   */
  public distance(v: Vector4): number {
    return Math.sqrt(this.distanceSquared(v));
  }

  /**
   *
   * <code>mult</code> multiplies this vector by a scalar. The resultant
   * vector is returned.
   *
   * @param scalar
   *            the value to multiply this vector by.
   * @return the new vector.
   */
  public multScalar(scalar: number): Vector4;
  /**
   *
   * <code>mult</code> multiplies this vector by a scalar. The resultant
   * vector is supplied as the second parameter and returned.
   *
   * @param scalar the scalar to multiply this vector by.
   * @param product the product to store the result in.
   * @return product
   */
  public multScalar(scalar: number, product: Vector4): Vector4;

  /**
   * Implementationthis.
   */
  public multScalar(scalar: number, product?: Vector4): Vector4 {
    if (!product) {
      return new Vector4(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
    }
    product.x = this.x * scalar;
    product.y = this.y * scalar;
    product.z = this.z * scalar;
    product.w = this.w * scalar;
    return product;
  }

  /**
   * <code>multLocal</code> multiplies this vector by a scalar internally,
   * and returns a handle to this vector for easy chaining of calls.
   *
   * @param scalar
   *            the value to multiply this vector by.
   * @return this
   */
  public multScalarLocal(scalar: number): Vector4 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }

  /**
   * <code>multLocal</code> multiplies a provided vector to this vector
   * internally, and returns a handle to this vector for easy chaining of
   * calls. If the provided vector is null, null is returned.
   *
   * @param vec
   *            the vector to mult to this vector.
   * @return this
   */
  public multVecLocal(vec: Vector4): Vector4 {
    if (!vec) {
      Vector4.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    this.x *= vec.x;
    this.y *= vec.y;
    this.z *= vec.z;
    this.w *= vec.w;
    return this;
  }

  /**
   * <code>multLocal</code> multiplies this vector by 3 scalars
   * internally, and returns a handle to this vector for easy chaining of
   * calls.
   *
   * @param x
   * @param y
   * @param z
   * @param w
   * @return this
   */
  public multLocal(x: number, y: number, z: number, w: number): Vector4 {
    this.x *= x;
    this.y *= y;
    this.z *= z;
    this.w *= w;
    return this;
  }

  /**
   * <code>multLocal</code> multiplies a provided vector to this vector
   * internally, and returns a handle to this vector for easy chaining of
   * calls. If the provided vector is null, null is returned.
   *
   * @param vec
   *            the vector to mult to this vector.
   * @return this
   */
  public multVec(vec: Vector4): Vector4;

  /**
   * <code>multLocal</code> multiplies a provided vector to this vector
   * internally, and returns a handle to this vector for easy chaining of
   * calls. If the provided vector is null, null is returned.
   *
   * @param vec
   *            the vector to mult to this vector.
   * @param store result vector (null to create a new vector)
   * @return this
   */
  public multVec(vec: Vector4, store: Vector4): Vector4;

  /**
   * Implementation
   */
  public multVec(vec: Vector4, store?: Vector4): Vector4 {
    if (!vec) {
      Vector4.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    if (!store) {
      store = new Vector4();
    }
    return store.set(this.x * vec.x, this.y * vec.y, this.z * vec.z, this.w * vec.w);
  }

  /**
   * <code>divide</code> divides the values of this vector by a scalar and
   * returns the result. The values of this vector remain untouched.
   *
   * @param scalar
   *            the value to divide this vectors attributes by.
   * @return the result <code>Vector</code>.
   */
  public divideScalar(scalar: number): Vector4 {
    scalar = 1.0/scalar;
    return new Vector4(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
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
  public divideLocal(scalar: number): Vector4 {
    scalar = 1.0/scalar;
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }

  /**
   * <code>divide</code> divides the values of this vector by a scalar and
   * returns the result. The values of this vector remain untouched.
   *
   * @param scalar
   *            the value to divide this vectors attributes by.
   * @return the result <code>Vector</code>.
   */
  public divideVec(scalar: Vector4): Vector4 {
    return new Vector4(this.x / scalar.x, this.y / scalar.y, this.z / scalar.z, this.w / scalar.w);
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
  public divideVecLocal(scalar: Vector4): Vector4 {
    this.x /= scalar.x;
    this.y /= scalar.y;
    this.z /= scalar.z;
    this.w /= scalar.w;
    return this;
  }

  /**
   *
   * <code>negate</code> returns the negative of this vector. All values are
   * negated and set to a new vector.
   *
   * @return the negated vector.
   */
  public negate(): Vector4 {
    return new Vector4(-this.x, -this.y, -this.z, -this.w);
  }

  /**
   *
   * <code>negateLocal</code> negates the internal values of this vector.
   *
   * @return this.
   */
  public negateLocal(): Vector4 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    this.w = -this.w;
    return this;
  }

  /**
   *
   * <code>subtractVec</code> subtracts the values of a given vector from those
   * of this vector creating a new vector object. If the provided vector is
   * null, null is returned.
   *
   * @param vec
   *            the vector to subtract from this vector.
   * @return the result vector.
   */
  public subtractVec(vec: Vector4): Vector4;
  /**
   *
   * <code>subtractVec</code>
   *
   * @param vec
   *            the vector to subtract from this
   * @param result
   *            the vector to store the result in
   * @return result
   */
  public subtractVec(vec: Vector4, result: Vector4): Vector4;

  /**
   * Implementation
   */
  public subtractVec(vec: Vector4, result?: Vector4): Vector4 {
    if (!vec) {
      Vector4.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    if(!result) {
      return new Vector4(this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w);
    }
    result.x = this.x - vec.x;
    result.y = this.y - vec.y;
    result.z = this.z - vec.z;
    result.w = this.w - vec.w;
    return result;
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
  public subtractVecLocal(vec: Vector4): Vector4 {
    if (!vec) {
      Vector4.logger.warning("Provided vector is null, null returned.");
      return null;
    }
    this.x -= vec.x;
    this.y -= vec.y;
    this.z -= vec.z;
    this.w -= vec.w;
    return this;
  }

  /**
   *
   * <code>subtract</code> subtracts the provided values from this vector,
   * creating a new vector that is then returned.
   *
   * @param subtractX
   *            the x value to subtract.
   * @param subtractY
   *            the y value to subtract.
   * @param subtractZ
   *            the z value to subtract.
   * @param subtractW
   *            the w value to subtract.
   * @return the result vector.
   */
  public subtract(subtractX: number, subtractY: number, subtractZ: number, subtractW: number): Vector4 {
    return new Vector4(this.x - subtractX, this.y - subtractY, this.z - subtractZ, this.w - subtractW);
  }

  /**
   * <code>subtractLocal</code> subtracts the provided values from this vector
   * internally, and returns a handle to this vector for easy chaining of
   * calls.
   *
   * @param subtractX
   *            the x value to subtract.
   * @param subtractY
   *            the y value to subtract.
   * @param subtractZ
   *            the z value to subtract.
   * @param subtractW
   *            the w value to subtract.
   * @return this
   */
  public subtractLocal(subtractX: number, subtractY: number, subtractZ: number, subtractW: number): Vector4 {
    this.x -= subtractX;
    this.y -= subtractY;
    this.z -= subtractZ;
    this.w -= subtractW;
    return this;
  }

  /**
   * <code>normalize</code> returns the unit vector of this vector.
   *
   * @return unit vector of this vector.
   */
  public normalize(): Vector4 {
    let length: number = this.length();
    if (length !== 1 && length !== 0) {
      length = 1.0 / Math.sqrt(length);
      return new Vector4(this.x * length, this.y * length, this.z * length, this.w * length);
    }
    return this.clone();
  }

  /**
   * <code>normalizeLocal</code> makes this vector into a unit vector of
   * itself.
   *
   * @return this.
   */
  public normalizeLocal(): Vector4 {
    let length: number = this.length();
    if (length !== 1 && length !== 0) {
      length = 1.0 / Math.sqrt(length);
      this.x *= length;
      this.y *= length;
      this.z *= length;
      this.w *= length;
    }
    return this;
  }

  /**
   * <code>maxLocal</code> computes the maximum value for each
   * component in this and <code>other</code> vector. The result is stored
   * in this vector.
   * @param other
   */
  public maxLocal(other: Vector4): Vector4 {
    this.x = other.x > this.x ? other.x : this.x;
    this.y = other.y > this.y ? other.y : this.y;
    this.z = other.z > this.z ? other.z : this.z;
    this.w = other.w > this.w ? other.w : this.w;
    return this;
  }

  /**
   * <code>minLocal</code> computes the minimum value for each
   * component in this and <code>other</code> vector. The result is stored
   * in this vector.
   * @param other
   */
  public minLocal(other: Vector4): Vector4 {
    this.x = other.x < this.x ? other.x : this.x;
    this.y = other.y < this.y ? other.y : this.y;
    this.z = other.z < this.z ? other.z : this.z;
    this.w = other.w < this.w ? other.w : this.w;
    return this;
  }

  /**
   * <code>zero</code> resets this vector's data to zero internally.
   */
  public zero(): Vector4 {
    this.x = this.y = this.z = this.w = 0;
    return this;
  }

  /**
   * <code>angleBetween</code> returns (in radians) the angle between two vectors.
   * It is assumed that both this vector and the given vector are unit vectors (iow, normalized).
   *
   * @param vec a unit vector to find the angle against
   * @return the angle in radians.
   */
  public angleBetween(vec: Vector4): number {
    const dotProduct = this.dot(vec);
    return Math.acos(dotProduct);
  }

  /**
   * Sets this vector to the interpolation by changeAmnt from this to the finalVec
   * this=(1-changeAmt)*this + changeAmt * finalVec
   * @param finalVec The final vector to interpolate towards
   * @param changeAmt An amount between 0.0 - 1.0 representing a percentage
   *  change from this towards finalVec
   */
  public interpolateLocal(changeAmt: number, finalVec: Vector4): Vector4;

  /**
   * Sets this vector to the interpolation by changeAmnt from beginVec to finalVec
   * this=(1-changeAmt)*beginVec + changeAmt * finalVec
   * @param beginVec the beginning vector (changeAmt=0)
   * @param finalVec The final vector to interpolate towards
   * @param changeAmt An amount between 0.0 - 1.0 representing a percentage
   *  change from beginVec towards finalVec
   */
  public interpolateLocal(changeAmt: number, finalVec: Vector4, beginVec: Vector4 = Vector4.UNIT_XYZW): Vector4 {
    this.x=(1-changeAmt)*beginVec.x + changeAmt*finalVec.x;
    this.y=(1-changeAmt)*beginVec.y + changeAmt*finalVec.y;
    this.z=(1-changeAmt)*beginVec.z + changeAmt*finalVec.z;
    this.w=(1-changeAmt)*beginVec.w + changeAmt*finalVec.w;
    return this;
  }

  /**
   * Check a vector... if it is null or its floats are NaN or infinite,
   * return false.  Else return true.
   * @param vector the vector to check
   * @return true or false as stated above.
   */
  public static isValidVector(vector: Vector4): boolean {
    if (!vector) {
      return false;
    }
    if (
      Number.isNaN(vector.x) ||
      Number.isNaN(vector.y) ||
      Number.isNaN(vector.z) ||
      Number.isNaN(vector.w)
    ) {
      return false;
    }
    return Number.isFinite(vector.x) &&
      Number.isFinite(vector.y) &&
      Number.isFinite(vector.z) &&
      Number.isFinite(vector.w);

  }

  public clone(): Vector4 {
    return new Vector4(this);
  }

  /**
   * Saves this Vector3f into the given float[] object.
   *
   * @param vec
   *            The number[] to take this Vector4f. If null, a new float[3] is
   *            created.
   * @return The array, with X, Y, Z, W float values in that order
   */
  public toArray(vec: number[]): number[] {
    if (!isNumberArray(vec)) {
      vec = [];
    }
    vec[0] = this.x;
    vec[1] = this.y;
    vec[2] = this.z;
    vec[3] = this.w;
    return vec;
  }

  /**
   * are these two vectors the same? they are is they both have the same x,y,
   * and z values.
   *
   * @param o
   *            the object to compare for equality
   * @return true if they are equal
   */
  public equals(o: any): boolean {
    if (!(o instanceof Vector4)) {
      return false;
    }

    if (this === o) {
      return true;
    }

    const comp: Vector4 = o as Vector4;
    if (NumberUtils.compare(this.x,comp.x) !== 0) {
      return false;
    }
    if (NumberUtils.compare(this.y,comp.y) !== 0) {
      return false;
    }
    if (NumberUtils.compare(this.z,comp.z) !== 0) {
      return false;
    }
    return NumberUtils.compare(this.w, comp.w) === 0;
  }

  /**
   * Returns true if this vector is similar to the specified vector within
   * some value of epsilon.
   */
  public isSimilar(other: Vector4, epsilon: number): boolean {
    if (!other) {
      return false;
    }
    if (NumberUtils.compare(Math.abs(other.x - this.x), epsilon) > 0) {
      return false;
    }
    if (NumberUtils.compare(Math.abs(other.y - this.y), epsilon) > 0) {
      return false;
    }
    if (NumberUtils.compare(Math.abs(other.z - this.z), epsilon) > 0) {
      return false;
    }
    return NumberUtils.compare(Math.abs(other.w - this.w), epsilon) <= 0;
  }

  /**
   * <code>hashCode</code> returns a unique code for this vector object based
   * on its values. If two vectors are logically equivalent, they will return
   * the same hash code value.
   * @return the hash code value of this vector.
   */
  public hashCode(): number {
    let hash: number = 37;
    hash += 37 * hash + NumberUtils.floatToIntBits(this.x);
    hash += 37 * hash + NumberUtils.floatToIntBits(this.y);
    hash += 37 * hash + NumberUtils.floatToIntBits(this.z);
    hash += 37 * hash + NumberUtils.floatToIntBits(this.w);
    return hash;
  }

  /**
   * <code>toString</code> returns the string representation of this vector.
   * The format is:
   *
   * org.jme.math.Vector3f [X=XX.XXXX, Y=YY.YYYY, Z=ZZ.ZZZZ, W=WW.WWWW]
   *
   * @return the string representation of this vector.
   */
  public toString(): string {
    return `Vector4 (${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }

  public write(e: Exporter): void {
    const capsule: OutputCapsule = e.getCapsule(this);
    capsule.writeNumber(this.x, "x", 0);
    capsule.writeNumber(this.y, "y", 0);
    capsule.writeNumber(this.z, "z", 0);
    capsule.writeNumber(this.w, "w", 0);
  }

  public read(e: Importer): void {
    const capsule: InputCapsule = e.getCapsule(this);
    this.x = capsule.readNumber("x", 0);
    this.y = capsule.readNumber("y", 0);
    this.z = capsule.readNumber("z", 0);
    this.w = capsule.readNumber("w", 0);
  }

  public getX(): number {
    return this.x;
  }

  public setX(x: number): Vector4 {
    this.x = x;
    return this;
  }

  public getY(): number {
    return this.y;
  }

  public setY(y: number): Vector4 {
    this.y = y;
    return this;
  }

  public getZ(): number {
    return this.z;
  }

  public setZ(z: number): Vector4 {
    this.z = z;
    return this;
  }

  public getW(): number {
    return this.w;
  }

  public setW(w: number): Vector4 {
    this.w = w;
    return this;
  }

  /**
   * @param index
   * @return x value if index == 0, y value if index == 1 or z value if index ==
   *         2
   * @throws IllegalArgumentException
   *             if index is not one of 0, 1, 2.
   */
  public get(index: number): number {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
    }
    throw new Error("index must be either 0, 1, 2 or 3");
  }

  /**
   * @param index
   *            which field index in this vector to set.
   * @param value
   *            to set to one of x, y, z or w.
   * @throws IllegalArgumentException
   *             if index is not one of 0, 1, 2, 3.
   */
  public setValue(index: number, value: number): void {
    switch (index) {
      case 0:
        this.x = value;
        return;
      case 1:
        this.y = value;
        return;
      case 2:
        this.z = value;
        return;
      case 3:
        this.w = value;
        return;
    }
    throw new Error("index must be either 0, 1, 2 or 3");
  }

}
