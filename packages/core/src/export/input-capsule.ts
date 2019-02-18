import { Vector3 } from '../math/vector3';
import { Quaternion } from '../math/quaternion';

export interface InputCapsule {

  readNumber(name: string, defValue: number): number;
  readVec3(name: string, defValue: Vector3): Vector3;
  readQuat(name: string, defValue: Quaternion): Quaternion;

}
