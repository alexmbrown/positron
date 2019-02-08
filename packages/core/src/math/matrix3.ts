import { Savable } from '../export/savable';
import { Cloneable } from '../util/cloneable';
import { Logger } from '../util/logger';
import { isNumber, isNumberArray } from '../util/type-utils';
import { Vector3 } from './vector3';
import { Quaternion } from './quaternion';
import { NumberUtils } from '../util/number-utils';
import { Exporter } from '../export/exporter';
import { Importer } from '../export/importer';
import { OutputCapsule } from '../export/output-capsule';
import { FastMath } from './fast-math';
import { InputCapsule } from '../export/input-capsule';
import { Matrix4 } from './matrix4';

/**
 * <code>Matrix3f</code> defines a 3x3 matrix. Matrix data is maintained
 * internally and is accessible via the get and set methods. Convenience methods
 * are used for matrix operations as well as generating a matrix from a given
 * set of values.
 */
export class Matrix3 implements Savable, Cloneable<Matrix3> {

  private static logger: Logger = Logger.getLogger('Matrix3');

  public m00: number;
  public m01: number;
  public m02: number;
  public m10: number;
  public m11: number;
  public m12: number;
  public m20: number;
  public m21: number;
  public m22: number;

  public static ZERO: Matrix3 = new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
  public static IDENTITY: Matrix3 = new Matrix3();

  /**
   * Constructor instantiates a new <code>Matrix3f</code> object. The
   * initial values for the matrix is that of the identity matrix.
   *
   */
  constructor();

  /**
   * Copy constructor that creates a new <code>Matrix3f</code> object that
   * is the same as the provided matrix.
   *
   * @param mat
   *            the matrix to copy.
   */
  constructor(mat: Matrix3);

  /**
   * constructs a matrix with the given values.
   *
   * @param m00
   *            0x0 in the matrix.
   * @param m01
   *            0x1 in the matrix.
   * @param m02
   *            0x2 in the matrix.
   * @param m10
   *            1x0 in the matrix.
   * @param m11
   *            1x1 in the matrix.
   * @param m12
   *            1x2 in the matrix.
   * @param m20
   *            2x0 in the matrix.
   * @param m21
   *            2x1 in the matrix.
   * @param m22
   *            2x2 in the matrix.
   */
  constructor(
    m00: number,
    m01: number,
    m02: number,
    m10: number,
    m11: number,
    m12: number,
    m20: number,
    m21: number,
    m22: number
  );

  /*
   * Implementation
   */
  constructor(
    arg1?: number|Matrix3,
    m01?: number,
    m02?: number,
    m10?: number,
    m11?: number,
    m12?: number,
    m20?: number,
    m21?: number,
    m22?: number
  ) {
    if (arg1 instanceof Matrix3) {
      this.copy(arg1);
    } else if (
      isNumber(arg1) &&
      isNumber(m01) &&
      isNumber(m02) &&
      isNumber(m10) &&
      isNumber(m11) &&
      isNumber(m12) &&
      isNumber(m20) &&
      isNumber(m21) &&
      isNumber(m22)
    ) {
      this.m00 = arg1;
      this.m01 = m01;
      this.m02 = m02;
      this.m10 = m10;
      this.m11 = m11;
      this.m12 = m12;
      this.m20 = m20;
      this.m21 = m21;
      this.m22 = m22;
    } else {
      this.loadIdentity();
    }
  }

  /**
   * Takes the absolute value of all matrix fields locally.
   */
  public absoluteLocal(): void {
    this.m00 = Math.abs(this.m00);
    this.m01 = Math.abs(this.m01);
    this.m02 = Math.abs(this.m02);
    this.m10 = Math.abs(this.m10);
    this.m11 = Math.abs(this.m11);
    this.m12 = Math.abs(this.m12);
    this.m20 = Math.abs(this.m20);
    this.m21 = Math.abs(this.m21);
    this.m22 = Math.abs(this.m22);
  }

  /**
   * <code>copy</code> transfers the contents of a given matrix to this
   * matrix. If a null matrix is supplied, this matrix is set to the identity
   * matrix.
   *
   * @param matrix
   *            the matrix to copy.
   * @return this
   */
  public copy(matrix: Matrix3): Matrix3 {
    if (!matrix) {
      this.loadIdentity();
    } else {
      this.m00 = matrix.m00;
      this.m01 = matrix.m01;
      this.m02 = matrix.m02;
      this.m10 = matrix.m10;
      this.m11 = matrix.m11;
      this.m12 = matrix.m12;
      this.m20 = matrix.m20;
      this.m21 = matrix.m21;
      this.m22 = matrix.m22;
    }
    return this;
  }

  /**
   * <code>set</code> places a given value into the matrix at the given
   * position. If the position is invalid a <code>JmeException</code> is
   * thrown.
   *
   * @param i
   *            the row index.
   * @param j
   *            the colum index.
   * @param value
   *            the value for (i, j).
   * @return this
   */
  public setElement(i: number, j: number, value: number): Matrix3 {
    switch (i) {
      case 0:
        switch (j) {
          case 0:
            this.m00 = value;
            return this;
          case 1:
            this.m01 = value;
            return this;
          case 2:
            this.m02 = value;
            return this;
        }
        break;
    case 1:
      switch (j) {
        case 0:
          this.m10 = value;
          return this;
        case 1:
          this.m11 = value;
          return this;
        case 2:
          this.m12 = value;
          return this;
      }
      break;
    case 2:
      switch (j) {
        case 0:
          this.m20 = value;
          return this;
        case 1:
          this.m21 = value;
          return this;
        case 2:
          this.m22 = value;
          return this;
      }
    }

    Matrix3.logger.warning("Invalid matrix index.");
    throw new Error("Invalid indices into matrix.");
  }

  /**
   *
   * <code>setFrom2DArray</code> sets the values of the matrix to those supplied by the
   * 3x3 two dimenion array.
   *
   * @param matrix
   *            the new values of the matrix.
   * @throws JmeException
   *             if the array is not of size 9.
   * @return this
   */
  public setFrom2DArray(matrix: number[][]): Matrix3 {
    if (matrix.length !== 3 || matrix[0].length !== 3) {
      throw new Error("Array must be of size 9.");
    }

    this.m00 = matrix[0][0];
    this.m01 = matrix[0][1];
    this.m02 = matrix[0][2];
    this.m10 = matrix[1][0];
    this.m11 = matrix[1][1];
    this.m12 = matrix[1][2];
    this.m20 = matrix[2][0];
    this.m21 = matrix[2][1];
    this.m22 = matrix[2][2];

    return this;
  }

  /**
   * <code>get</code> retrieves a value from the matrix at the given
   * position. If the position is invalid a <code>JmeException</code> is
   * thrown.
   *
   * @param i
   *            the row index.
   * @param j
   *            the colum index.
   * @return the value at (i, j).
   */
  public get(i: number, j: number): number {
    switch (i) {
      case 0:
        switch (j) {
          case 0:
            return this.m00;
          case 1:
            return this.m01;
          case 2:
            return this.m02;
        }
        break;
      case 1:
        switch (j) {
          case 0:
            return this.m10;
          case 1:
            return this.m11;
          case 2:
            return this.m12;
        }
        break;
      case 2:
        switch (j) {
          case 0:
            return this.m20;
          case 1:
            return this.m21;
          case 2:
            return this.m22;
        }
    }

    Matrix3.logger.warning("Invalid matrix index.");
    throw new Error("Invalid indices into matrix.");
  }

  /**
   * <code>loadArray(float[])</code> returns the matrix in row-major or column-major order.
   *
   * @param data
   *      The array to return the data into. This array can be 9 or 16 floats in size.
   *      Only the upper 3x3 are assigned to in the case of a 16 element array.
   * @param rowMajor
   *      True for row major storage in the array (translation in elements 3, 7, 11 for a 4x4),
   *      false for column major (translation in elements 12, 13, 14 for a 4x4).
   */
  public loadArray(data: number[], rowMajor: boolean): void {
    if (data.length == 9) {
      if (rowMajor) {
        data[0] = this.m00;
        data[1] = this.m01;
        data[2] = this.m02;
        data[3] = this.m10;
        data[4] = this.m11;
        data[5] = this.m12;
        data[6] = this.m20;
        data[7] = this.m21;
        data[8] = this.m22;
      } else {
        data[0] = this.m00;
        data[1] = this.m10;
        data[2] = this.m20;
        data[3] = this.m01;
        data[4] = this.m11;
        data[5] = this.m21;
        data[6] = this.m02;
        data[7] = this.m12;
        data[8] = this.m22;
      }
    } else if (data.length == 16) {
      if (rowMajor) {
        data[0] = this.m00;
        data[1] = this.m01;
        data[2] = this.m02;
        data[4] = this.m10;
        data[5] = this.m11;
        data[6] = this.m12;
        data[8] = this.m20;
        data[9] = this.m21;
        data[10] = this.m22;
      } else {
        data[0] = this.m00;
        data[1] = this.m10;
        data[2] = this.m20;
        data[4] = this.m01;
        data[5] = this.m11;
        data[6] = this.m21;
        data[8] = this.m02;
        data[9] = this.m12;
        data[10] = this.m22;
      }
    } else {
      throw new Error("Array size must be 9 or 16 in Matrix3f.get().");
    }
  }

  /**
   * Normalize this matrix and store the result in the store parameter that is
   * returned.
   *
   * Note that the original matrix is not altered.
   *
   * @param store the matrix to store the result of the normalization. If this
   * parameter is null a new one is created
   * @return the normalized matrix
   */
  public normalize(store: Matrix3): Matrix3 {
    if (store == null) {
      store = new Matrix3();
    }

    let mag: number = 1.0 / Math.sqrt(
      this.m00 * this.m00
      + this.m10 * this.m10
      + this.m20 * this.m20
    );

    store.m00 = this.m00 * mag;
    store.m10 = this.m10 * mag;
    store.m20 = this.m20 * mag;

    mag = 1.0 / Math.sqrt(
      this.m01 * this.m01
      + this.m11 * this.m11
      + this.m21 * this.m21
    );

    store.m01 = this.m01 * mag;
    store.m11 = this.m11 * mag;
    store.m21 = this.m21 * mag;

    store.m02 = store.m10 * store.m21 - store.m11 * store.m20;
    store.m12 = store.m01 * store.m20 - store.m00 * store.m21;
    store.m22 = store.m00 * store.m11 - store.m01 * store.m10;
    return store;
  }

  /**
   * Normalize this matrix
   * @return this matrix once normalized.
   */
  public normalizeLocal(): Matrix3 {
    return this.normalize(this);
  }

  /**
   * <code>getColumn</code> returns one of three columns specified by the
   * parameter. This column is returned as a <code>Vector3f</code> object.
   *
   * @param i
   *            the column to retrieve. Must be between 0 and 2.
   * @return the column specified by the index.
   */
  public getColumn(i: number): Vector3;

  /**
   * <code>getColumn</code> returns one of three columns specified by the
   * parameter. This column is returned as a <code>Vector3f</code> object.
   *
   * @param i
   *            the column to retrieve. Must be between 0 and 2.
   * @param store
   *            the vector object to store the result in. if null, a new one
   *            is created.
   * @return the column specified by the index.
   */
  public getColumn(i: number, store: Vector3): Vector3;

  /**
   * Implementation
   */
  public getColumn(i: number, store?: Vector3): Vector3 {
    if (!store) {
      store = new Vector3();
    }
    switch (i) {
      case 0:
        store.x = this.m00;
        store.y = this.m10;
        store.z = this.m20;
        break;
      case 1:
        store.x = this.m01;
        store.y = this.m11;
        store.z = this.m21;
        break;
      case 2:
        store.x = this.m02;
        store.y = this.m12;
        store.z = this.m22;
        break;
      default:
        Matrix3.logger.warning("Invalid column index.");
        throw new Error("Invalid column index. " + i);
    }
    return store;
  }

  /**
   * <code>getColumn</code> returns one of three rows as specified by the
   * parameter. This row is returned as a <code>Vector3f</code> object.
   *
   * @param i
   *            the row to retrieve. Must be between 0 and 2.
   * @return the row specified by the index.
   */
  public getRow(i: number): Vector3;

  /**
   * <code>getRow</code> returns one of three rows as specified by the
   * parameter. This row is returned as a <code>Vector3f</code> object.
   *
   * @param i
   *            the row to retrieve. Must be between 0 and 2.
   * @param store
   *            the vector object to store the result in. if null, a new one
   *            is created.
   * @return the row specified by the index.
   */
  public getRow(i: number, store: Vector3): Vector3;

  /**
   * Implementation
   */
  public getRow(i: number, store?: Vector3): Vector3 {
    if (store == null) {
      store = new Vector3();
    }
    switch (i) {
      case 0:
        store.x =this.m00;
        store.y =this.m01;
        store.z =this.m02;
        break;
      case 1:
        store.x =this.m10;
        store.y =this.m11;
        store.z =this.m12;
        break;
      case 2:
        store.x =this.m20;
        store.y =this.m21;
        store.z =this.m22;
        break;
      default:
        Matrix3.logger.warning("Invalid row index.");
        throw new Error("Invalid row index. " + i);
    }
    return store;
  }

  /**
   * <code>toFloatBuffer</code> returns a FloatBuffer object that contains
   * the matrix data.
   *
   * @return matrix data as a FloatBuffer.
   */
  public toFloatBuffer(): Float32Array {
    const fb: Float32Array = new Float32Array(9);
    fb[0] = this.m00;
    fb[1] = this.m01;
    fb[2] = this.m02;
    fb[3] = this.m10;
    fb[4] = this.m11;
    fb[5] = this.m12;
    fb[6] = this.m20;
    fb[7] = this.m21;
    fb[8] = this.m22;
    return fb;
  }

  /**
   * <code>fillFloatBuffer</code> fills a FloatBuffer object with the matrix
   * data.
   *
   * @param fb
   *            the buffer to fill, starting at current position. Must have
   *            room for 9 more floats.
   * @return matrix data as a FloatBuffer. (position is advanced by 9 and any
   *         limit set is not changed).
   */
  public fillFloatBuffer(fb: Float32Array, columnMajor: boolean): Float32Array {
    if (columnMajor){
      fb[0] = this.m00;
      fb[1] = this.m10;
      fb[2] = this.m20;
      fb[3] = this.m01;
      fb[4] = this.m11;
      fb[5] = this.m21;
      fb[6] = this.m02;
      fb[7] = this.m12;
      fb[8] = this.m22;
    } else {
      fb[0] = this.m00;
      fb[1] = this.m01;
      fb[2] = this.m02;
      fb[3] = this.m10;
      fb[4] = this.m11;
      fb[5] = this.m12;
      fb[6] = this.m20;
      fb[7] = this.m21;
      fb[8] = this.m22;
    }
    return fb;
  }

  public fillArray(f: number[], columnMajor: boolean): void {
    if (columnMajor) {
      f[0] = this.m00;
      f[1] = this.m10;
      f[2] = this.m20;
      f[3] = this.m01;
      f[4] = this.m11;
      f[5] = this.m21;
      f[6] = this.m02;
      f[7] = this.m12;
      f[8] = this.m22;
    } else {
      f[0] = this.m00;
      f[1] = this.m01;
      f[2] = this.m02;
      f[3] = this.m10;
      f[4] = this.m11;
      f[5] = this.m12;
      f[6] = this.m20;
      f[7] = this.m21;
      f[8] = this.m22;
    }
  }

  /**
   *
   * <code>setColumn</code> sets a particular column of this matrix to that
   * represented by the provided vector.
   *
   * @param i
   *            the column to set.
   * @param column
   *            the data to set.
   * @return this
   */
  public setColumn(i: number, column: Vector3): Matrix3 {
    if (!column) {
      Matrix3.logger.warning("Column is null. Ignoring.");
      return this;
    }
    switch (i) {
      case 0:
        this.m00 = column.x;
        this.m10 = column.y;
        this.m20 = column.z;
        break;
      case 1:
        this.m01 = column.x;
        this.m11 = column.y;
        this.m21 = column.z;
        break;
      case 2:
        this.m02 = column.x;
        this.m12 = column.y;
        this.m22 = column.z;
        break;
      default:
        Matrix3.logger.warning("Invalid column index.");
        throw new Error("Invalid column index. " + i);
    }
    return this;
  }

  /**
   *
   * <code>setRow</code> sets a particular row of this matrix to that
   * represented by the provided vector.
   *
   * @param i
   *            the row to set.
   * @param row
   *            the data to set.
   * @return this
   */
  public setRow(i: number, row: Vector3): Matrix3 {
    if (!row) {
      Matrix3.logger.warning("Row is null. Ignoring.");
      return this;
    }
    switch (i) {
      case 0:
        this.m00 = row.x;
        this.m01 = row.y;
        this.m02 = row.z;
        break;
      case 1:
        this.m10 = row.x;
        this.m11 = row.y;
        this.m12 = row.z;
        break;
      case 2:
        this.m20 = row.x;
        this.m21 = row.y;
        this.m22 = row.z;
        break;
      default:
        Matrix3.logger.warning("Invalid row index.");
        throw new Error("Invalid row index. " + i);
    }
    return this;
  }

  /**
   * Recreate Matrix using the provided axis.
   *
   * @param uAxis
   *            Vector3f
   * @param vAxis
   *            Vector3f
   * @param wAxis
   *            Vector3f
   */
  public fromAxes(uAxis: Vector3, vAxis: Vector3, wAxis: Vector3): void {
    this.m00 = uAxis.x;
    this.m10 = uAxis.y;
    this.m20 = uAxis.z;

    this.m01 = vAxis.x;
    this.m11 = vAxis.y;
    this.m21 = vAxis.z;

    this.m02 = wAxis.x;
    this.m12 = wAxis.y;
    this.m22 = wAxis.z;
  }

  /**
   * <code>setFromArray</code> sets the values of this matrix from an array of
   * values assuming that the data is rowMajor order;
   *
   * @param matrix
   *            the matrix to set the value to.
   * @return this
   */
  public setFromArray(matrix: number[]): Matrix3;

  /**
   * <code>setFromArray</code> sets the values of this matrix from an array of
   * values;
   *
   * @param matrix
   *            the matrix to set the value to.
   * @param rowMajor
   *            whether the incoming data is in row or column major order.
   * @return this
   */
  public setFromArray(matrix: number[], rowMajor: boolean): Matrix3;

  /**
   * Implementation
   */
  public setFromArray(matrix: number[], rowMajor: boolean = true): Matrix3 {
    if (isNumberArray(matrix) && matrix.length !== 9) {
      throw new Error("Array must be of size 9.");
    }

    if (rowMajor) {
      this.m00 = matrix[0];
      this.m01 = matrix[1];
      this.m02 = matrix[2];
      this.m10 = matrix[3];
      this.m11 = matrix[4];
      this.m12 = matrix[5];
      this.m20 = matrix[6];
      this.m21 = matrix[7];
      this.m22 = matrix[8];
    } else {
      this.m00 = matrix[0];
      this.m01 = matrix[3];
      this.m02 = matrix[6];
      this.m10 = matrix[1];
      this.m11 = matrix[4];
      this.m12 = matrix[7];
      this.m20 = matrix[2];
      this.m21 = matrix[5];
      this.m22 = matrix[8];
    }
    return this;
  }

  /**
   *
   * <code>set</code> defines the values of the matrix based on a supplied
   * <code>Quaternion</code>. It should be noted that all previous values
   * will be overridden.
   *
   * @param quaternion
   *            the quaternion to create a rotational matrix from.
   * @return this
   */
  public setFromQuat(quaternion: Quaternion): Matrix3 {
    return quaternion.toRotationMatrix(this);
  }

  /**
   * <code>loadIdentity</code> sets this matrix to the identity matrix.
   * Where all values are zero except those along the diagonal which are one.
   *
   */
  public loadIdentity(): void {
    this.m01 = 0;
    this.m02 = 0;
    this.m10 = 0;
    this.m12 = 0;
    this.m20 = 0;
    this.m21 = 0;

    this.m00 = 1;
    this.m11 = 1;
    this.m22 = 1;
  }

  /**
   * @return true if this matrix is identity
   */
  public isIdentity(): boolean {
    return (this.m00 === 1 && this.m01 === 0 && this.m02 === 0)
      && (this.m10 === 0 && this.m11 === 1 && this.m12 === 0)
      && (this.m20 === 0 && this.m21 === 0 && this.m22 == 1);
  }

  /**
   * <code>fromAngleAxis</code> sets this matrix4f to the values specified
   * by an angle and an axis of rotation.  This method creates an object, so
   * use fromAngleNormalAxis if your axis is already normalized.
   *
   * @param angle
   *            the angle to rotate (in radians).
   * @param axis
   *            the axis of rotation.
   */
  public fromAngleAxis(angle: number, axis: Vector3): void {
    const normAxis: Vector3 = axis.normalize();
    this.fromAngleNormalAxis(angle, normAxis);
  }

  /**
   * <code>fromAngleNormalAxis</code> sets this matrix4f to the values
   * specified by an angle and a normalized axis of rotation.
   *
   * @param angle
   *            the angle to rotate (in radians).
   * @param axis
   *            the axis of rotation (already normalized).
   */
  public fromAngleNormalAxis(angle: number, axis: Vector3): void {
    const fCos: number = Math.cos(angle);
    const fSin: number = Math.sin(angle);
    const fOneMinusCos: number = 1.0 - fCos;
    const fX2: number = axis.x * axis.x;
    const fY2: number = axis.y * axis.y;
    const fZ2: number = axis.z * axis.z;
    const fXYM: number = axis.x * axis.y * fOneMinusCos;
    const fXZM: number = axis.x * axis.z * fOneMinusCos;
    const fYZM: number = axis.y * axis.z * fOneMinusCos;
    const fXSin: number = axis.x * fSin;
    const fYSin: number = axis.y * fSin;
    const fZSin: number = axis.z * fSin;

    this.m00 = fX2 * fOneMinusCos + fCos;
    this.m01 = fXYM - fZSin;
    this.m02 = fXZM + fYSin;
    this.m10 = fXYM + fZSin;
    this.m11 = fY2 * fOneMinusCos + fCos;
    this.m12 = fYZM - fXSin;
    this.m20 = fXZM - fYSin;
    this.m21 = fYZM + fXSin;
    this.m22 = fZ2 * fOneMinusCos + fCos;
  }

  /**
   * <code>mult</code> multiplies this matrix by a given matrix. The result
   * matrix is returned as a new object. If the given matrix is null, a null
   * matrix is returned.
   *
   * @param mat
   *            the matrix to multiply this matrix by.
   * @return the result matrix.
   */
  public mult(mat: Matrix3): Matrix3;

  /**
   * <code>mult</code> multiplies this matrix by a given matrix. The result
   * matrix is returned as a new object.
   *
   * @param mat
   *            the matrix to multiply this matrix by.
   * @param product
   *            the matrix to store the result in. if null, a new matrix3f is
   *            created.  It is safe for mat and product to be the same object.
   * @return a matrix3f object containing the result of this operation
   */
  public mult(mat: Matrix3, product: Matrix3): Matrix3;

  /**
   * Implementation
   */
  public mult(mat: Matrix3, product?: Matrix3): Matrix3 {

    let temp00;
    let temp01;
    let temp02;

    let temp10;
    let temp11;
    let temp12;

    let temp20;
    let temp21;
    let temp22;

    if (!product) {
      product = new Matrix3();
    }
    temp00 = this.m00 * mat.m00 + this.m01 * mat.m10 + this.m02 * mat.m20;
    temp01 = this.m00 * mat.m01 + this.m01 * mat.m11 + this.m02 * mat.m21;
    temp02 = this.m00 * mat.m02 + this.m01 * mat.m12 + this.m02 * mat.m22;
    temp10 = this.m10 * mat.m00 + this.m11 * mat.m10 + this.m12 * mat.m20;
    temp11 = this.m10 * mat.m01 + this.m11 * mat.m11 + this.m12 * mat.m21;
    temp12 = this.m10 * mat.m02 + this.m11 * mat.m12 + this.m12 * mat.m22;
    temp20 = this.m20 * mat.m00 + this.m21 * mat.m10 + this.m22 * mat.m20;
    temp21 = this.m20 * mat.m01 + this.m21 * mat.m11 + this.m22 * mat.m21;
    temp22 = this.m20 * mat.m02 + this.m21 * mat.m12 + this.m22 * mat.m22;

    product.m00 = temp00;
    product.m01 = temp01;
    product.m02 = temp02;
    product.m10 = temp10;
    product.m11 = temp11;
    product.m12 = temp12;
    product.m20 = temp20;
    product.m21 = temp21;
    product.m22 = temp22;

    return product;
  }

  /**
   * <code>mult</code> multiplies this matrix by a given
   * <code>Vector3f</code> object. The result vector is returned. If the
   * given vector is null, null will be returned.
   *
   * @param vec
   *            the vector to multiply this matrix by.
   * @return the result vector.
   */
  public multVec(vec: Vector3): Vector3;

  /**
   * Multiplies this 3x3 matrix by the 1x3 Vector vec and stores the result in
   * product.
   *
   * @param vec
   *            The Vector3f to multiply.
   * @param product
   *            The Vector3f to store the result, it is safe for this to be
   *            the same as vec.
   * @return The given product vector.
   */
  public multVec(vec: Vector3, product: Vector3): Vector3;

  /**
   * Implementation
   */
  public multVec(vec: Vector3, product?: Vector3): Vector3 {
    if (!product) {
      product = new Vector3();
    }

    const x: number = vec.x;
    const y: number = vec.y;
    const z: number = vec.z;

    product.x = this.m00 * x + this.m01 * y + this.m02 * z;
    product.y = this.m10 * x + this.m11 * y + this.m12 * z;
    product.z = this.m20 * x + this.m21 * y + this.m22 * z;
    return product;
  }

  /**
   * <code>multLocal</code> multiplies this matrix internally by
   * a given float scale factor.
   *
   * @param scale
   *            the value to scale by.
   * @return this Matrix3f
   */
  public multLocalScalar(scale: number): Matrix3 {
    this.m00 *= scale;
    this.m01 *= scale;
    this.m02 *= scale;
    this.m10 *= scale;
    this.m11 *= scale;
    this.m12 *= scale;
    this.m20 *= scale;
    this.m21 *= scale;
    this.m22 *= scale;
    return this;
  }

  /**
   * <code>multLocal</code> multiplies this matrix by a given
   * <code>Vector3f</code> object. The result vector is stored inside the
   * passed vector, then returned . If the given vector is null, null will be
   * returned.
   *
   * @param vec
   *            the vector to multiply this matrix by.
   * @return The passed vector after multiplication
   */
  public multLocalVec(vec: Vector3): Vector3 {
    if (!vec) {
      return null;
    }
    const x: number = vec.x;
    const y: number = vec.y;
    vec.x = this.m00 * x + this.m01 * y + this.m02 * vec.z;
    vec.y = this.m10 * x + this.m11 * y + this.m12 * vec.z;
    vec.z = this.m20 * x + this.m21 * y + this.m22 * vec.z;
    return vec;
  }

  /**
   * <code>mult</code> multiplies this matrix by a given matrix. The result
   * matrix is saved in the current matrix. If the given matrix is null,
   * nothing happens. The current matrix is returned. This is equivalent to
   * this*=mat
   *
   * @param mat
   *            the matrix to multiply this matrix by.
   * @return This matrix, after the multiplication
   */
  public multLocal(mat: Matrix3): Matrix3 {
    return this.mult(mat, this);
  }

  /**
   * Transposes this matrix in place. Returns this matrix for chaining
   *
   * @return This matrix after transpose
   */
  public transposeLocal(): Matrix3 {
    let tmp = this.m01;
    this.m01 = this.m10;
    this.m10 = tmp;

    tmp = this.m02;
    this.m02 = this.m20;
    this.m20 = tmp;

    tmp = this.m12;
    this.m12 = this.m21;
    this.m21 = tmp;

    return this;
  }

  /**
   * Inverts this matrix as a new Matrix3f.
   *
   * @return The new inverse matrix
   */
  public invert(): Matrix3;

  /**
   * Inverts this matrix and stores it in the given store.
   *
   * @return The store
   */
  public invert(store: Matrix3): Matrix3;

  /**
   * Implementation
   */
  public invert(store?: Matrix3): Matrix3 {
    if (!store) {
      store = new Matrix3();
    }

    const det: number = this.determinant();
    if (Math.abs(det) <= Number.EPSILON) {
      return store.zero();
    }

    store.m00 = this.m11 * this.m22 - this.m12 * this.m21;
    store.m01 = this.m02 * this.m21 - this.m01 * this.m22;
    store.m02 = this.m01 * this.m12 - this.m02 * this.m11;
    store.m10 = this.m12 * this.m20 - this.m10 * this.m22;
    store.m11 = this.m00 * this.m22 - this.m02 * this.m20;
    store.m12 = this.m02 * this.m10 - this.m00 * this.m12;
    store.m20 = this.m10 * this.m21 - this.m11 * this.m20;
    store.m21 = this.m01 * this.m20 - this.m00 * this.m21;
    store.m22 = this.m00 * this.m11 - this.m01 * this.m10;

    store.multLocalScalar(1.0 / det);
    return store;
  }

  /**
   * Inverts this matrix locally.
   *
   * @return this
   */
  public invertLocal(): Matrix3 {
    const det: number = this.determinant();
    if (Math.abs(det) <= 0) {
      return this.zero();
    }

    const f00: number = this.m11 * this.m22 - this.m12 * this.m21;
    const f01: number = this.m02 * this.m21 - this.m01 * this.m22;
    const f02: number = this.m01 * this.m12 - this.m02 * this.m11;
    const f10: number = this.m12 * this.m20 - this.m10 * this.m22;
    const f11: number = this.m00 * this.m22 - this.m02 * this.m20;
    const f12: number = this.m02 * this.m10 - this.m00 * this.m12;
    const f20: number = this.m10 * this.m21 - this.m11 * this.m20;
    const f21: number = this.m01 * this.m20 - this.m00 * this.m21;
    const f22: number = this.m00 * this.m11 - this.m01 * this.m10;

    this.m00 = f00;
    this.m01 = f01;
    this.m02 = f02;
    this.m10 = f10;
    this.m11 = f11;
    this.m12 = f12;
    this.m20 = f20;
    this.m21 = f21;
    this.m22 = f22;

    this.multLocalScalar(1.0 / det);
    return this;
  }

  /**
   * Returns a new matrix representing the adjoint of this matrix.
   *
   * @return The adjoint matrix
   */
  public adjoint(): Matrix3;

  /**
   * Places the adjoint of this matrix in store (creates store if null.)
   *
   * @param store
   *            The matrix to store the result in.  If null, a new matrix is created.
   * @return store
   */
  public adjoint(store: Matrix3): Matrix3;

  /**
   * Implementation
   */
  public adjoint(store?: Matrix3): Matrix3 {
    if (!store) {
      store = new Matrix3();
    }

    store.m00 = this.m11 * this.m22 - this.m12 * this.m21;
    store.m01 = this.m02 * this.m21 - this.m01 * this.m22;
    store.m02 = this.m01 * this.m12 - this.m02 * this.m11;
    store.m10 = this.m12 * this.m20 - this.m10 * this.m22;
    store.m11 = this.m00 * this.m22 - this.m02 * this.m20;
    store.m12 = this.m02 * this.m10 - this.m00 * this.m12;
    store.m20 = this.m10 * this.m21 - this.m11 * this.m20;
    store.m21 = this.m01 * this.m20 - this.m00 * this.m21;
    store.m22 = this.m00 * this.m11 - this.m01 * this.m10;

    return store;
  }

  /**
   * <code>determinant</code> generates the determinant of this matrix.
   *
   * @return the determinant
   */
  public determinant(): number {
    const fCo00: number = this.m11 * this.m22 - this.m12 * this.m21;
    const fCo10: number = this.m12 * this.m20 - this.m10 * this.m22;
    const fCo20: number = this.m10 * this.m21 - this.m11 * this.m20;
    return this.m00 * fCo00 + this.m01 * fCo10 + this.m02 * fCo20;
  }

  /**
   * Sets all of the values in this matrix to zero.
   *
   * @return this matrix
   */
  public zero(): Matrix3 {
    this.m00 = this.m01 = this.m02 = this.m10 = this.m11 = this.m12 = this.m20 = this.m21 = this.m22 = 0.0;
    return this;
  }

  /**
   * <code>transpose</code> <b>locally</b> transposes this Matrix.
   * This is inconsistent with general value vs local semantics, but is
   * preserved for backwards compatibility. Use transposeNew() to transpose
   * to a new object (value).
   *
   * @return this object for chaining.
   */
  public transpose(): Matrix3 {
    return this.transposeLocal();
  }

  /**
   * <code>transposeNew</code> returns a transposed version of this matrix.
   *
   * @return The new Matrix3f object.
   */
  public transposeNew(): Matrix3 {
    return new Matrix3(
      this.m00,
      this.m10,
      this.m20,
      this.m01,
      this.m11,
      this.m21,
      this.m02,
      this.m12,
      this.m22
    );
  }

  /**
   * <code>toString</code> returns the string representation of this object.
   * It is in a format of a 3x3 matrix. For example, an identity matrix would
   * be represented by the following string. com.jme.math.Matrix3f <br>[<br>
   * 1.0  0.0  0.0 <br>
   * 0.0  1.0  0.0 <br>
   * 0.0  0.0  1.0 <br>]<br>
   *
   * @return the string representation of this object.
   */
  public toString(): string {
    return `Matrix3
    [
     ${this.m00}  ${this.m01}  ${this.m02} 
     ${this.m10}  ${this.m11}  ${this.m12} 
     ${this.m20}  ${this.m21}  ${this.m22} 
    ]`;
  }

  /**
   *
   * <code>hashCode</code> returns the hash code value as an integer and is
   * supported for the benefit of hashing based collection classes such as
   * Hashtable, HashMap, HashSet etc.
   *
   * @return the hashcode for this instance of Matrix4f.
   */
  public hashCode(): number {
    let hash: number = 37;
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m00);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m01);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m02);

    hash = 37 * hash + NumberUtils.floatToIntBits(this.m10);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m11);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m12);

    hash = 37 * hash + NumberUtils.floatToIntBits(this.m20);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m21);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m22);

    return hash;
  }

  /**
   * are these two matrices the same? they are is they both have the same mXX values.
   *
   * @param comp
   *            the matrix to compare for equality
   * @return true if they are equal
   */
  public equals(o: any): boolean {
    if (!(o instanceof Matrix3)) {
      return false;
    }

    if (this === o) {
      return true;
    }

    const comp: Matrix3 = o as Matrix3;
    if (NumberUtils.compare(this.m00, comp.m00) !== 0) {
      return false;
    }
    if (NumberUtils.compare(this.m01, comp.m01) !== 0) {
      return false;
    }
    if (NumberUtils.compare(this.m02, comp.m02) !== 0) {
      return false;
    }

    if (NumberUtils.compare(this.m10, comp.m10) !== 0) {
      return false;
    }
    if (NumberUtils.compare(this.m11, comp.m11) !== 0) {
      return false;
    }
    if (NumberUtils.compare(this.m12, comp.m12) !== 0) {
      return false;
    }

    if (NumberUtils.compare(this.m20, comp.m20) !== 0) {
      return false;
    }
    if (NumberUtils.compare(this.m21, comp.m21) !== 0) {
      return false;
    }
    return NumberUtils.compare(this.m22, comp.m22) === 0;
  }

  public write(e: Exporter): void {
    const cap: OutputCapsule = e.getCapsule(this);
    cap.writeNumber(this.m00, "m00", 1);
    cap.writeNumber(this.m01, "m01", 0);
    cap.writeNumber(this.m02, "m02", 0);
    cap.writeNumber(this.m10, "m10", 0);
    cap.writeNumber(this.m11, "m11", 1);
    cap.writeNumber(this.m12, "m12", 0);
    cap.writeNumber(this.m20, "m20", 0);
    cap.writeNumber(this.m21, "m21", 0);
    cap.writeNumber(this.m22, "m22", 1);
  }

  public read(i: Importer): void {
    const cap: InputCapsule = i.getCapsule(this);
    this.m00 = cap.readNumber("m00", 1);
    this.m01 = cap.readNumber("m01", 0);
    this.m02 = cap.readNumber("m02", 0);
    this.m10 = cap.readNumber("m10", 0);
    this.m11 = cap.readNumber("m11", 1);
    this.m12 = cap.readNumber("m12", 0);
    this.m20 = cap.readNumber("m20", 0);
    this.m21 = cap.readNumber("m21", 0);
    this.m22 = cap.readNumber("m22", 1);
  }

  /**
   * A function for creating a rotation matrix that rotates a vector called
   * "start" into another vector called "end".
   *
   * @param start
   *            normalized non-zero starting vector
   * @param end
   *            normalized non-zero ending vector
   * @see "Tomas M�ller, John Hughes \"Efficiently Building a Matrix to Rotate \
   *      One Vector to Another\" Journal of Graphics Tools, 4(4):1-4, 1999"
   */
  public fromStartEndVectors(start: Vector3, end: Vector3): void {
    const v: Vector3 = new Vector3();
    let e: number;
    let h: number;
    let f: number;

    start.crossVec(end, v);
    e = start.dot(end);
    f = (e < 0) ? -e : e;

    // if "from" and "to" vectors are nearly parallel
    if (f > 1.0 - FastMath.ZERO_TOLERANCE) {
      const u: Vector3  = new Vector3();
      const x: Vector3  = new Vector3();
      /* coefficients for later use */
      let c1: number;
      let c2: number;
      let c3: number;
      let i: number;
      let j: number;

      x.x = (start.x > 0.0) ? start.x : -start.x;
      x.y = (start.y > 0.0) ? start.y : -start.y;
      x.z = (start.z > 0.0) ? start.z : -start.z;

      if (x.x < x.y) {
        if (x.x < x.z) {
          x.x = 1.0;
          x.y = x.z = 0.0;
        } else {
          x.z = 1.0;
          x.x = x.y = 0.0;
        }
      } else {
        if (x.y < x.z) {
          x.y = 1.0;
          x.x = x.z = 0.0;
        } else {
          x.z = 1.0;
          x.x = x.y = 0.0;
        }
      }

      u.x = x.x - start.x;
      u.y = x.y - start.y;
      u.z = x.z - start.z;
      v.x = x.x - end.x;
      v.y = x.y - end.y;
      v.z = x.z - end.z;

      c1 = 2.0 / u.dot(u);
      c2 = 2.0 / v.dot(v);
      c3 = c1 * c2 * u.dot(v);

      for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
          const val = -c1 * u.get(i) * u.get(j) - c2 * v.get(i)
            * v.get(j) + c3 * v.get(i) * u.get(j);
          this.setElement(i, j, val);
        }
        const val = this.get(i, i);
        this.setElement(i, i, val + 1.0);
      }
    } else {
      // the most common case, unless "start"="end", or "start"=-"end"
      let  hvx: number;
      let  hvz: number;
      let  hvxy: number;
      let  hvxz: number;
      let  hvyz: number;
      h = 1.0 / (1.0 + e);
      hvx = h * v.x;
      hvz = h * v.z;
      hvxy = hvx * v.y;
      hvxz = hvx * v.z;
      hvyz = hvz * v.y;
      this.setElement(0, 0, e + hvx * v.x);
      this.setElement(0, 1, hvxy - v.z);
      this.setElement(0, 2, hvxz + v.y);

      this.setElement(1, 0, hvxy + v.z);
      this.setElement(1, 1, e + h * v.y * v.y);
      this.setElement(1, 2, hvyz - v.x);

      this.setElement(2, 0, hvxz - v.y);
      this.setElement(2, 1, hvyz + v.x);
      this.setElement(2, 2, e + hvz * v.z);
    }
  }

  /**
   * <code>scale</code> scales the operation performed by this matrix on a
   * per-component basis.
   *
   * @param scale
   *         The scale applied to each of the X, Y and Z output values.
   */
  public scale(scale: Vector3): void {
    this.m00 *= scale.x;
    this.m10 *= scale.x;
    this.m20 *= scale.x;
    this.m01 *= scale.y;
    this.m11 *= scale.y;
    this.m21 *= scale.y;
    this.m02 *= scale.z;
    this.m12 *= scale.z;
    this.m22 *= scale.z;
  }

  public static equalIdentity(mat: Matrix3): boolean {
    if (Math.abs(mat.m00 - 1) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m11 - 1) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m22 - 1) > 1e-4) {
      return false;
    }

    if (Math.abs(mat.m01) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m02) > 1e-4) {
      return false;
    }

    if (Math.abs(mat.m10) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m12) > 1e-4) {
      return false;
    }

    if (Math.abs(mat.m20) > 1e-4) {
      return false;
    }
    return Math.abs(mat.m21) <= 1e-4;
  }

  public clone(): Matrix3 {
    return new Matrix3(this);
  }

}
