import { isNumber } from '../util/type-utils';
import { FastMath } from './fast-math';


export class Vector3 {

  public static ZERO = new Vector3(0, 0, 0);
  public static NAN = new Vector3(Number.NaN, Number.NaN, Number.NaN);
  public static UNIT_X = new Vector3(1, 0, 0);
  public static UNIT_Y = new Vector3(0, 1, 0);
  public static UNIT_Z = new Vector3(0, 0, 1);
  public static UNIT_XYZ = new Vector3(1, 1, 1);

  public static POSITIVE_INFINITY = new Vector3(
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY,
    Number.POSITIVE_INFINITY);
  public static NEGATIVE_INFINITY = new Vector3(
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.NEGATIVE_INFINITY);

  public x: number;
  public y: number;
  public z: number;

  constructor()
  constructor(copy: Vector3);
  constructor(x: number, y: number, z: number);
  constructor(arg1?: number|Vector3, y?: number, z?: number) {
    // copy vector
    if (arg1 instanceof Vector3) {
      this.x = arg1.x;
      this.y = arg1.y;
      this.z = arg1.z;
    }
    // x, y, z provided
    else if (isNumber(arg1) && isNumber(y) && isNumber(z)) {
      this.x = arg1;
      this.y = y;
      this.z = z;
    }
    // no values provided
    else {
      this.x = this.y = this.z = 0;
    }
  }

  getX(): number {
    return this.x;
  }

  setX(x: number): Vector3 {
    this.x = x;
    return this;
  }

  getY(): number {
    return this.y;
  }

  setY(y: number): Vector3 {
    this.y = y;
    return this;
  }

  getZ(): number {
    return this.z;
  }

  setZ(z: number): Vector3 {
    this.z = z;
    return this;
  }

  get(index: number): number {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
    }
    throw new Error("index must be either 0, 1 or 2");
  }

  set(x: number, y: number, z: number): Vector3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  setIndex(index: number, value: number): Vector3 {
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
    }
    throw new Error("index must be either 0, 1 or 2");
  }

  copy(vec: Vector3): Vector3 {
    if (vec instanceof  Vector3) {
      this.x = vec.x;
      this.y = vec.y;
      this.z = vec.z;
      return this;
    } else {
      new Vector3();
    }
  }

  add(x: number, y: number, z: number): Vector3;
  add(x: number, y: number, z: number, result: Vector3): Vector3;
  add(x: number, y: number, z: number, result?: Vector3): Vector3 {
    if (!(result instanceof Vector3)) {
      result = new Vector3();
    }
    result.x = this.x + x;
    result.y = this.y + y;
    result.z = this.z + z;
    return result;
  }


  addVec(vec: Vector3): Vector3;
  addVec(vec: Vector3, result: Vector3): Vector3;
  addVec(vec: Vector3, result?: Vector3): Vector3 {
    if (!(result instanceof Vector3)) {
      result = new Vector3();
    }
    result.x = this.x + vec.x;
    result.y = this.y + vec.y;
    result.z = this.z + vec.z;
    return result;
  }

  addLocal(addX: number, addY: number, addZ: number) {
    this.x += addX;
    this.y += addY;
    this.z += addZ;
    return this;
  }

  addVecLocal(vec: Vector3): Vector3 {
    if (vec instanceof Vector3) {
      this.x += vec.x;
      this.y += vec.y;
      this.z += vec.z;
      return this;
    }
  }

  scaleAdd(scalar: number, add: Vector3): Vector3 {
    if(add instanceof Vector3) {
      this.x = this.x * scalar + add.x;
      this.y = this.y * scalar + add.y;
      this.z = this.z * scalar + add.z;
      return this;
    }
  }

  scaleAddVec(scalar: number, mult: Vector3, add: Vector3): Vector3 {
    this.x = mult.x * scalar + add.x;
    this.y = mult.y * scalar + add.y;
    this.z = mult.z * scalar + add.z;
    return this;
  }

  dot(vec: Vector3): number {
    if (vec instanceof Vector3) {
      return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }
  }

  cross(otherX: number, otherY: number, otherZ: number): Vector3;
  cross(otherX: number, otherY: number, otherZ: number, result: Vector3): Vector3;
  cross(otherX: number, otherY: number, otherZ: number, result?: Vector3): Vector3 {
    if (!(result instanceof Vector3)) {
      result = new Vector3();
    }
    let resX: number = ((this.y * otherZ) - (this.z * otherY));
    let resY: number = ((this.z * otherX) - (this.x * otherZ));
    let resZ: number = ((this.x * otherY) - (this.y * otherX));
    result.set(resX, resY, resZ);
    return result;
  }

  crossVec(v: Vector3): Vector3;
  crossVec(v: Vector3, result: Vector3): Vector3;
  crossVec(v: Vector3, result?: Vector3): Vector3 {
    return this.cross(v.x, v.y, v.z, result);
  }

  crossLocal(otherX: number, otherY: number, otherZ: number): Vector3 {
    let tempx: number = ( this.y * otherZ ) - ( this.z * otherY );
    let tempy: number = ( this.z * otherX ) - ( this.x * otherZ );
    this.z = (this.x * otherY) - (this.y * otherX);
    this.x = tempx;
    this.y = tempy;
    return this;
  }

  crossLocalVec(v: Vector3): Vector3 {
    if (v instanceof Vector3) {
      return this.crossLocal(v.x, v.y, v.z);
    }
  }

  project(other: Vector3): Vector3 {
    if (other instanceof Vector3) {
      let n: number = this.dot(other); // A . B
      let d: number = other.lengthSquared(); // |B|^2
      return new Vector3(other).multLocalScalar(n/d);
    }
  }

  projectLocal(other: Vector3): Vector3 {
    if (other instanceof Vector3) {
      let n: number = this.dot(other); // A . B
      let d: number = other.lengthSquared(); // |B|^2
      return this.setVec(other).multLocalScalar(n/d);
    }
  }

  isUnitVector(): boolean {
    let len: number = this.length();
    return 0.99 < len && len < 1.01;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }


  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  distance(v: Vector3): number {
    if (v instanceof Vector3) {
      return Math.sqrt(this.distanceSquared(v));
    }
  }

  distanceSquared(v: Vector3): number {
    if (v instanceof Vector3) {
      let dx: number = this.x - v.x;
      let dy: number = this.y - v.y;
      let dz: number = this.z - v.z;
      return dx * dx + dy * dy + dz * dz;
    }
  }

  multScalar(scalar: number): Vector3;
  multScalar(scalar: number, product: Vector3): Vector3;
  multScalar(scalar: number, product?: Vector3): Vector3 {
    if (!(product instanceof Vector3)) {
      product = new Vector3();
    }
    product.x = this.x * scalar;
    product.y = this.y * scalar;
    product.z = this.z * scalar;
    return product;
  }

  multVec(vec: Vector3): Vector3
  multVec(vec: Vector3, store: Vector3): Vector3
  multVec(vec: Vector3, store?: Vector3): Vector3 {
    if (vec instanceof Vector3) {
      if (!(store instanceof Vector3)) {
        store = new Vector3();
      }
      return store.set(this.x * vec.x, this.y * vec.y, this.z * vec.z);
    }
  }

  multLocal(x: number, y: number, z: number): Vector3 {
    this.x *= x;
    this.y *= y;
    this.z *= z;
    return this;
  }


  multScalarLocal(scalar: number): Vector3 {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }


  multLocalVec(vec: Vector3): Vector3 {
    if (vec instanceof Vector3) {
      this.x *= vec.x;
      this.y *= vec.y;
      this.z *= vec.z;
      return this;
    }
  }

  divide(scalar: number): Vector3 {
    scalar = 1.0/scalar;
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  divideVec(scalar: Vector3): Vector3 {
    if (scalar instanceof Vector3) {
      return new Vector3(this.x / scalar.x, this.y / scalar.y, this.z / scalar.z);
    }
  }

  divideLocal(scalar: number): Vector3 {
    scalar = 1.0/scalar;
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  divideLocalVec(scalar: Vector3): Vector3 {
    this.x /= scalar.x;
    this.y /= scalar.y;
    this.z /= scalar.z;
    return this;
  }


  negate(): Vector3 {
    return new Vector3(-this.x, -this.y, -this.z);
  }


  negateLocal(): Vector3 {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
  }

  subtract(subtractX: number, subtractY: number, subtractZ: number): Vector3 {
    return new Vector3(this.x - subtractX, this.y - subtractY, this.z - subtractZ);
  }

  subtractVec(vec: Vector3): Vector3;
  subtractVec(vec: Vector3, result: Vector3): Vector3;
  subtractVec(vec: Vector3, result?: Vector3): Vector3 {
    if (!(result instanceof Vector3)) {
      result = new Vector3();
    }
    result.x = this.x - vec.x;
    result.y = this.y - vec.y;
    result.z = this.z - vec.z;
    return result;
  }

  subtractLocal(subtractX: number, subtractY: number, subtractZ: number): Vector3 {
    this.x -= subtractX;
    this.y -= subtractY;
    this.z -= subtractZ;
    return this;
  }

  subtractVecLocal(vec: Vector3): Vector3 {
    if(vec instanceof Vector3) {
      this.x -= vec.x;
      this.y -= vec.y;
      this.z -= vec.z;
      return this;
    }
  }

  normalize(): Vector3 {
    let length: number = this.x * this.x + this.y * this.y + this.z * this.z;
    if (length != 1.0 && length != 0.0){
      length = 1.0 / Math.sqrt(length);
      return new Vector3(this.x * length, this.y * length, this.z * length);
    }
    return this.clone();
  }


  normalizeLocal(): Vector3 {
    let length: number = this.x * this.x + this.y * this.y + this.z * this.z;
    if (length != 1.0 && length != 0.0){
      length = 1.0 / Math.sqrt(length);
      this.x *= length;
      this.y *= length;
      this.z *= length;
    }
    return this;
  }


  maxLocal(other: Vector3): Vector3{
    this.x = other.x > this.x ? other.x : this.x;
    this.y = other.y > this.y ? other.y : this.y;
    this.z = other.z > this.z ? other.z : this.z;
    return this;
  }


  minLocal(other: Vector3): Vector3{
    this.x = other.x < this.x ? other.x : this.x;
    this.y = other.y < this.y ? other.y : this.y;
    this.z = other.z < this.z ? other.z : this.z;
    return this;
  }


  zero(): Vector3 {
    this.x = this.y = this.z = 0;
    return this;
  }

  angleBetween(otherVector: Vector3): number {
    let dotProduct: number = this.dot(otherVector);
    let angle: number = Math.acos(dotProduct);
    return angle;
  }


  interpolateLocal(changeAmount: number, finalVec: Vector3): Vector3;
  interpolateLocal(changeAmount: number, beginVec: Vector3, finalVec: Vector3): Vector3;
  interpolateLocal(changeAmount: number, beginVec: Vector3, finalVec?: Vector3): Vector3 {
    if (!finalVec) {
      finalVec = beginVec;
      beginVec = Vector3.UNIT_XYZ;
    }
    this.x=(1-changeAmount)*beginVec.x + changeAmount*finalVec.x;
    this.y=(1-changeAmount)*beginVec.y + changeAmount*finalVec.y;
    this.z=(1-changeAmount)*beginVec.z + changeAmount*finalVec.z;
    return this;
  }

  static isValidVector(vector: Vector3): boolean {
    if (!(vector instanceof Vector3)) {
      return false;
    }
    if (isNaN(vector.x) || isNaN(vector.y) || isNaN(vector.z)) {
      return false;
    }
    return isFinite(vector.x) && isFinite(vector.y) && isFinite(vector.z);

  }

  static generateOrthonormalBasis(u: Vector3, v: Vector3, w: Vector3) {
    w.normalizeLocal();
    this.generateComplementBasis(u, v, w);
  }

  static generateComplementBasis(u: Vector3, v: Vector3, w: Vector3) {
    if (Math.abs(w.x) >=  Math.abs(w.y)) {
      // w.x or w.z is the largest magnitude component, swap them
      let invLength: number = FastMath.invSqrt(w.x * w.x + w.z * w.z);
      u.x = -w.z * invLength;
      u.y = 0.0;
      u.z = +w.x * invLength;
      v.x = w.y * u.z;
      v.y = w.z * u.x - w.x * u.z;
      v.z = -w.y * u.x;
    } else {
      // w.y or w.z is the largest magnitude component, swap them
      let invLength: number = FastMath.invSqrt(w.y * w.y + w.z * w.z);
      u.x = 0.0;
      u.y = +w.z * invLength;
      u.z = -w.y * invLength;
      v.x = w.y * u.z - w.z * u.y;
      v.y = -w.x * u.z;
      v.z = w.x * u.y;
    }
  }

  clone(): Vector3 {
    return new Vector3(this);
  }


  toArray(): number[];
  toArray(values: number[]): number[];
  toArray(values?: number[]): number[] {
    if (!Array.isArray(values)) {
      values = [];
    }
    values[0] = this.x;
    values[1] = this.y;
    values[2] = this.z;
    return values;
  }


  equals(vec: any): boolean {
    if (!(vec instanceof Vector3)) {
      return false;
    }
    if (this === vec) {
      return true;
    }
    return !(this.x !== vec.x || this.y !== vec.y || this.z !== vec.z);
  }

  hashCode(): number {
    let hash: number = 37;
    hash += 37 * hash + Math.round(this.x);
    hash += 37 * hash + Math.round(this.y);
    hash += 37 * hash + Math.round(this.z);
    return hash;
  }

  toString(): String {
    return "(" + this.x + ", " + this.y + ", " + this.z + ")";
  }

}
