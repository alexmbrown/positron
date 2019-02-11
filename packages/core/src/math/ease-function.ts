export interface EaseFunction {

  /**
   * @param value a value from 0 to 1. Passing a value out of this range will have unexpected behavior.
   * @return
   */
  apply(value: number): number;
}
