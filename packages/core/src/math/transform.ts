/**
 * Started Date: Jul 16, 2004<br><br>
 * Represents a translation, rotation and scale in one object.
 */
import { Savable } from '../export/savable';
import { Cloneable } from '../util/cloneable';
import { Vector3 } from './vector3';
import { Quaternion } from './quaternion';
import { Matrix4 } from './matrix4';
import { Exporter } from '../export/exporter';
import { Importer } from '../export/importer';
import { OutputCapsule } from '../export/output-capsule';
import { InputCapsule } from '../export/input-capsule';

export class Transform implements Savable, Cloneable<Transform> {

  public static IDENTITY: Transform = new Transform();

  private translation: Vector3 = new Vector3();

  // public Transform(Vector3f translation, Quaternion rot) {
  //   this.translation.set(translation);
  //   this.rot.set(rot);
  // }
  //
  // public Transform(Vector3f translation, Quaternion rot, Vector3f scale){
  //   this(translation, rot);
  //   this.scale.set(scale);
  // }
  //
  // public Transform(Vector3f translation){
  //   this(translation, Quaternion.IDENTITY);
  // }
  //
  // public Transform(Quaternion rot){
  //   this(Vector3f.ZERO, rot);
  // }
  //
  // public Transform(){
  //   this(Vector3f.ZERO, Quaternion.IDENTITY);
  // }

  constructor();
  constructor(rot: Quaternion);
  constructor(translation: Vector3);
  constructor(translation: Vector3, rot: Quaternion);
  constructor(translation: Vector3, rot: Quaternion, scale: Vector3);
  constructor(
    arg1: Vector3|Quaternion = Vector3.ZERO,
    private rot: Quaternion = Quaternion.IDENTITY,
    private scale: Vector3 = Vector3.UNIT_XYZ
  ) {
    if (arg1 instanceof  Vector3) {
      this.translation = arg1;
    } else if (arg1 instanceof Quaternion) {
      this.rot = arg1;
    }
  }

  /**
   * Sets this rotation to the given Quaternion value.
   * @param rot The new rotation for this matrix.
   * @return this
   */
  public setRotation(rot: Quaternion): Transform {
    this.rot.copy(rot);
    return this;
  }

  /**
   * Sets this translation to the given value.
   * @param trans The new translation for this matrix.
   * @return this
   */
  public setTranslationVec(trans: Vector3): Transform {
    this.translation.copy(trans);
    return this;
  }

  /**
   * Return the translation vector in this matrix.
   * @return translation vector.
   */
  public getTranslation(): Vector3 {
    return this.translation;
  }

  /**
   * Sets this scale to the given value.
   * @param scale The new scale for this matrix.
   * @return this
   */
  public setScaleVec(scale: Vector3): Transform {
    this.scale.copy(scale);
    return this;
  }

  /**
   * Sets this scale to the given value.
   * @param scale The new scale for this matrix.
   * @return this
   */
  public setScaleScalar(scale: number): Transform {
    this.scale.set(scale, scale, scale);
    return this;
  }

  /**
   * Stores this translation value into the given vector3f.  If trans is null, a new vector3f is created to
   * hold the value.  The value, once stored, is returned.
   * @param trans The store location for this matrix's translation.
   * @return The value of this matrix's translation.
   */
  public getTranslation(trans: Vector3): Vector3 {
    if (!trans) {
      trans= new Vector3();
    }
    trans.copy(this.translation);
    return trans;
  }

  /**
   * Stores this rotation value into the given Quaternion.  If quat is null, a new Quaternion is created to
   * hold the value.  The value, once stored, is returned.
   * @param quat The store location for this matrix's rotation.
   * @return The value of this matrix's rotation.
   */
  public getRotation(): Quaternion;
  public getRotation(quat: Quaternion): Quaternion;
  public getRotation(quat?: Quaternion): Quaternion {
    if (!quat) {
      quat = new Quaternion();
    }
    quat.copy(this.rot);
    return quat;
  }

  /**
   * Return the scale vector in this matrix.
   * @return scale vector.
   */
  public getScale(): Vector3;

  /**
   * Stores this scale value into the given vector3f.  If scale is null, a new vector3f is created to
   * hold the value.  The value, once stored, is returned.
   * @param scale The store location for this matrix's scale.
   * @return The value of this matrix's scale.
   */
  public getScale(scale: Vector3): Vector3;
  public getScale(scale?: Vector3): Vector3 {
    if (!scale) {
      scale = new Vector3();
    }
    scale.copy(this.scale);
    return scale;
  }

  /**
   * Sets this transform to the interpolation between the first transform and the second by delta amount.
   * @param t1 The beginning transform.
   * @param t2 The ending transform.
   * @param delta An amount between 0 and 1 representing how far to interpolate from t1 to t2.
   */
  public interpolateTransforms(t1: Transform, t2: Transform, delta: number): void {
    t1.rot.nlerp(t2.rot, delta);
    this.rot.set(t1.rot);
    this.translation.interpolateLocal(t1.translation, t2.translation, delta);
    this.scale.interpolateLocal(t1.scale, t2.scale, delta);
  }

  /**
   * Changes the values of this matrix according to its parent.  Very similar to the concept of Node/Spatial transforms.
   * @param parent The parent matrix.
   * @return This matrix, after combining.
   */
  public combineWithParent(parent: Transform): Transform {
    //applying parent scale to local scale
    this.scale.multVecLocal(parent.scale);
    //applying parent rotation to local rotation.
    parent.rot.mult(this.rot, this.rot);
    //applying parent scale to local translation.
    this.translation.multLocal(parent.scale);
    //applying parent rotation to local translation, then applying parent translation to local translation.
    //Note that parent.rot.multLocal(translation) doesn't modify "parent.rot" but "translation"
    parent
      .rot
      .multLocal(this.translation)
      .addLocal(parent.translation);

    return this;
  }

  /**
   * Sets this matrix's translation to the given x,y,z values.
   * @param x This matrix's new x translation.
   * @param y This matrix's new y translation.
   * @param z This matrix's new z translation.
   * @return this
   */
  public setTranslation(x: number,y: number, z: number): Transform {
    this.translation.set(x,y,z);
    return this;
  }

  /**
   * Sets this matrix's scale to the given x,y,z values.
   * @param x This matrix's new x scale.
   * @param y This matrix's new y scale.
   * @param z This matrix's new z scale.
   * @return this
   */
  public setScale(x: number, y: number, z: number): Transform {
    this.scale.set(x,y,z);
    return this;
  }

  public transformVector(vec: Vector3, store: Vector3): Vector3 {
    if (!store) {
      store = new Vector3();
    }
    return this.rot.mult(store.set(vec).multLocal(this.scale), store).addLocal(this.translation);
  }

  public transformInverseVector(vec: Vector3, store: Vector3): Vector3 {
    if (!store) {
      store = new Vector3();
    }

    vec.subtractVec(this.translation, store);
    this.rot.inverse().mult(store, store);
    store.divideVecLocal(this.scale);

    return store;
  }

  public toTransformMatrix(): Matrix4;
  public toTransformMatrix(store: Matrix4): Matrix4;
  public toTransformMatrix(store?: Matrix4): Matrix4 {
    if (!store) {
      store = new Matrix4();
    }
    store.setTranslationVec(this.translation);
    this.rot.toTransformMatrix(store);
    store.setScale(scale);
    return store;
  }

  public fromTransformMatrix(mat: Matrix4): void {
    const vec1: Vector3 = new Vector3();
    const vec2: Vector3 = new Vector3();
    const quat: Quaternion = new Quaternion();
    this.translation.copy(mat.toTranslationVector(vec1));
    this.rot.copy(mat.toRotationQuat(quat));
    this.scale.copy(mat.toScaleVector(vec2));
  }

  public invert(): Transform {
    const t: Transform = new Transform();
    t.fromTransformMatrix(this.toTransformMatrix().invertLocal());
    return t;
  }

  /**
   * Loads the identity.  Equal to translation=0,0,0 scale=1,1,1 rot=0,0,0,1.
   */
  public loadIdentity(): void {
    this.translation.set(0, 0, 0);
    this.scale.set(1, 1, 1);
    this.rot.set(0, 0, 0, 1);
  }

  /**
   * Test for exact identity.
   *
   * @return true if exactly equal to {@link #IDENTITY}, otherwise false
   */
  public isIdentity(): boolean {
    return this.translation.x == 0 && this.translation.y == 0 && this.translation.z == 0
    && this.scale.x == 1 && this.scale.y == 1 && this.scale.z == 1
    && this.rot.w == 1 && this.rot.x == 0 && this.rot.y == 0 && this.rot.z == 0;
  }

  public hashCode(): number {
    let hash: number = 7;
    hash = 89 * hash + this.rot.hashCode();
    hash = 89 * hash + this.translation.hashCode();
    hash = 89 * hash + this.scale.hashCode();
    return hash;
  }

  public equals(obj: any): boolean {
    if (!obj) {
      return false;
    }

    const other: Transform = obj as Transform;
    return this.translation.equals(other.translation)
      && this.scale.equals(other.scale)
      && this.rot.equals(other.rot);
  }

  public toString(): string {
    return `Transform[${this.translation.x }, ${this.translation.y }, ${this.translation.z }]
      [${this.rot.x}, ${this.rot.y}, ${this.rot.z}, ${this.rot.w}]
      [${this.scale.x} , ${this.scale.y}, ${this.scale.z}];
    `
  }

  /**
   * Sets this matrix to be equal to the given matrix.
   * @param matrixQuat The matrix to be equal to.
   * @return this
   */
  public copy(matrixQuat: Transform): Transform {
    this.translation.set(matrixQuat.translation);
    this.rot.set(matrixQuat.rot);
    this.scale.set(matrixQuat.scale);
    return this;
  }

  public write(e: Exporter): void {
    const capsule: OutputCapsule = e.getCapsule(this);
    capsule.writeQuat(this.rot, "rot", Quaternion.IDENTITY);
    capsule.writeVec3(this.translation, "translation", Vector3.ZERO);
    capsule.writeVec3(this.scale, "scale", Vector3.UNIT_XYZ);
  }

  public read(e: Importer): void {
    const capsule: InputCapsule = e.getCapsule(this);
    this.rot.copy(capsule.readQuat("rot", Quaternion.IDENTITY));
    this.translation.copy(capsule.readVec3("translation", Vector3.ZERO));
    this.scale.copy(capsule.readVec3("scale", Vector3.UNIT_XYZ));
  }

  public clone(): Transform {
    return new Transform(this.translation, this.rot, this.scale);
  }
}
