/**
 * <code>Matrix4f</code> defines and maintains a 4x4 matrix in row major order.
 * This matrix is intended for use in a translation and rotational capacity.
 * It provides convenience methods for creating the matrix from a multitude
 * of sources.
 *
 * Matrices are stored assuming column vectors on the right, with the translation
 * in the rightmost column. Element numbering is row,column, so m03 is the zeroth
 * row, third column, which is the "x" translation part. This means that the implicit
 * storage order is column major. However, the get() and set() functions on float
 * arrays default to row major order!
 */
import { Savable } from '../export/savable';
import { Cloneable } from '../util/cloneable';
import { Logger } from '../util/logger';
import { isNumber, isNumberArray } from '../util/type-utils';
import { Vector3 } from './vector3';
import { Vector4 } from './vector4';
import { Quaternion } from './quaternion';
import { Matrix3 } from './matrix3';
import { FastMath } from './fast-math';
import { NumberUtils } from '../util/number-utils';
import { Exporter } from '../export/exporter';
import { Importer } from '../export/importer';
import { OutputCapsule } from '../export/output-capsule';
import { InputCapsule } from '../export/input-capsule';

export class Matrix4 implements Savable, Cloneable<Matrix4> {

  private static logger: Logger = Logger.getLogger('Matrix4');

  public m00: number;
  public m01: number;
  public m02: number;
  public m03: number;

  public m10: number;
  public m11: number;
  public m12: number;
  public m13: number;

  public m20: number;
  public m21: number;
  public m22: number;
  public m23: number;

  public m30: number;
  public m31: number;
  public m32: number;
  public m33: number;

  public static ZERO: Matrix4 = new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  public static IDENTITY: Matrix4 = new Matrix4();

  /**
   * Constructor instantiates a new <code>Matrix</code> that is set to the
   * identity matrix.
   *
   */
  constructor();

  /**
   * Create a new Matrix4f, given data in column-major format.
   *
   * @param array
   *		An array of 16 floats in column-major format (translation in elements 12, 13 and 14).
   */
  constructor(array: number[]);

  /**
   * Constructor instantiates a new <code>Matrix</code> that is set to the
   * provided matrix. This constructor copies a given Matrix. If the provided
   * matrix is null, the constructor sets the matrix to the identity.
   *
   * @param mat
   *            the matrix to copy.
   */
  constructor(mat: Matrix4);


  /**
   * constructs a matrix with the given values.
   */
  constructor(
    n00: number,
    m01: number,
    m02: number,
    m03: number,
    m10: number,
    m11: number,
    m12: number,
    m13: number,
    m20: number,
    m21: number,
    m22: number,
    m23: number,
    m30: number,
    m31: number,
    m32: number,
    m33: number
  );

  constructor(
    arg1?: number|number[]|Matrix4,
    m01?: number,
    m02?: number,
    m03?: number,
    m10?: number,
    m11?: number,
    m12?: number,
    m13?: number,
    m20?: number,
    m21?: number,
    m22?: number,
    m23?: number,
    m30?: number,
    m31?: number,
    m32?: number,
    m33?: number
  ) {
    if (arg1 instanceof Matrix4) {
      this.copy(arg1)
    } if (isNumberArray(arg1) && (arg1 as number[]).length === 16) {
      this.setFromArray(arg1 as number[])
    } else if (
      isNumber(arg1) &&
      isNumber(m01) &&
      isNumber(m02) &&
      isNumber(m03) &&
      isNumber(m10) &&
      isNumber(m11) &&
      isNumber(m12) &&
      isNumber(m13) &&
      isNumber(m20) &&
      isNumber(m21) &&
      isNumber(m22) &&
      isNumber(m23) &&
      isNumber(m30) &&
      isNumber(m31) &&
      isNumber(m32) &&
      isNumber(m33)
    ) {
      this.m00 = arg1 as number;
      this.m01 = m01;
      this.m02 = m02;
      this.m03 = m03;
      this.m10 = m10;
      this.m11 = m11;
      this.m12 = m12;
      this.m13 = m13;
      this.m20 = m20;
      this.m21 = m21;
      this.m22 = m22;
      this.m23 = m23;
      this.m30 = m30;
      this.m31 = m31;
      this.m32 = m32;
      this.m33 = m33;
    } else {
      this.loadIdentity();
    }
  }

  /**
   * <code>copy</code> transfers the contents of a given matrix to this
   * matrix. If a null matrix is supplied, this matrix is set to the identity
   * matrix.
   *
   * @param matrix
   *            the matrix to copy.
   */
  public copy(matrix: Matrix4): void {
    if (null == matrix) {
      this.loadIdentity();
    } else {
      this.m00 = matrix.m00;
      this.m01 = matrix.m01;
      this.m02 = matrix.m02;
      this.m03 = matrix.m03;
      this.m10 = matrix.m10;
      this.m11 = matrix.m11;
      this.m12 = matrix.m12;
      this.m13 = matrix.m13;
      this.m20 = matrix.m20;
      this.m21 = matrix.m21;
      this.m22 = matrix.m22;
      this.m23 = matrix.m23;
      this.m30 = matrix.m30;
      this.m31 = matrix.m31;
      this.m32 = matrix.m32;
      this.m33 = matrix.m33;
    }
  }

  public fromFrame(location: Vector3, direction: Vector3, up: Vector3): void {
    const fwdVector: Vector3 = direction.clone();
    const leftVector: Vector3 = fwdVector.crossLocalVec(up);
    const upVector: Vector3 = leftVector.crossLocalVec(fwdVector);

    this.m00 = leftVector.x;
    this.m01 = leftVector.y;
    this.m02 = leftVector.z;
    this.m03 = -leftVector.dot(location);

    this.m10 = upVector.x;
    this.m11 = upVector.y;
    this.m12 = upVector.z;
    this.m13 = -upVector.dot(location);

    this.m20 = -fwdVector.x;
    this.m21 = -fwdVector.y;
    this.m22 = -fwdVector.z;
    this.m23 = fwdVector.dot(location);

    this.m30 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;
  }

  /**
   * <code>get</code> retrieves the values of this object into
   * a float array in row-major order.
   *
   * @param matrix
   *            the matrix to set the values into.
   */
  public fillArray(matrix: number[]): void;
  /**
   * <code>set</code> retrieves the values of this object into
   * a float array.
   *
   * @param matrix
   *            the matrix to set the values into.
   * @param rowMajor
   *            whether the outgoing data is in row or column major order.
   */
  public fillArray(matrix: number[], rowMajor: boolean): void;

  /**
   * Implementation
   */
  public fillArray(matrix: number[], rowMajor: boolean = true): void {
    if (matrix.length !== 16) {
      throw new Error("Array must be of size 16.");
    }

    if (rowMajor) {
      matrix[0] = this.m00;
      matrix[1] = this.m01;
      matrix[2] = this.m02;
      matrix[3] = this.m03;
      matrix[4] = this.m10;
      matrix[5] = this.m11;
      matrix[6] = this.m12;
      matrix[7] = this.m13;
      matrix[8] = this.m20;
      matrix[9] = this.m21;
      matrix[10] = this.m22;
      matrix[11] = this.m23;
      matrix[12] = this.m30;
      matrix[13] = this.m31;
      matrix[14] = this.m32;
      matrix[15] = this.m33;
    } else {
      matrix[0] = this.m00;
      matrix[4] = this.m01;
      matrix[8] = this.m02;
      matrix[12] = this.m03;
      matrix[1] = this.m10;
      matrix[5] = this.m11;
      matrix[9] = this.m12;
      matrix[13] = this.m13;
      matrix[2] = this.m20;
      matrix[6] = this.m21;
      matrix[10] = this.m22;
      matrix[14] = this.m23;
      matrix[3] = this.m30;
      matrix[7] = this.m31;
      matrix[11] = this.m32;
      matrix[15] = this.m33;
    }
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
          case 3:
            return this.m03;
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
          case 3:
            return this.m13;
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
          case 3:
            return this.m23;
        }
        break;
      case 3:
        switch (j) {
          case 0:
            return this.m30;
          case 1:
            return this.m31;
          case 2:
            return this.m32;
          case 3:
            return this.m33;
        }
    }

    Matrix4.logger.warning("Invalid matrix index.");
    throw new Error("Invalid indices into matrix.");
  }

  /**
   * <code>getColumn</code> returns one of three columns specified by the
   * parameter. This column is returned as a float array of length 4.
   *
   * @param i
   *            the column to retrieve. Must be between 0 and 3.
   * @return the column specified by the index.
   */
  public getColumn(i: number): number[];

  /**
   * <code>getColumn</code> returns one of three columns specified by the
   * parameter. This column is returned as a float[4].
   *
   * @param i
   *            the column to retrieve. Must be between 0 and 3.
   * @param store
   *            the float array to store the result in. if null, a new one
   *            is created.
   * @return the column specified by the index.
   */
  public getColumn(i: number, store: number[]): number[];

  /**
   * Implementation
   */
  public getColumn(i: number, store?: number[]): number[] {
    if (!store) {
      store = []
    }
    switch (i) {
      case 0:
        store[0] = this.m00;
        store[1] = this.m10;
        store[2] = this.m20;
        store[3] = this.m30;
        break;
      case 1:
        store[0] = this.m01;
        store[1] = this.m11;
        store[2] = this.m21;
        store[3] = this.m31;
        break;
      case 2:
        store[0] = this.m02;
        store[1] = this.m12;
        store[2] = this.m22;
        store[3] = this.m32;
        break;
      case 3:
        store[0] = this.m03;
        store[1] = this.m13;
        store[2] = this.m23;
        store[3] = this.m33;
        break;
      default:
        Matrix4.logger.warning("Invalid column index.");
        throw new Error("Invalid column index. " + i);
    }
    return store;
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
   */
  public setColumn(i: number, column: number[]): void {
    if (!column) {
      Matrix4.logger.warning("Column is null. Ignoring.");
      return;
    }
    switch (i) {
      case 0:
        this.m00 = column[0];
        this.m10 = column[1];
        this.m20 = column[2];
        this.m30 = column[3];
        break;
      case 1:
        this.m01 = column[0];
        this.m11 = column[1];
        this.m21 = column[2];
        this.m31 = column[3];
        break;
      case 2:
        this.m02 = column[0];
        this.m12 = column[1];
        this.m22 = column[2];
        this.m32 = column[3];
        break;
      case 3:
        this.m03 = column[0];
        this.m13 = column[1];
        this.m23 = column[2];
        this.m33 = column[3];
        break;
      default:
        Matrix4.logger.warning("Invalid column index.");
        throw new Error("Invalid column index. " + i);
    }
  }

  /**
   * <code>setElement</code> places a given value into the matrix at the given
   * position. If the position is invalid a <code>JmeException</code> is
   * thrown.
   *
   * @param i
   *            the row index.
   * @param j
   *            the colum index.
   * @param value
   *            the value for (i, j).
   */
  public setElement(i: number, j: number, value: number): void {
    switch (i) {
      case 0:
        switch (j) {
          case 0:
            this.m00 = value;
            return;
          case 1:
            this.m01 = value;
            return;
          case 2:
            this.m02 = value;
            return;
          case 3:
            this.m03 = value;
            return;
        }
        break;
      case 1:
        switch (j) {
          case 0:
            this.m10 = value;
            return;
          case 1:
            this.m11 = value;
            return;
          case 2:
            this.m12 = value;
            return;
          case 3:
            this.m13 = value;
            return;
        }
        break;
      case 2:
        switch (j) {
          case 0:
            this.m20 = value;
            return;
          case 1:
            this.m21 = value;
            return;
          case 2:
            this.m22 = value;
            return;
          case 3:
            this.m23 = value;
            return;
        }
        break;
      case 3:
        switch (j) {
          case 0:
            this.m30 = value;
            return;
          case 1:
            this.m31 = value;
            return;
          case 2:
            this.m32 = value;
            return;
          case 3:
            this.m33 = value;
            return;
        }
    }

    Matrix4.logger.warning("Invalid matrix index.");
    throw new Error("Invalid indices into matrix.");
  }

  /**
   * <code>setFrom2DArray</code> sets the values of this matrix from an array of
   * values.
   *
   * @param matrix
   *            the matrix to set the value to.
   * @throws JmeException
   *             if the array is not of size 16.
   */
  public setFrom2DArray(matrix: number[][]): Matrix4 {
    if (matrix.length != 4 || matrix[0].length != 4) {
      throw new Error("Array must be of size 16.");
    }

    this.m00 = matrix[0][0];
    this.m01 = matrix[0][1];
    this.m02 = matrix[0][2];
    this.m03 = matrix[0][3];
    this.m10 = matrix[1][0];
    this.m11 = matrix[1][1];
    this.m12 = matrix[1][2];
    this.m13 = matrix[1][3];
    this.m20 = matrix[2][0];
    this.m21 = matrix[2][1];
    this.m22 = matrix[2][2];
    this.m23 = matrix[2][3];
    this.m30 = matrix[3][0];
    this.m31 = matrix[3][1];
    this.m32 = matrix[3][2];
    this.m33 = matrix[3][3];

    return this;
  }


  /**
   * Sets the values of this matrix
   */
  public set(
    m00: number, m01: number, m02: number, m03: number,
    m10: number, m11: number, m12: number, m13: number,
    m20: number, m21: number, m22: number, m23: number,
    m30: number, m31: number, m32: number, m33: number
  ): void {

    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m03 = m03;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m13 = m13;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
    this.m23 = m23;
    this.m30 = m30;
    this.m31 = m31;
    this.m32 = m32;
    this.m33 = m33;
  }

  /**
   * <code>set</code> sets the values of this matrix from an array of
   * values assuming that the data is rowMajor order;
   *
   * @param matrix
   *            the matrix to set the value to.
   */
  public setFromArray(matrix: number[]): void;

  /**
   * <code>set</code> sets the values of this matrix from an array of
   * values;
   *
   * @param matrix
   *            the matrix to set the value to.
   * @param rowMajor
   *            whether the incoming data is in row or column major order.
   */
  public setFromArray(matrix: number[], rowMajor: boolean = true): void {
    if (matrix.length !== 16) {
      throw new Error("Array must be of size 16.");
    }

    if (rowMajor) {
      this.m00 = matrix[0];
      this.m01 = matrix[1];
      this.m02 = matrix[2];
      this.m03 = matrix[3];
      this.m10 = matrix[4];
      this.m11 = matrix[5];
      this.m12 = matrix[6];
      this.m13 = matrix[7];
      this.m20 = matrix[8];
      this.m21 = matrix[9];
      this.m22 = matrix[10];
      this.m23 = matrix[11];
      this.m30 = matrix[12];
      this.m31 = matrix[13];
      this.m32 = matrix[14];
      this.m33 = matrix[15];
    } else {
      this.m00 = matrix[0];
      this.m01 = matrix[4];
      this.m02 = matrix[8];
      this.m03 = matrix[12];
      this.m10 = matrix[1];
      this.m11 = matrix[5];
      this.m12 = matrix[9];
      this.m13 = matrix[13];
      this.m20 = matrix[2];
      this.m21 = matrix[6];
      this.m22 = matrix[10];
      this.m23 = matrix[14];
      this.m30 = matrix[3];
      this.m31 = matrix[7];
      this.m32 = matrix[11];
      this.m33 = matrix[15];
    }
  }

  public transpose(): Matrix4 {
    const tmp: number[] = [];
    this.fillArray(tmp, true);
    return new Matrix4(tmp);
  }

  /**
   * <code>transpose</code> locally transposes this Matrix.
   *
   * @return this object for chaining.
   */
  public transposeLocal(): Matrix4 {
    let tmp: number = this.m01;
    this.m01 = this.m10;
    this.m10 = tmp;

    tmp = this.m02;
    this.m02 = this.m20;
    this.m20 = tmp;

    tmp = this.m03;
    this.m03 = this.m30;
    this.m30 = tmp;

    tmp = this.m12;
    this.m12 = this.m21;
    this.m21 = tmp;

    tmp = this.m13;
    this.m13 = this.m31;
    this.m31 = tmp;

    tmp = this.m23;
    this.m23 = this.m32;
    this.m32 = tmp;

    return this;
  }

  /**
   * <code>toFloatBuffer</code> returns a FloatBuffer object that contains
   * the matrix data.
   *
   * @return matrix data as a FloatBuffer.
   */
  public toFloatBuffer(): Float32Array;

  /**
   * <code>toFloatBuffer</code> returns a FloatBuffer object that contains the
   * matrix data.
   *
   * @param columnMajor
   *            if true, this buffer should be filled with column major data,
   *            otherwise it will be filled row major.
   * @return matrix data as a FloatBuffer. The position is set to 0 for
   *         convenience.
   */
  public toFloatBuffer(columnMajor: boolean): Float32Array;

  /**
   * Implementation
   */
  public toFloatBuffer(columnMajor: boolean = false): Float32Array {
    const fb: Float32Array = new Float32Array(16);
    if (columnMajor) {
      fb[0] = this.m00;
      fb[1] = this.m10;
      fb[2] = this.m20;
      fb[3] = this.m30;
      fb[4] = this.m01;
      fb[5] = this.m11;
      fb[6] = this.m21;
      fb[7] = this.m31;
      fb[8] = this.m02;
      fb[9] = this.m12;
      fb[10] = this.m22;
      fb[11] = this.m32;
      fb[12] = this.m03;
      fb[13] = this.m13;
      fb[14] = this.m23;
      fb[15] = this.m33;
    } else {
      fb[0] = this.m00;
      fb[1] = this.m01;
      fb[2] = this.m02;
      fb[3] = this.m03;
      fb[4] = this.m10;
      fb[5] = this.m11;
      fb[6] = this.m12;
      fb[7] = this.m13;
      fb[8] = this.m20;
      fb[9] = this.m21;
      fb[10] = this.m22;
      fb[11] = this.m23;
      fb[12] = this.m30;
      fb[13] = this.m31;
      fb[14] = this.m32;
      fb[15] = this.m33;
    }
    return fb;
  }

  /**
   * <code>fillFloatBuffer</code> fills a FloatBuffer object with
   * the matrix data.
   * @param fb the buffer to fill, must be correct size
   * @return matrix data as a FloatBuffer.
   */
  public fillFloatBuffer(fb: Float32Array): Float32Array;

  /**
   * <code>fillFloatBuffer</code> fills a FloatBuffer object with the matrix
   * data.
   *
   * @param fb
   *            the buffer to fill, starting at current position. Must have
   *            room for 16 more floats.
   * @param columnMajor
   *            if true, this buffer should be filled with column major data,
   *            otherwise it will be filled row major.
   * @return matrix data as a FloatBuffer. (position is advanced by 16 and any
   *         limit set is not changed).
   */
  public fillFloatBuffer(fb: Float32Array, columnMajor: boolean): Float32Array;

  /**
   * Implementation
   */
  public fillFloatBuffer(fb: Float32Array, columnMajor: boolean = false): Float32Array {
    if (columnMajor) {
       fb[0] = this.m00;
       fb[1] = this.m10;
       fb[2] = this.m20;
       fb[3] = this.m30;
       fb[4] = this.m01;
       fb[5] = this.m11;
       fb[6] = this.m21;
       fb[7] = this.m31;
       fb[8] = this.m02;
       fb[9] = this.m12;
       fb[10] = this.m22;
       fb[11] = this.m32;
       fb[12] = this.m03;
       fb[13] = this.m13;
       fb[14] = this.m23;
       fb[15] = this.m33;
    } else {
       fb[0] = this.m00;
       fb[1] = this.m01;
       fb[2] = this.m02;
       fb[3] = this.m03;
       fb[4] = this.m10;
       fb[5] = this.m11;
       fb[6] = this.m12;
       fb[7] = this.m13;
       fb[8] = this.m20;
       fb[9] = this.m21;
       fb[10] = this.m22;
       fb[11] = this.m23;
       fb[12] = this.m30;
       fb[13] = this.m31;
       fb[14] = this.m32;
       fb[15] = this.m33;
    }

    return fb;
  }

  /**
   * <code>readFloatBuffer</code> reads value for this matrix from a FloatBuffer.
   * @param fb the buffer to read from, must be correct size
   * @return this data as a FloatBuffer.
   */
  public readFloatBuffer(fb: Float32Array): Matrix4;

  /**
   * <code>readFloatBuffer</code> reads value for this matrix from a FloatBuffer.
   * @param fb the buffer to read from, must be correct size
   * @param columnMajor if true, this buffer should be filled with column
   * 		major data, otherwise it will be filled row major.
   * @return this data as a FloatBuffer.
   */
  public readFloatBuffer(fb: Float32Array, columnMajor: boolean): Matrix4;

  /**
   * Implementation
   */
  public readFloatBuffer(fb: Float32Array, columnMajor: boolean = false): Matrix4 {

    if (columnMajor) {
      this.m00 = fb[0];
      this.m10 = fb[1];
      this.m20 = fb[2];
      this.m30 = fb[3];
      this.m01 = fb[4];
      this.m11 = fb[5];
      this.m21 = fb[6];
      this.m31 = fb[7];
      this.m02 = fb[8];
      this.m12 = fb[9];
      this.m22 = fb[10];
      this.m32 = fb[11];
      this.m03 = fb[12];
      this.m13 = fb[13];
      this.m23 = fb[14];
      this.m33 = fb[15];
    } else {
      this.m00 = fb[0];
      this.m01 = fb[1];
      this.m02 = fb[2];
      this.m03 = fb[3];
      this.m10 = fb[4];
      this.m11 = fb[5];
      this.m12 = fb[6];
      this.m13 = fb[7];
      this.m20 = fb[8];
      this.m21 = fb[9];
      this.m22 = fb[10];
      this.m23 = fb[11];
      this.m30 = fb[12];
      this.m31 = fb[13];
      this.m32 = fb[14];
      this.m33 = fb[15];
    }
    return this;
  }

  /**
   * <code>loadIdentity</code> sets this matrix to the identity matrix,
   * namely all zeros with ones along the diagonal.
   *
   */
  public loadIdentity(): void {
    this.m01 = this.m02 = this.m03 = 0.0;
    this.m10 = this.m12 = this.m13 = 0.0;
    this.m20 = this.m21 = this.m23 = 0.0;
    this.m30 = this.m31 = this.m32 = 0.0;
    this.m00 = this.m11 = this.m22 = this.m33 = 1.0;
  }

  public fromFrustum(near: number, far: number, left: number, right: number, top: number, bottom: number, parallel: boolean): void {
    this.loadIdentity();
    if (parallel) {
      // scale
      this.m00 = 2.0 / (right - left);
      //m11 = 2.0f / (bottom - top);
      this.m11 = 2.0 / (top - bottom);
      this.m22 = -2.0 / (far - near);
      this.m33 = 1;

      // translation
      this.m03 = -(right + left) / (right - left);
      //m31 = -(bottom + top) / (bottom - top);
      this.m13 = -(top + bottom) / (top - bottom);
      this.m23 = -(far + near) / (far - near);
    } else {
      this.m00 = (2.0 * near) / (right - left);
      this.m11 = (2.0 * near) / (top - bottom);
      this.m32 = -1.0;
      this.m33 = -0.0;

      // A
      this.m02 = (right + left) / (right - left);

      // B
      this.m12 = (top + bottom) / (top - bottom);

      // C
      this.m22 = -(far + near) / (far - near);

      // D
      this.m23 = -(2.0 * far * near) / (far - near);
    }
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
    this.zero();
    this.m33 = 1;

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
   * <code>mult</code> multiplies this matrix by a scalar.
   *
   * @param scalar
   *            the scalar to multiply this matrix by.
   */
  public multScalarLocal(scalar: number): void{
    this.m00 *= scalar;
    this.m01 *= scalar;
    this.m02 *= scalar;
    this.m03 *= scalar;
    this.m10 *= scalar;
    this.m11 *= scalar;
    this.m12 *= scalar;
    this.m13 *= scalar;
    this.m20 *= scalar;
    this.m21 *= scalar;
    this.m22 *= scalar;
    this.m23 *= scalar;
    this.m30 *= scalar;
    this.m31 *= scalar;
    this.m32 *= scalar;
    this.m33 *= scalar;
  }

  public multScalar(scalar: number): Matrix4;

  public multScalar(scalar: number, store: Matrix4): Matrix4;

  /**
   * Implementation
   */
  public multScalar(scalar: number, store?: Matrix4): Matrix4 {
    if (!store) {
      const out: Matrix4 = new Matrix4();
    }
    store.copy(this);
    store.multScalarLocal(scalar);
    return store;
  }

  /**
   * <code>mult</code> multiplies this matrix with another matrix. The
   * result matrix will then be returned. This matrix will be on the left hand
   * side, while the parameter matrix will be on the right.
   *
   * @param in2
   *            the matrix to multiply this matrix by.
   * @return the resultant matrix
   */
  public mult(in2: Matrix4): Matrix4;

  /**
   * <code>mult</code> multiplies this matrix with another matrix. The
   * result matrix will then be returned. This matrix will be on the left hand
   * side, while the parameter matrix will be on the right.
   *
   * @param in2
   *            the matrix to multiply this matrix by.
   * @param store
   *            where to store the result. It is safe for in2 and store to be
   *            the same object.
   * @return the resultant matrix
   */
  public mult(in2: Matrix4, store: Matrix4): Matrix4;

  public mult(in2: Matrix4, store?: Matrix4): Matrix4 {
    if (store == null) {
      store = new Matrix4();
    }

    const m: number[] = [];

    m[0] = this.m00 * in2.m00
      + this.m01 * in2.m10
      + this.m02 * in2.m20
      + this.m03 * in2.m30;
    m[1] = this.m00 * in2.m01
      + this.m01 * in2.m11
      + this.m02 * in2.m21
      + this.m03 * in2.m31;
    m[2] = this.m00 * in2.m02
      + this.m01 * in2.m12
      + this.m02 * in2.m22
      + this.m03 * in2.m32;
    m[3] = this.m00 * in2.m03
      + this.m01 * in2.m13
      + this.m02 * in2.m23
      + this.m03 * in2.m33;

    m[4] = this.m10 * in2.m00
      + this.m11 * in2.m10
      + this.m12 * in2.m20
      + this.m13 * in2.m30;
    m[5] = this.m10 * in2.m01
      + this.m11 * in2.m11
      + this.m12 * in2.m21
      + this.m13 * in2.m31;
    m[6] = this.m10 * in2.m02
      + this.m11 * in2.m12
      + this.m12 * in2.m22
      + this.m13 * in2.m32;
    m[7] = this.m10 * in2.m03
      + this.m11 * in2.m13
      + this.m12 * in2.m23
      + this.m13 * in2.m33;

    m[8] = this.m20 * in2.m00
      + this.m21 * in2.m10
      + this.m22 * in2.m20
      + this.m23 * in2.m30;
    m[9] = this.m20 * in2.m01
      + this.m21 * in2.m11
      + this.m22 * in2.m21
      + this.m23 * in2.m31;
    m[10] =this. m20 * in2.m02
      + this.m21 * in2.m12
      + this.m22 * in2.m22
      + this.m23 * in2.m32;
    m[11] =this. m20 * in2.m03
      + this.m21 * in2.m13
      + this.m22 * in2.m23
      + this.m23 * in2.m33;

    m[12] =this. m30 * in2.m00
      + this.m31 * in2.m10
      + this.m32 * in2.m20
      + this.m33 * in2.m30;
    m[13] =this. m30 * in2.m01
      + this.m31 * in2.m11
      + this.m32 * in2.m21
      + this.m33 * in2.m31;
    m[14] =this. m30 * in2.m02
      + this.m31 * in2.m12
      + this.m32 * in2.m22
      + this.m33 * in2.m32;
    m[15] = this.m30 * in2.m03
      + this.m31 * in2.m13
      + this.m32 * in2.m23
      + this.m33 * in2.m33;


    store.m00 = m[0];
    store.m01 = m[1];
    store.m02 = m[2];
    store.m03 = m[3];
    store.m10 = m[4];
    store.m11 = m[5];
    store.m12 = m[6];
    store.m13 = m[7];
    store.m20 = m[8];
    store.m21 = m[9];
    store.m22 = m[10];
    store.m23 = m[11];
    store.m30 = m[12];
    store.m31 = m[13];
    store.m32 = m[14];
    store.m33 = m[15];

    return store;
  }

  /**
   * <code>multLocal</code> multiplies this matrix with another matrix. The
   * results are stored internally and a handle to this matrix will
   * then be returned. This matrix will be on the left hand
   * side, while the parameter matrix will be on the right.
   *
   * @param in2
   *            the matrix to multiply this matrix by.
   * @return the resultant matrix
   */
  public multLocal(in2: Matrix4): Matrix4 {
    return this.mult(in2, this);
  }

  /**
   * <code>mult</code> multiplies a vector about a rotation matrix. The
   * resulting vector is returned as a new Vector3f.
   *
   * @param vec
   *            vec to multiply against.
   * @return the rotated vector.
   */
  public multVec3(vec: Vector3): Vector3;

  /**
   * <code>mult</code> multiplies a vector about a rotation matrix and adds
   * translation. The resulting vector is returned.
   *
   * @param vec
   *            vec to multiply against.
   * @param store
   *            a vector to store the result in. Created if null is passed.
   * @return the rotated vector.
   */
  public multVec3(vec: Vector3, store: Vector3): Vector3;

  /**
   * Implementation
   */
  public multVec3(vec: Vector3, store?: Vector3): Vector3 {
    if (!store) {
      store = new Vector3();
    }

    const vx: number = vec.x;
    const vy: number = vec.y;
    const vz: number = vec.z;
    store.x = this.m00 * vx + this.m01 * vy + this.m02 * vz + this.m03;
    store.y = this.m10 * vx + this.m11 * vy + this.m12 * vz + this.m13;
    store.z = this.m20 * vx + this.m21 * vy + this.m22 * vz + this.m23;

    return store;
  }

  /**
   * <code>mult</code> multiplies a <code>Vector4f</code> about a rotation
   * matrix. The resulting vector is returned as a new <code>Vector4f</code>.
   *
   * @param vec
   *            vec to multiply against.
   * @return the rotated vector.
   */
  public multVec4(vec: Vector4): Vector4;

  /**
   * <code>mult</code> multiplies a <code>Vector4f</code> about a rotation
   * matrix. The resulting vector is returned.
   *
   * @param vec
   *            vec to multiply against.
   * @param store
   *            a vector to store the result in. Created if null is passed.
   * @return the rotated vector.this.
   */
  public multVec4(vec: Vector4, store?: Vector4): Vector4 {
    if (vec) {
      Matrix4.logger.warning("Source vector is null, null result returned.");
      return;
    }
    if (!store) {
      store = new Vector4();
    }

    const vx: number = vec.x;
    const vy: number = vec.y;
    const vz: number = vec.z;
    const vw: number = vec.w;
    store.x = this.m00 * vx + this.m01 * vy +this. m02 * vz + this.m03 * vw;
    store.y = this.m10 * vx + this.m11 * vy +this. m12 * vz + this.m13 * vw;
    store.z = this.m20 * vx + this.m21 * vy +this. m22 * vz + this.m23 * vw;
    store.w = this.m30 * vx + this.m31 * vy +this. m32 * vz + this.m33 * vw;

    return store;
  }

  /**
   * <code>multAcrossVec4</code> multiplies a vector about a rotation matrix. The
   * resulting vector is returned.
   *
   * @param vec
   *            vec to multiply against.
   *
   * @return the rotated vector.
   */
  public multAcrossVec4(vec: Vector4): Vector4;
  /**
   * <code>multAcrossVec4</code> multiplies a vector about a rotation matrix. The
   * resulting vector is returned.
   *
   * @param vec
   *            vec to multiply against.
   * @param store
   *            a vector to store the result in.  created if null is passed.
   * @return the rotated vector.
   */
  public multAcrossVec4(vec: Vector4, store: Vector4): Vector4;

  /**
   * Implementation
   */
  public multAcrossVec4(vec: Vector4, store?: Vector4): Vector4 {
    if (!vec) {
      Matrix4.logger.warning("Source vector is null, null result returned.");
      return;
    }
    if (store == null) {
      store = new Vector4();
    }

    const vx: number = vec.x;
    const vy: number = vec.y;
    const vz: number = vec.z;
    const vw: number = vec.w;
    store.x = this.m00 * vx + this.m10 * vy + this.m20 * vz + this.m30 * vw;
    store.y = this.m01 * vx + this.m11 * vy + this.m21 * vz + this.m31 * vw;
    store.z = this.m02 * vx + this.m12 * vy + this.m22 * vz + this.m32 * vw;
    store.w = this.m03 * vx + this.m13 * vy + this.m23 * vz + this.m33 * vw;

    return store;
  }

  /**
   * <code>multNormal</code> multiplies a vector about a rotation matrix, but
   * does not add translation. The resulting vector is returned.
   *
   * @param vec
   *            vec to multiply against.
   * @param store
   *            a vector to store the result in. Created if null is passed.
   * @return the rotated vector.
   */
  public multNormal(vec: Vector3): Vector3;
  public multNormal(vec: Vector3, store: Vector3): Vector3;
  public multNormal(vec: Vector3, store?: Vector3): Vector3 {
    if (!store) {
      store = new Vector3();
    }

    const vx: number = vec.x;
    const vy: number = vec.y;
    const vz: number = vec.z;
    store.x = this.m00 * vx + this.m01 * vy + this.m02 * vz;
    store.y = this.m10 * vx + this.m11 * vy + this.m12 * vz;
    store.z = this.m20 * vx + this.m21 * vy + this.m22 * vz;

    return store;
  }

  /**
   * <code>multNormal</code> multiplies a vector about a rotation matrix, but
   * does not add translation. The resulting vector is returned.
   *
   * @param vec
   *            vec to multiply against.
   * @param store
   *            a vector to store the result in. Created if null is passed.
   * @return the rotated vector.
   */
  public multNormalAcross(vec: Vector3): Vector3;
  public multNormalAcross(vec: Vector3, store: Vector3): Vector3;
  public multNormalAcross(vec: Vector3, store?: Vector3): Vector3 {
    if (!store) {
      store = new Vector3();
    }

    const vx = vec.x;
    const vy = vec.y;
    const vz = vec.z;
    store.x = this.m00 * vx + this.m10 * vy + this.m20 * vz;
    store.y = this.m01 * vx + this.m11 * vy + this.m21 * vz;
    store.z = this.m02 * vx + this.m12 * vy + this.m22 * vz;

    return store;
  }

  /**
   * <code>mult</code> multiplies a vector about a rotation matrix and adds
   * translation. The w value is returned as a result of
   * multiplying the last column of the matrix by 1.0
   *
   * @param vec
   *            vec to multiply against.
   * @param store
   *            a vector to store the result in.
   * @return the W value
   */
  public multProj(vec: Vector3, store: Vector3): number {
    const vx: number = vec.x;
    const vy: number = vec.y;
    const vz: number = vec.z;
    store.x = this.m00 * vx + this.m01 * vy + this.m02 * vz + this.m03;
    store.y = this.m10 * vx + this.m11 * vy + this.m12 * vz + this.m13;
    store.z = this.m20 * vx + this.m21 * vy + this.m22 * vz + this.m23;
    return this.m30 * vx + this.m31 * vy + this.m32 * vz + this.m33;
  }

  /**
   * <code>mult</code> multiplies a vector about a rotation matrix. The
   * resulting vector is returned.
   *
   * @param vec
   *            vec to multiply against.
   * @param store
   *            a vector to store the result in.  created if null is passed.
   * @return the rotated vector.
   */
  public multAcrossVec3(vec: Vector3): Vector3;
  public multAcrossVec3(vec: Vector3, store: Vector3): Vector3;
  public multAcrossVec3(vec: Vector3, store?: Vector3): Vector3 {
    if (!vec) {
      Matrix4.logger.warning("Source vector is null, null result returned.");
      return;
    }
    if (!store) {
      store = new Vector3();
    }

    const vx = vec.x;
    const vy = vec.y;
    const vz = vec.z;
    store.x = this.m00 * vx + this.m10 * vy + this.m20 * vz + this.m30;
    store.y = this.m01 * vx + this.m11 * vy + this.m21 * vz + this.m31;
    store.z = this.m02 * vx + this.m12 * vy + this.m22 * vz + this.m32;

    return store;
  }

  /**
   * <code>mult</code> multiplies a quaternion about a matrix. The
   * resulting vector is returned.
   *
   * @param vec
   *            vec to multiply against.
   * @param store
   *            a quaternion to store the result in.  created if null is passed.
   * @return store = this * vec
   */
  public multQuat(vec: Quaternion, store: Quaternion): Quaternion {

    if (null == vec) {
      Matrix4.logger.warning("Source vector is null, null result returned.");
      return;
    }
    if (store == null) {
      store = new Quaternion();
    }

    const x: number = this.m00 * vec.x + this.m10 * vec.y + this.m20 * vec.z + this.m30 * vec.w;
    const y: number = this.m01 * vec.x + this.m11 * vec.y + this.m21 * vec.z + this.m31 * vec.w;
    const z: number = this.m02 * vec.x + this.m12 * vec.y + this.m22 * vec.z + this.m32 * vec.w;
    const w: number = this.m03 * vec.x + this.m13 * vec.y + this.m23 * vec.z + this.m33 * vec.w;
    store.x = x;
    store.y = y;
    store.z = z;
    store.w = w;

    return store;
  }

  /**
   * <code>mult</code> multiplies an array of 4 floats against this rotation
   * matrix. The results are stored directly in the array. (vec4f x mat4f)
   *
   * @param vec4
   *            float array (size 4) to multiply against the matrix.
   * @return the vec4f for chaining.
   */
  public multArray(vec4: number[]): number[] {
    if (!isNumberArray(vec4) || vec4.length !== 4) {
      Matrix4.logger.warning("invalid array given, must be nonnull and length 4");
      return;
    }

    const x: number = vec4[0];
    const y: number = vec4[1];
    const z: number = vec4[2];
    const w: number = vec4[3];

    vec4[0] = this.m00 * x + this.m01 * y + this.m02 * z + this.m03 * w;
    vec4[1] = this.m10 * x + this.m11 * y + this.m12 * z + this.m13 * w;
    vec4[2] = this.m20 * x + this.m21 * y + this.m22 * z + this.m23 * w;
    vec4[3] = this.m30 * x + this.m31 * y + this.m32 * z + this.m33 * w;

    return vec4;
  }

  /**
   * <code>mult</code> multiplies an array of 4 floats against this rotation
   * matrix. The results are stored directly in the array. (vec4f x mat4f)
   *
   * @param vec4
   *            float array (size 4) to multiply against the matrix.
   * @return the vec4f for chaining.
   */
  public multAcross(vec4: number[]): number[] {
    if (isNumberArray(vec4) || vec4.length !== 4) {
      Matrix4.logger.warning("invalid array given, must be nonnull and length 4");
      return;
    }

    const x: number = vec4[0];
    const y: number = vec4[1];
    const z: number = vec4[2];
    const w: number = vec4[3];

    vec4[0] = this.m00 * x + this.m10 * y + this.m20 * z + this.m30 * w;
    vec4[1] = this.m01 * x + this.m11 * y + this.m21 * z + this.m31 * w;
    vec4[2] = this.m02 * x + this.m12 * y + this.m22 * z + this.m32 * w;
    vec4[3] = this.m03 * x + this.m13 * y + this.m23 * z + this.m33 * w;

    return vec4;
  }

  /**
   * Inverts this matrix as a new Matrix4f.
   *
   * @return The new inverse matrix
   */
  public invert(): Matrix4;
  /**
   * Inverts this matrix and stores it in the given store.
   *
   * @return The store
   */
  public invert(store: Matrix4): Matrix4;

  /**
   * Implementation
   */
  public invert(store?: Matrix4): Matrix4 {
    if (!store) {
      store = new Matrix4();
    }

    const fA0: number = this.m00 * this.m11 - this.m01 * this.m10;
    const fA1: number = this.m00 * this.m12 - this.m02 * this.m10;
    const fA2: number = this.m00 * this.m13 - this.m03 * this.m10;
    const fA3: number = this.m01 * this.m12 - this.m02 * this.m11;
    const fA4: number = this.m01 * this.m13 - this.m03 * this.m11;
    const fA5: number = this.m02 * this.m13 - this.m03 * this.m12;
    const fB0: number = this.m20 * this.m31 - this.m21 * this.m30;
    const fB1: number = this.m20 * this.m32 - this.m22 * this.m30;
    const fB2: number = this.m20 * this.m33 - this.m23 * this.m30;
    const fB3: number = this.m21 * this.m32 - this.m22 * this.m31;
    const fB4: number = this.m21 * this.m33 - this.m23 * this.m31;
    const fB5: number = this.m22 * this.m33 - this.m23 * this.m32;
    const fDet: number = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;

    if (Math.abs(fDet) <= 0) {
      throw new Error("This matrix cannot be inverted");
    }

    store.m00 = +this.m11 * fB5 - this.m12 * fB4 + this.m13 * fB3;
    store.m10 = -this.m10 * fB5 + this.m12 * fB2 - this.m13 * fB1;
    store.m20 = +this.m10 * fB4 - this.m11 * fB2 + this.m13 * fB0;
    store.m30 = -this.m10 * fB3 + this.m11 * fB1 - this.m12 * fB0;
    store.m01 = -this.m01 * fB5 + this.m02 * fB4 - this.m03 * fB3;
    store.m11 = +this.m00 * fB5 - this.m02 * fB2 + this.m03 * fB1;
    store.m21 = -this.m00 * fB4 + this.m01 * fB2 - this.m03 * fB0;
    store.m31 = +this.m00 * fB3 - this.m01 * fB1 + this.m02 * fB0;
    store.m02 = +this.m31 * fA5 - this.m32 * fA4 + this.m33 * fA3;
    store.m12 = -this.m30 * fA5 + this.m32 * fA2 - this.m33 * fA1;
    store.m22 = +this.m30 * fA4 - this.m31 * fA2 + this.m33 * fA0;
    store.m32 = -this.m30 * fA3 + this.m31 * fA1 - this.m32 * fA0;
    store.m03 = -this.m21 * fA5 + this.m22 * fA4 - this.m23 * fA3;
    store.m13 = +this.m20 * fA5 - this.m22 * fA2 + this.m23 * fA1;
    store.m23 = -this.m20 * fA4 + this.m21 * fA2 - this.m23 * fA0;
    store.m33 = +this.m20 * fA3 - this.m21 * fA1 + this.m22 * fA0;

    const fInvDet: number = 1.0 / fDet;
    store.multScalarLocal(fInvDet);

    return store;
  }

  /**
   * Inverts this matrix locally.
   *
   * @return this
   */
  public invertLocal(): Matrix4 {

    const fA0: number = this.m00 * this.m11 - this.m01 * this.m10;
    const fA1: number = this.m00 * this.m12 - this.m02 * this.m10;
    const fA2: number = this.m00 * this.m13 - this.m03 * this.m10;
    const fA3: number = this.m01 * this.m12 - this.m02 * this.m11;
    const fA4: number = this.m01 * this.m13 - this.m03 * this.m11;
    const fA5: number = this.m02 * this.m13 - this.m03 * this.m12;
    const fB0: number = this.m20 * this.m31 - this.m21 * this.m30;
    const fB1: number = this.m20 * this.m32 - this.m22 * this.m30;
    const fB2: number = this.m20 * this.m33 - this.m23 * this.m30;
    const fB3: number = this.m21 * this.m32 - this.m22 * this.m31;
    const fB4: number = this.m21 * this.m33 - this.m23 * this.m31;
    const fB5: number = this.m22 * this.m33 - this.m23 * this.m32;
    const fDet = fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;

    if (Math.abs(fDet) <= 0) {
      return this.zero();
    }

    const f00: number = +this.m11 * fB5 - this.m12 * fB4 + this.m13 * fB3;
    const f10: number = -this.m10 * fB5 + this.m12 * fB2 - this.m13 * fB1;
    const f20: number = +this.m10 * fB4 - this.m11 * fB2 + this.m13 * fB0;
    const f30: number = -this.m10 * fB3 + this.m11 * fB1 - this.m12 * fB0;
    const f01: number = -this.m01 * fB5 + this.m02 * fB4 - this.m03 * fB3;
    const f11: number = +this.m00 * fB5 - this.m02 * fB2 + this.m03 * fB1;
    const f21: number = -this.m00 * fB4 + this.m01 * fB2 - this.m03 * fB0;
    const f31: number = +this.m00 * fB3 - this.m01 * fB1 + this.m02 * fB0;
    const f02: number = +this.m31 * fA5 - this.m32 * fA4 + this.m33 * fA3;
    const f12: number = -this.m30 * fA5 + this.m32 * fA2 - this.m33 * fA1;
    const f22: number = +this.m30 * fA4 - this.m31 * fA2 + this.m33 * fA0;
    const f32: number = -this.m30 * fA3 + this.m31 * fA1 - this.m32 * fA0;
    const f03: number = -this.m21 * fA5 + this.m22 * fA4 - this.m23 * fA3;
    const f13: number = +this.m20 * fA5 - this.m22 * fA2 + this.m23 * fA1;
    const f23: number = -this.m20 * fA4 + this.m21 * fA2 - this.m23 * fA0;
    const f33: number = +this.m20 * fA3 - this.m21 * fA1 + this.m22 * fA0;

    this.m00 = f00;
    this.m01 = f01;
    this.m02 = f02;
    this.m03 = f03;
    this.m10 = f10;
    this.m11 = f11;
    this.m12 = f12;
    this.m13 = f13;
    this.m20 = f20;
    this.m21 = f21;
    this.m22 = f22;
    this.m23 = f23;
    this.m30 = f30;
    this.m31 = f31;
    this.m32 = f32;
    this.m33 = f33;

    const fInvDet: number = 1.0 / fDet;
    this.multScalarLocal(fInvDet);

    return this;
  }

  /**
   * Returns a new matrix representing the adjoint of this matrix.
   *
   * @return The adjoint matrix
   */
  public adjoint(): Matrix4;


  /**
   * Places the adjoint of this matrix in store (creates store if null.)
   *
   * @param store
   *            The matrix to store the result in.  If null, a new matrix is created.
   * @return store
   */
  public adjoint(store: Matrix4): Matrix4;

  /**
   * Implementation
   */
  public adjoint(store?: Matrix4): Matrix4 {
    if (!store) {
      store = new Matrix4();
    }

    const fA0: number = this.m00 * this.m11 - this.m01 * this.m10;
    const fA1: number = this.m00 * this.m12 - this.m02 * this.m10;
    const fA2: number = this.m00 * this.m13 - this.m03 * this.m10;
    const fA3: number = this.m01 * this.m12 - this.m02 * this.m11;
    const fA4: number = this.m01 * this.m13 - this.m03 * this.m11;
    const fA5: number = this.m02 * this.m13 - this.m03 * this.m12;
    const fB0: number = this.m20 * this.m31 - this.m21 * this.m30;
    const fB1: number = this.m20 * this.m32 - this.m22 * this.m30;
    const fB2: number = this.m20 * this.m33 - this.m23 * this.m30;
    const fB3: number = this.m21 * this.m32 - this.m22 * this.m31;
    const fB4: number = this.m21 * this.m33 - this.m23 * this.m31;
    const fB5: number = this.m22 * this.m33 - this.m23 * this.m32;

    store.m00 = +this.m11 * fB5 - this.m12 * fB4 + this.m13 * fB3;
    store.m10 = -this.m10 * fB5 + this.m12 * fB2 - this.m13 * fB1;
    store.m20 = +this.m10 * fB4 - this.m11 * fB2 + this.m13 * fB0;
    store.m30 = -this.m10 * fB3 + this.m11 * fB1 - this.m12 * fB0;
    store.m01 = -this.m01 * fB5 + this.m02 * fB4 - this.m03 * fB3;
    store.m11 = +this.m00 * fB5 - this.m02 * fB2 + this.m03 * fB1;
    store.m21 = -this.m00 * fB4 + this.m01 * fB2 - this.m03 * fB0;
    store.m31 = +this.m00 * fB3 - this.m01 * fB1 + this.m02 * fB0;
    store.m02 = +this.m31 * fA5 - this.m32 * fA4 + this.m33 * fA3;
    store.m12 = -this.m30 * fA5 + this.m32 * fA2 - this.m33 * fA1;
    store.m22 = +this.m30 * fA4 - this.m31 * fA2 + this.m33 * fA0;
    store.m32 = -this.m30 * fA3 + this.m31 * fA1 - this.m32 * fA0;
    store.m03 = -this.m21 * fA5 + this.m22 * fA4 - this.m23 * fA3;
    store.m13 = +this.m20 * fA5 - this.m22 * fA2 + this.m23 * fA1;
    store.m23 = -this.m20 * fA4 + this.m21 * fA2 - this.m23 * fA0;
    store.m33 = +this.m20 * fA3 - this.m21 * fA1 + this.m22 * fA0;

    return store;
  }


  public setTransform(position: Vector3, scale: Vector3, rotMat: Matrix3): void {
    // Ordering:
    //    1. Scale
    //    2. Rotate
    //    3. Translate

    // Set up final matrix with scale, rotation and translation
    this.m00 = scale.x * rotMat.m00;
    this.m01 = scale.y * rotMat.m01;
    this.m02 = scale.z * rotMat.m02;
    this.m03 = position.x;
    this.m10 = scale.x * rotMat.m10;
    this.m11 = scale.y * rotMat.m11;
    this.m12 = scale.z * rotMat.m12;
    this.m13 = position.y;
    this.m20 = scale.x * rotMat.m20;
    this.m21 = scale.y * rotMat.m21;
    this.m22 = scale.z * rotMat.m22;
    this.m23 = position.z;

    // No projection term
    this.m30 = 0;
    this.m31 = 0;
    this.m32 = 0;
    this.m33 = 1;
  }

  /**
   * <code>determinant</code> generates the determinate of this matrix.
   *
   * @return the determinate
   */
  public determinant(): number {
    const fA0: number = this.m00 * this.m11 - this.m01 * this.m10;
    const fA1: number = this.m00 * this.m12 - this.m02 * this.m10;
    const fA2: number = this.m00 * this.m13 - this.m03 * this.m10;
    const fA3: number = this.m01 * this.m12 - this.m02 * this.m11;
    const fA4: number = this.m01 * this.m13 - this.m03 * this.m11;
    const fA5: number = this.m02 * this.m13 - this.m03 * this.m12;
    const fB0: number = this.m20 * this.m31 - this.m21 * this.m30;
    const fB1: number = this.m20 * this.m32 - this.m22 * this.m30;
    const fB2: number = this.m20 * this.m33 - this.m23 * this.m30;
    const fB3: number = this.m21 * this.m32 - this.m22 * this.m31;
    const fB4: number = this.m21 * this.m33 - this.m23 * this.m31;
    const fB5: number = this.m22 * this.m33 - this.m23 * this.m32;
    return fA0 * fB5 - fA1 * fB4 + fA2 * fB3 + fA3 * fB2 - fA4 * fB1 + fA5 * fB0;
  }

  /**
   * Sets all of the values in this matrix to zero.
   *
   * @return this matrix
   */
  public zero(): Matrix4 {
    this.m00 = this.m01 = this.m02 = this.m03 = 0.0;
    this.m10 = this.m11 = this.m12 = this.m13 = 0.0;
    this.m20 = this.m21 = this.m22 = this.m23 = 0.0;
    this.m30 = this.m31 = this.m32 = this.m33 = 0.0;
    return this;
  }

  public add(mat: Matrix4): Matrix4 {
    const result: Matrix4 = new Matrix4();
    result.m00 = this.m00 + mat.m00;
    result.m01 = this.m01 + mat.m01;
    result.m02 = this.m02 + mat.m02;
    result.m03 = this.m03 + mat.m03;
    result.m10 = this.m10 + mat.m10;
    result.m11 = this.m11 + mat.m11;
    result.m12 = this.m12 + mat.m12;
    result.m13 = this.m13 + mat.m13;
    result.m20 = this.m20 + mat.m20;
    result.m21 = this.m21 + mat.m21;
    result.m22 = this.m22 + mat.m22;
    result.m23 = this.m23 + mat.m23;
    result.m30 = this.m30 + mat.m30;
    result.m31 = this.m31 + mat.m31;
    result.m32 = this.m32 + mat.m32;
    result.m33 = this.m33 + mat.m33;
    return result;
  }

  /**
   * <code>add</code> adds the values of a parameter matrix to this matrix.
   *
   * @param mat
   *            the matrix to add to this.
   */
  public addLocal(mat: Matrix4): void {
    this.m00 += mat.m00;
    this.m01 += mat.m01;
    this.m02 += mat.m02;
    this.m03 += mat.m03;
    this.m10 += mat.m10;
    this.m11 += mat.m11;
    this.m12 += mat.m12;
    this.m13 += mat.m13;
    this.m20 += mat.m20;
    this.m21 += mat.m21;
    this.m22 += mat.m22;
    this.m23 += mat.m23;
    this.m30 += mat.m30;
    this.m31 += mat.m31;
    this.m32 += mat.m32;
    this.m33 += mat.m33;
  }

  public toTranslationVector(): Vector3;
  public toTranslationVector(vector: Vector3): Vector3;
  public toTranslationVector(vector?: Vector3): Vector3 {
    if (!vector) {
      return new Vector3(this.m03, this.m13, this.m23);
    }
    return vector.set(this.m03, this.m13, this.m23);
  }

  public toRotationQuat(): Quaternion
  public toRotationQuat(q: Quaternion): Quaternion;
  public toRotationQuat(q?: Quaternion): Quaternion {
    if (!q) {
      const quat: Quaternion = new Quaternion();
      quat.fromRotationMatrix(this.toRotationMatrix());
      return quat;
    }
    return q.fromRotationMatrix(this.m00, this.m01, this.m02, this.m10, this.m11, this.m12, this.m20, this.m21, this.m22);
  }

  public toRotationMatrix(): Matrix3;
  public toRotationMatrix(mat: Matrix3): Matrix3;
  public toRotationMatrix(mat?: Matrix3): Matrix3 {
    if (!mat) {
      return new Matrix3(this.m00, this.m01, this.m02, this.m10, this.m11, this.m12, this.m20, this.m21, this.m22);
    }
    mat.m00 = this.m00;
    mat.m01 = this.m01;
    mat.m02 = this.m02;
    mat.m10 = this.m10;
    mat.m11 = this.m11;
    mat.m12 = this.m12;
    mat.m20 = this.m20;
    mat.m21 = this.m21;
    mat.m22 = this.m22;
    return mat;
  }

  /**
   * Retreives the scale vector from the matrix.
   *
   * @return the scale vector
   */
  public toScaleVector(): Vector3;

  /**
   * Retreives the scale vector from the matrix and stores it into a given
   * vector.
   *
   * @param store the vector where the scale will be stored
   * @return the store vector
   */
  public toScaleVector(store: Vector3): Vector3;
  public toScaleVector(store?: Vector3): Vector3 {
    if (!store) {
      const result: Vector3 = new Vector3();
      this.toScaleVector(result);
      return result;
    }
    const scaleX: number = Math.sqrt(this.m00 * this.m00 + this.m10 * this.m10 + this.m20 * this.m20);
    const scaleY: number = Math.sqrt(this.m01 * this.m01 + this.m11 * this.m11 + this.m21 * this.m21);
    const scaleZ: number = Math.sqrt(this.m02 * this.m02 + this.m12 * this.m12 + this.m22 * this.m22);
    store.set(scaleX, scaleY, scaleZ);
    return store;
  }

  /**
   * Sets the scale.
   *
   * @param x
   *            the X scale
   * @param y
   *            the Y scale
   * @param z
   *            the Z scale
   */
  public setScale(x: number, y: number, z: number): void {
    let length: number = this.m00 * this.m00 + this.m10 * this.m10 + this.m20 * this.m20;
    if (length !== 0) {
      length = length == 1 ? x : (x / Math.sqrt(length));
      this.m00 *= length;
      this.m10 *= length;
      this.m20 *= length;
    }

    length = this.m01 * this.m01 + this.m11 * this.m11 + this.m21 * this.m21;
    if (length !== 0) {
      length = length == 1 ? y : (y / Math.sqrt(length));
      this.m01 *= length;
      this.m11 *= length;
      this.m21 *= length;
    }

    length = this.m02 * this.m02 + this.m12 * this.m12 + this.m22 * this.m22;
    if (length !== 0) {
      length = length == 1 ? z : (z / Math.sqrt(length));
      this.m02 *= length;
      this.m12 *= length;
      this.m22 *= length;
    }
  }

  /**
   * Sets the scale.
   *
   * @param scale
   *            the scale vector to set
   */
  public setScaleVec(scale: Vector3): void {
    this.setScale(scale.x, scale.y, scale.z);
  }

  /**
   * <code>setTranslation</code> will set the matrix's translation values.
   *
   * @param translation
   *            the new values for the translation.
   * @throws JmeException
   *             if translation is not size 3.
   */
  public setTranslationArray(translation: number[]): void {
    if (translation.length !== 3) {
      throw new Error(
        "Translation size must be 3.");
    }
    this.m03 = translation[0];
    this.m13 = translation[1];
    this.m23 = translation[2];
  }

  /**
   * <code>setTranslation</code> will set the matrix's translation values.
   *
   * @param x
   *            value of the translation on the x axis
   * @param y
   *            value of the translation on the y axis
   * @param z
   *            value of the translation on the z axis
   */
  public setTranslation(x: number, y: number, z: number): void {
    this.m03 = x;
    this.m13 = y;
    this.m23 = z;
  }

  /**
   * <code>setTranslation</code> will set the matrix's translation values.
   *
   * @param translation
   *            the new values for the translation.
   */
  public setTranslationVec(translation: Vector3): void {
    this.m03 = translation.x;
    this.m13 = translation.y;
    this.m23 = translation.z;
  }

  /**
   * <code>setInverseTranslation</code> will set the matrix's inverse
   * translation values.
   *
   * @param translation
   *            the new values for the inverse translation.
   * @throws JmeException
   *             if translation is not size 3.
   */
  public setInverseTranslation(translation: number[]): void {
    if (translation.length !== 3) {
      throw new Error(
        "Translation size must be 3.");
    }
    this.m03 = -translation[0];
    this.m13 = -translation[1];
    this.m23 = -translation[2];
  }

  /**
   * <code>angleRotation</code> sets this matrix to that of a rotation about
   * three axes (x, y, z). Where each axis has a specified rotation in
   * degrees. These rotations are expressed in a single <code>Vector3f</code>
   * object.
   *
   * @param angles
   *            the angles to rotate.
   */
  public angleRotation(angles: Vector3): void {
    let angle: number;
    let sr: number;
    let sp: number;
    let sy: number;
    let cr: number;
    let cp: number;
    let cy: number;

    angle = (angles.z * FastMath.DEG_TO_RAD);
    sy = Math.sin(angle);
    cy = Math.cos(angle);
    angle = (angles.y * FastMath.DEG_TO_RAD);
    sp = Math.sin(angle);
    cp = Math.cos(angle);
    angle = (angles.x * FastMath.DEG_TO_RAD);
    sr = Math.sin(angle);
    cr = Math.cos(angle);

    // matrix = (Z * Y) * X
    this.m00 = cp * cy;
    this.m10 = cp * sy;
    this.m20 = -sp;
    this.m01 = sr * sp * cy + cr * -sy;
    this.m11 = sr * sp * sy + cr * cy;
    this.m21 = sr * cp;
    this.m02 = (cr * sp * cy + -sr * -sy);
    this.m12 = (cr * sp * sy + -sr * cy);
    this.m22 = cr * cp;
    this.m03 = 0.0;
    this.m13 = 0.0;
    this.m23 = 0.0;
  }

  /**
   * <code>setRotationQuaternion</code> builds a rotation from a
   * <code>Quaternion</code>.
   *
   * @param quat
   *            the quaternion to build the rotation from.
   * @throws NullPointerException
   *             if quat is null.
   */
  public setRotationQuaternion(quat: Quaternion): void {
    quat.toRotationMatrix(this);
  }

  /**
   * <code>setInverseRotationRadians</code> builds an inverted rotation from
   * Euler angles that are in radians.
   *
   * @param angles
   *            the Euler angles in radians.
   * @throws JmeException
   *             if angles is not size 3.
   */
  public setInverseRotationRadians(angles: number[]): void {
    if (angles.length !== 3) {
      throw new Error(
        "Angles must be of size 3.");
    }
    const cr: number = Math.cos(angles[0]);
    const sr: number = Math.sin(angles[0]);
    const cp: number = Math.cos(angles[1]);
    const sp: number = Math.sin(angles[1]);
    const cy: number = Math.cos(angles[2]);
    const sy: number = Math.sin(angles[2]);

    this.m00 = cp * cy;
    this.m10 = cp * sy;
    this.m20 = -sp;

    const srsp: number = sr * sp;
    const crsp: number = cr * sp;

    this.m01 = srsp * cy - cr * sy;
    this.m11 = srsp * sy + cr * cy;
    this.m21 = sr * cp;

    this.m02 = crsp * cy + sr * sy;
    this.m12 = crsp * sy - sr * cy;
    this.m22 = cr * cp;
  }

  /**
   * <code>setInverseRotationDegrees</code> builds an inverted rotation from
   * Euler angles that are in degrees.
   *
   * @param angles
   *            the Euler angles in degrees.
   * @throws JmeException
   *             if angles is not size 3.
   */
  public setInverseRotationDegrees(angles: number[]): void {
    if (angles.length !== 3) {
      throw new Error("Angles must be of size 3.");
    }
    const vec: number[] = [];
    vec[0] = angles[0] * FastMath.RAD_TO_DEG;
    vec[1] = angles[1] * FastMath.RAD_TO_DEG;
    vec[2] = angles[2] * FastMath.RAD_TO_DEG;
    this.setInverseRotationRadians(vec);
  }

  /**
   *
   * <code>inverseTranslateVect</code> translates a given Vector3f by the
   * translation part of this matrix.
   *
   * @param vec
   *            the Vector3f data to be translated.
   * @throws JmeException
   *             if the size of the Vector3f is not 3.
   */
  public inverseTranslateVecArray(vec: number[]): number[] {
    if (vec.length != 3) {
      throw new Error("vec must be of size 3.");
    }

    vec[0] = vec[0] - this.m03;
    vec[1] = vec[1] - this.m13;
    vec[2] = vec[2] - this.m23;
    return vec;
  }

  /**
   *
   * <code>inverseTranslateVect</code> translates a given Vector3f by the
   * translation part of this matrix.
   *
   * @param data
   *            the Vector3f to be translated.
   * @throws JmeException
   *             if the size of the Vector3f is not 3.
   */
  public inverseTranslateVec(data: Vector3): Vector3 {
    data.x -= this.m03;
    data.y -= this.m13;
    data.z -= this.m23;
    return data;
  }

  /**
   *
   * <code>inverseTranslateVect</code> translates a given Vector3f by the
   * translation part of this matrix.
   *
   * @param data
   *            the Vector3f to be translated.
   * @throws JmeException
   *             if the size of the Vector3f is not 3.
   */
  public translateVec(data: Vector3): Vector3 {
    data.x += this.m03;
    data.y += this.m13;
    data.z += this.m23;
    return data;
  }

  /**
   *
   * <code>inverseRotateVect</code> rotates a given Vector3f by the rotation
   * part of this matrix.
   *
   * @param vec
   *            the Vector3f to be rotated.
   */
  public inverseRotateVect(vec: Vector3): void {
    const vx: number = vec.x;
    const vy: number = vec.y;
    const vz: number = vec.z;

    vec.x = vx * this.m00 + vy * this.m10 + vz * this.m20;
    vec.y = vx * this.m01 + vy * this.m11 + vz * this.m21;
    vec.z = vx * this.m02 + vy * this.m12 + vz * this.m22;
  }

  public rotateVect(vec: Vector3): void {
    const vx: number = vec.x;
    const vy: number = vec.y;
    const vz: number = vec.z;

    vec.x = vx * this.m00 + vy * this.m01 + vz * this.m02;
    vec.y = vx * this.m10 + vy * this.m11 + vz * this.m12;
    vec.z = vx * this.m20 + vy * this.m21 + vz * this.m22;
  }

  /**
   * <code>toString</code> returns the string representation of this object.
   * It is in a format of a 4x4 matrix. For example, an identity matrix would
   * be represented by the following string. com.jme.math.Matrix3f <br>[<br>
   * 1.0  0.0  0.0  0.0 <br>
   * 0.0  1.0  0.0  0.0 <br>
   * 0.0  0.0  1.0  0.0 <br>
   * 0.0  0.0  0.0  1.0 <br>]<br>
   *
   * @return the string representation of this object.
   */
  public toString(): string {
    return `Matrix4
    [
     ${this.m00}  ${this.m01}  ${this.m02}  ${this.m03} 
     ${this.m10}  ${this.m11}  ${this.m12}  ${this.m13} 
     ${this.m20}  ${this.m21}  ${this.m22}  ${this.m23} 
     ${this.m30}  ${this.m31}  ${this.m32}  ${this.m33} 
    ]`;
  }

  /**
   *
   * <code>hashCode</code> returns the hash code value as an integer and is
   * supported for the benefit of hashing based collection classes such as
   * Hashtable, HashMap, HashSet etc.
   *
   * @return the hashcode for this instance of Matrix4f.
   * @see java.lang.Object#hashCode()
   */
  public hashCode(): number {
    let hash: number = 37;
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m00);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m01);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m02);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m03);

    hash = 37 * hash + NumberUtils.floatToIntBits(this.m10);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m11);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m12);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m13);

    hash = 37 * hash + NumberUtils.floatToIntBits(this.m20);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m21);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m22);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m23);

    hash = 37 * hash + NumberUtils.floatToIntBits(this.m30);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m31);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m32);
    hash = 37 * hash + NumberUtils.floatToIntBits(this.m33);

    return hash;
  }

  /**
   * are these two matrices the same? they are is they both have the same mXX values.
   *
   * @param o
   *            the object to compare for equality
   * @return true if they are equal
   */
  public equals(o: any): boolean {
    if (!(o instanceof Matrix4)) {
      return false;
    }

    if (this === o) {
      return true;
    }

    const comp: Matrix4 = o as Matrix4;
    if (NumberUtils.compare(this.m00, comp.m00) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m01, comp.m01) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m02, comp.m02) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m03, comp.m03) != 0) {
      return false;
    }

    if (NumberUtils.compare(this.m10, comp.m10) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m11, comp.m11) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m12, comp.m12) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m13, comp.m13) != 0) {
      return false;
    }

    if (NumberUtils.compare(this.m20, comp.m20) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m21, comp.m21) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m22, comp.m22) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m23, comp.m23) != 0) {
      return false;
    }

    if (NumberUtils.compare(this.m30, comp.m30) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m31, comp.m31) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.m32, comp.m32) != 0) {
      return false;
    }
    return NumberUtils.compare(this.m33, comp.m33) == 0;
  }

  public write(e: Exporter): void {
    const cap: OutputCapsule = e.getCapsule(this);
    cap.writeNumber(this.m00, "m00", 1);
    cap.writeNumber(this.m01, "m01", 0);
    cap.writeNumber(this.m02, "m02", 0);
    cap.writeNumber(this.m03, "m03", 0);
    cap.writeNumber(this.m10, "m10", 0);
    cap.writeNumber(this.m11, "m11", 1);
    cap.writeNumber(this.m12, "m12", 0);
    cap.writeNumber(this.m13, "m13", 0);
    cap.writeNumber(this.m20, "m20", 0);
    cap.writeNumber(this.m21, "m21", 0);
    cap.writeNumber(this.m22, "m22", 1);
    cap.writeNumber(this.m23, "m23", 0);
    cap.writeNumber(this.m30, "m30", 0);
    cap.writeNumber(this.m31, "m31", 0);
    cap.writeNumber(this.m32, "m32", 0);
    cap.writeNumber(this.m33, "m33", 1);
  }

  public read(i: Importer): void {
    const cap: InputCapsule = i.getCapsule(this);
    this.m00 = cap.readNumber("m00", 1);
    this.m01 = cap.readNumber("m01", 0);
    this.m02 = cap.readNumber("m02", 0);
    this.m03 = cap.readNumber("m03", 0);
    this.m10 = cap.readNumber("m10", 0);
    this.m11 = cap.readNumber("m11", 1);
    this.m12 = cap.readNumber("m12", 0);
    this.m13 = cap.readNumber("m13", 0);
    this.m20 = cap.readNumber("m20", 0);
    this.m21 = cap.readNumber("m21", 0);
    this.m22 = cap.readNumber("m22", 1);
    this.m23 = cap.readNumber("m23", 0);
    this.m30 = cap.readNumber("m30", 0);
    this.m31 = cap.readNumber("m31", 0);
    this.m32 = cap.readNumber("m32", 0);
    this.m33 = cap.readNumber("m33", 1);
  }

  /**
   * @return true if this matrix is identity
   */
  public isIdentity(): boolean {
    return (this.m00 === 1 && this.m01 === 0 && this.m02 === 0 && this.m03 === 0)
      && (this.m10 === 0 && this.m11 === 1 && this.m12 === 0 && this.m13 === 0)
      && (this.m20 === 0 && this.m21 === 0 && this.m22 === 1 && this.m23 === 0)
      && (this.m30 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1);
  }

  /**
   * Apply a scale to this matrix.
   *
   * @param scale
   *            the scale to apply
   */
  public scale(scale: Vector3): void {
    this.m00 *= scale.getX();
    this.m10 *= scale.getX();
    this.m20 *= scale.getX();
    this.m30 *= scale.getX();
    this.m01 *= scale.getY();
    this.m11 *= scale.getY();
    this.m21 *= scale.getY();
    this.m31 *= scale.getY();
    this.m02 *= scale.getZ();
    this.m12 *= scale.getZ();
    this.m22 *= scale.getZ();
    this.m32 *= scale.getZ();
  }

  public static equalIdentity(mat: Matrix4): boolean {
    if (Math.abs(mat.m00 - 1) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m11 - 1) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m22 - 1) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m33 - 1) > 1e-4) {
      return false;
    }

    if (Math.abs(mat.m01) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m02) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m03) > 1e-4) {
      return false;
    }

    if (Math.abs(mat.m10) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m12) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m13) > 1e-4) {
      return false;
    }

    if (Math.abs(mat.m20) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m21) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m23) > 1e-4) {
      return false;
    }

    if (Math.abs(mat.m30) > 1e-4) {
      return false;
    }
    if (Math.abs(mat.m31) > 1e-4) {
      return false;
    }
    return Math.abs(mat.m32) <= 1e-4;
  }

  public multQuatLocal(rotation: Quaternion): void {
    const axis: Vector3 = new Vector3();
    const angle: number = rotation.toAngleAxis(axis);
    const matrix4: Matrix4 = new Matrix4();
    matrix4.fromAngleAxis(angle, axis);
    this.multLocal(matrix4);
  }

  public clone(): Matrix4 {
    return new Matrix4(this);
  }
}
