import { Logger } from '../util/logger';
import { Vector3 } from './vector3';
import { Matrix3 } from './matrix3';
import { FastMath } from './fast-math';

export class Eigen3 {

  private static logger: Logger = Logger.getLogger('Eigen3');

  public eigenValues: number[] = [];
  public eigenVectors: Vector3[] = [];

  private static ONE_THIRD: number = 1.0 / 3.0;
  private static ROOT_THREE: number = Math.sqrt(3.0);

  constructor();

  constructor(data?: Matrix3);
  constructor(data: Matrix3) {
    this.calculateEigen(data);
  }


  public calculateEigen(data: Matrix3): void {
    // prep work...
    this.eigenVectors[0] = new Vector3();
    this.eigenVectors[1] = new Vector3();
    this.eigenVectors[2] = new Vector3();

    const scaledData: Matrix3 = new Matrix3(data);
    const maxMagnitude: number = this.scaleMatrix(scaledData);

    // Compute the eigenvalues using double-precision arithmetic.
    const roots: number[] = [];
    this.computeRoots(scaledData, roots);
    this.eigenValues[0] = roots[0];
    this.eigenValues[1] = roots[1];
    this.eigenValues[2] = roots[2];

    const maxValues: number[] = [];
    const maxRows: Vector3[] = [];
    maxRows[0] = new Vector3();
    maxRows[1] = new Vector3();
    maxRows[2] = new Vector3();

    for (let i = 0; i < 3; i++) {
      const tempMatrix: Matrix3 = new Matrix3(scaledData);
      tempMatrix.m00 -= this.eigenValues[i];
      tempMatrix.m11 -= this.eigenValues[i];
      tempMatrix.m22 -= this.eigenValues[i];
      const val: number[] = [];
      val[0] = maxValues[i];
      if (!this.positiveRank(tempMatrix, val, maxRows[i])) {
        // Rank was 0 (or very close to 0), so just return.
        // Rescale back to the original size.
        if (maxMagnitude > 1) {
          for (let j = 0; j < 3; j++) {
            this.eigenValues[j] *= maxMagnitude;
          }
        }

        this.eigenVectors[0].set(Vector3.UNIT_X);
        this.eigenVectors[1].set(Vector3.UNIT_Y);
        this.eigenVectors[2].set(Vector3.UNIT_Z);
        return;
      }
      maxValues[i] = val[0];
    }

    let maxCompare: number = maxValues[0];
    let i: number = 0;
    if (maxValues[1] > maxCompare) {
      maxCompare = maxValues[1];
      i = 1;
    }
    if (maxValues[2] > maxCompare) {
      i = 2;
    }

    // use the largest row to compute and order the eigen vectors.
    switch (i) {
      case 0:
        maxRows[0].normalizeLocal();
        this.computeVectors(scaledData, maxRows[0], 1, 2, 0);
        break;
      case 1:
        maxRows[1].normalizeLocal();
        this.computeVectors(scaledData, maxRows[1], 2, 0, 1);
        break;
      case 2:
        maxRows[2].normalizeLocal();
        this.computeVectors(scaledData, maxRows[2], 0, 1, 2);
        break;
    }

    // Rescale the values back to the original size.
    if (maxMagnitude > 1) {
      for (i = 0; i < 3; i++) {
        this.eigenValues[i] *= maxMagnitude;
      }
    }
  }

  /**
   * Scale the matrix so its entries are in [-1,1]. The scaling is applied
   * only when at least one matrix entry has magnitude larger than 1.
   *
   * @return the max magnitude in this matrix
   */
  private scaleMatrix(mat: Matrix3): number {

    let max: number = Math.abs(mat.m00);
    let abs: number = Math.abs(mat.m01);

    if (abs > max) {
      max = abs;
    }
    abs = Math.abs(mat.m02);
    if (abs > max) {
      max = abs;
    }
    abs = Math.abs(mat.m11);
    if (abs > max) {
      max = abs;
    }
    abs = Math.abs(mat.m12);
    if (abs > max) {
      max = abs;
    }
    abs = Math.abs(mat.m22);
    if (abs > max) {
      max = abs;
    }

    if (max > 1) {
      const fInvMax: number = 1 / max;
      mat.multScalarLocal(fInvMax);
    }

    return max;
  }

  /**
   * Compute the eigenvectors of the given Matrix, using the
   * @param mat
   * @param vect
   * @param index1
   * @param index2
   * @param index3
   */
  private computeVectors(mat: Matrix3, vect: Vector3, index1: number, index2: number, index3: number): void {
    const vectorU: Vector3 = new Vector3();
    const vectorV: Vector3 = new Vector3();
    Vector3.generateComplementBasis(vectorU, vectorV, vect);

    const tempVect: Vector3 = mat.multVec(vectorU);
    let p00: number = this.eigenValues[index3] - vectorU.dot(tempVect);
    let p01: number = vectorV.dot(tempVect);
    let p11: number = this.eigenValues[index3] - vectorV.dot(mat.multVec(vectorV));
    let invLength: number;
    let max: number = Math.abs(p00);
    let row: number = 0;
    let fAbs: number = Math.abs(p01);
    if (fAbs > max) {
      max = fAbs;
    }
    fAbs = Math.abs(p11);
    if (fAbs > max) {
      max = fAbs;
      row = 1;
    }

    if (max >= FastMath.ZERO_TOLERANCE) {
      if (row == 0) {
        invLength = FastMath.invSqrt(p00 * p00 + p01 * p01);
        p00 *= invLength;
        p01 *= invLength;
        vectorU.mult(p01, this.eigenVectors[index3]).addVecLocal(vectorV.mult(p00));
      } else {
        invLength = FastMath.invSqrt(p11 * p11 + p01 * p01);
        p11 *= invLength;
        p01 *= invLength;
        vectorU.mult(p11, this.eigenVectors[index3]).addVecLocal(vectorV.mult(p01));
      }
    } else {
      if (row == 0) {
        this.eigenVectors[index3] = vectorV;
      } else {
        this.eigenVectors[index3] = vectorU;
      }
    }

    const vectorS: Vector3 = vect.crossVec(this.eigenVectors[index3]);
    mat.multVec(vect, tempVect);
    p00 = this.eigenValues[index1] - vect.dot(tempVect);
    p01 = vectorS.dot(tempVect);
    p11 = this.eigenValues[index1] - vectorS.dot(mat.multVec(vectorS));
    max = Math.abs(p00);
    row = 0;
    fAbs = Math.abs(p01);
    if (fAbs > max) {
      max = fAbs;
    }
    fAbs = Math.abs(p11);
    if (fAbs > max) {
      max = fAbs;
      row = 1;
    }

    if (max >= FastMath.ZERO_TOLERANCE) {
      if (row == 0) {
        invLength = FastMath.invSqrt(p00 * p00 + p01 * p01);
        p00 *= invLength;
        p01 *= invLength;
        this.eigenVectors[index1] = vect.multScalarLocal(p01).addVec(vectorS.multScalar(p00));
      } else {
        invLength = FastMath.invSqrt(p11 * p11 + p01 * p01);
        p11 *= invLength;
        p01 *= invLength;
        this.eigenVectors[index1] = vect.multScalarLocal(p11).addVec(vectorS.multScalar(p01));
      }
    } else {
      if (row == 0) {
        this.eigenVectors[index1].copy(vectorS);
      } else {
        this.eigenVectors[index1].copy(vect);
      }
    }

    this.eigenVectors[index3].crossVec(this.eigenVectors[index1], this.eigenVectors[index2]);
  }

  /**
   * Check the rank of the given Matrix to determine if it is positive. While
   * doing so, store the max magnitude entry in the given float store and the
   * max row of the matrix in the Vector store.
   *
   * @param matrix
   *            the Matrix3f to analyze.
   * @param maxMagnitudeStore
   *            a float array in which to store (in the 0th position) the max
   *            magnitude entry of the matrix.
   * @param maxRowStore
   *            a Vector3f to store the values of the row of the matrix
   *            containing the max magnitude entry.
   * @return true if the given matrix has a non 0 rank.
   */
  private positiveRank(matrix: Matrix3, maxMagnitudeStore: number[], maxRowStore: Vector3): boolean {
    // Locate the maximum-magnitude entry of the matrix.
    maxMagnitudeStore[0] = -1;
    let iMaxRow = -1;
    for (let iRow = 0; iRow < 3; iRow++) {
      for (let iCol = iRow; iCol < 3; iCol++) {
        const fAbs: number = Math.abs(matrix.get(iRow, iCol));
        if (fAbs > maxMagnitudeStore[0]) {
          maxMagnitudeStore[0] = fAbs;
          iMaxRow = iRow;
        }
      }
    }

    // Return the row containing the maximum, to be used for eigenvector
    // construction.
    maxRowStore.copy(matrix.getRow(iMaxRow));

    return maxMagnitudeStore[0] >= FastMath.ZERO_TOLERANCE;
  }

  /**
   * Generate the base eigen values of the given matrix using double precision
   * math.
   *
   * @param mat
   *            the Matrix3f to analyze.
   * @param rootsStore
   *            a double array to store the results in. Must be at least
   *            length 3.
   */
  private computeRoots(mat: Matrix3, rootsStore: number[]): void {
    // Convert the unique matrix entries to double precision.
    double a = mat.m00, b = mat.m01, c = mat.m02,
      d = mat.m11, e = mat.m12,
      f = mat.m22;

    // The characteristic equation is x^3 - c2*x^2 + c1*x - c0 = 0. The
    // eigenvalues are the roots to this equation, all guaranteed to be
    // real-valued, because the matrix is symmetric.
    double char0 = a * d * f + 2.0 * b * c * e - a
      * e * e - d * c * c - f * b * b;

    double char1 = a * d - b * b + a * f - c * c
      + d * f - e * e;

    double char2 = a + d + f;

    // Construct the parameters used in classifying the roots of the
    // equation and in solving the equation for the roots in closed form.
    double char2Div3 = char2 * ONE_THIRD_DOUBLE;
    double abcDiv3 = (char1 - char2 * char2Div3) * ONE_THIRD_DOUBLE;
    if (abcDiv3 > 0.0) {
      abcDiv3 = 0.0;
    }

    double mbDiv2 = 0.5 * (char0 + char2Div3 * (2.0 * char2Div3 * char2Div3 - char1));

    double q = mbDiv2 * mbDiv2 + abcDiv3 * abcDiv3 * abcDiv3;
    if (q > 0.0) {
      q = 0.0;
    }

    // Compute the eigenvalues by solving for the roots of the polynomial.
    double magnitude = Math.sqrt(-abcDiv3);
    double angle = Math.atan2(Math.sqrt(-q), mbDiv2) * ONE_THIRD_DOUBLE;
    double cos = Math.cos(angle);
    double sin = Math.sin(angle);
    double root0 = char2Div3 + 2.0 * magnitude * cos;
    double root1 = char2Div3 - magnitude
      * (cos + ROOT_THREE_DOUBLE * sin);
    double root2 = char2Div3 - magnitude
      * (cos - ROOT_THREE_DOUBLE * sin);

    // Sort in increasing order.
    if (root1 >= root0) {
      rootsStore[0] = root0;
      rootsStore[1] = root1;
    } else {
      rootsStore[0] = root1;
      rootsStore[1] = root0;
    }

    if (root2 >= rootsStore[1]) {
      rootsStore[2] = root2;
    } else {
      rootsStore[2] = rootsStore[1];
      if (root2 >= rootsStore[0]) {
        rootsStore[1] = root2;
      } else {
        rootsStore[1] = rootsStore[0];
        rootsStore[0] = root2;
      }
    }
  }

  public getEigenValue(i: number): number {
    return this.eigenValues[i];
  }

  public getEigenVector(i: number): Vector3 {
    return this.eigenVectors[i];
  }

  public getEigenValues(): number[] {
    return this.eigenValues;
  }

  public getEigenVectors(): Vector3[] {
    return this.eigenVectors;
  }
}
