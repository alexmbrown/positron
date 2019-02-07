export class NumberUtils {

  public static floatToIntBits(float: number): number {
    return parseInt(float.toString(2).replace('.', ''), 2);
  }

  public static compare(a: number, b: number): number {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    }
    return 0;
  }

}
