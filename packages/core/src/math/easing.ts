import { EaseFunction } from './ease-function';

/**
 * An Ease function composed of 2 sb function for custom in and out easing
 */
export class InOut implements EaseFunction {

  constructor(private inFunc: EaseFunction, private outFunc: EaseFunction) {}

  public apply(value: number): number {
    if (value < 0.5) {
      value = value * 2;
      return this.inFunc.apply(value) / 2;
    } else {
      value = (value - 0.5) * 2;
      return this.outFunc.apply(value) / 2 + 0.5;
    }
  }
}

export class Invert implements EaseFunction {

  constructor(private func: EaseFunction) {}

  public apply(value: number): number {
    return 1 - this.func.apply(1 - value);
  }
}

export class Easing {

  public static constant: EaseFunction = new class implements EaseFunction {
    public apply(value: number): number {
      return 0;
    }
  };

  /**
   * In
   */
  public static linear: EaseFunction = new class  implements EaseFunction {
    public apply(value: number): number {
      return value;
    }
  };

  public static inQuad: EaseFunction = new class  implements EaseFunction {
    public apply(value: number): number {
      return value * value;
    }
  };

  public static inCubic: EaseFunction = new class  implements EaseFunction {
    public apply(value: number): number {
      return value * value * value;
    }
  };

  public static inQuart: EaseFunction = new class  implements EaseFunction {
    public apply(value: number): number {
      return value * value * value * value;
    }
  };

  public static inQuint: EaseFunction = new class  implements EaseFunction {
    public apply(value: number): number {
      return value * value * value * value * value;
    }
  };


  /**
   * Out Elastic and bounce
   */
  public static outElastic: EaseFunction = new class  implements EaseFunction {
    public apply(value: number): number {
      return Math.pow(2, -10 * value) * Math.sin((value - 0.3 / 4) * (2 * Math.PI) / 0.3) + 1;
    }
  };

  public static outBounce: EaseFunction = new class  implements EaseFunction {
    public apply(value: number): number {
      if (value < (1 / 2.75)) {
        return (7.5625 * value * value);
      } else if (value < (2 / 2.75)) {
        return (7.5625 * (value -= (1.5 / 2.75)) * value + 0.75);
      } else if (value < (2.5 / 2.75)) {
        return (7.5625 * (value -= (2.25 / 2.75)) * value + 0.9375);
      } else {
        return (7.5625 * (value -= (2.625 / 2.75)) * value + 0.984375);
      }
    }
  };

  /**
   * In Elastic and bounce
   */
  public static inElastic: EaseFunction = new Invert(Easing.outElastic);
  public static inBounce: EaseFunction = new Invert(Easing.outBounce);

  /**
   * Out
   */
  public static outQuad: EaseFunction = new Invert(Easing.inQuad);
  public static outCubic: EaseFunction = new Invert(Easing.inCubic);
  public static outQuart: EaseFunction = new Invert(Easing.inQuart);
  public static outQuint: EaseFunction = new Invert(Easing.inQuint);

  /**
   * inOut
   */
  public static inOutQuad: EaseFunction = new InOut(Easing.inQuad, Easing.outQuad);
  public static inOutCubic: EaseFunction = new InOut(Easing.inCubic, Easing.outCubic);
  public static inOutQuart: EaseFunction = new InOut(Easing.inQuart, Easing.outQuart);
  public static inOutQuint: EaseFunction = new InOut(Easing.inQuint, Easing.outQuint);
  public static inOutElastic: EaseFunction = new InOut(Easing.inElastic, Easing.outElastic);
  public static inOutBounce: EaseFunction = new InOut(Easing.inBounce, Easing.outBounce);


  /**
   * Extra functions
   */

  public static smoothStep: EaseFunction = new class  implements EaseFunction {
    public apply(t: number): number {
      return t * t * (3 - 2 * t);
    }
  };

  public static smootherStep: EaseFunction = new class  implements EaseFunction {
    public apply(t: number): number {
      return t * t * t * (t * (t * 6 - 15) + 10);
    }
  };

}
