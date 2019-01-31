export class FastMath {

  static clamp(input: number, min: number, max: number): number {
    return (input < min) ? min : (input > max) ? max : input;
  }

  static invSqrt(value: number): number {
    return 1.0 / Math.sqrt(value);
  }

}
