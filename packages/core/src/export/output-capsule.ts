import { Vector3 } from '../math/vector3';
import { Quaternion } from '../math/quaternion';

export interface OutputCapsule {

  writeNumber(value: number, name: string, defValue: number): void;
  writeVec3(value: Vector3, name: string, defValue: Vector3): void;
  writeQuat(value: Quaternion, name: string, defValue: Quaternion): void;

}
