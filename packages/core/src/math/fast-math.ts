export class FastMath {

  public static HALF_PI = Math.PI / 2.0;
  public static ZERO_TOLERANCE = 0.0001;

  static clamp(input: number, min: number, max: number): number {
    return (input < min) ? min : (input > max) ? max : input;
  }

  static invSqrt(value: number): number {
    return 1.0 / Math.sqrt(value);
  }

}
