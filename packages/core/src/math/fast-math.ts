export class FastMath {

  public static HALF_PI: number = Math.PI / 2.0;
  public static ZERO_TOLERANCE: number = 0.0001;
  public static DEG_TO_RAD: number = Math.PI / 180.0;
  public static RAD_TO_DEG: number = 180.0 / Math.PI;

  static clamp(input: number, min: number, max: number): number {
    return (input < min) ? min : (input > max) ? max : input;
  }

  static invSqrt(value: number): number {
    return 1.0 / Math.sqrt(value);
  }

}
