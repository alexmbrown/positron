import { Cloneable } from '../util/cloneable';
import { Savable } from '../export/savable';
import { isNumber } from '../util/type-utils';
import { FastMath } from './fast-math';
import { NumberUtils } from '../util/number-utils';
import { Exporter } from '../export/exporter';
import { Importer } from '../export/importer';
import { OutputCapsule } from '../export/output-capsule';
import { InputCapsule } from '../export/input-capsule';
import { Vector3 } from './vector3';
import { Vector4 } from './vector4';

export class ColorRGBA implements Savable, Cloneable<ColorRGBA> {

  public static GAMMA: number = 2.2;

  /**
   * The color black (0,0,0).
   */
  public static Black: ColorRGBA = new ColorRGBA(0, 0, 0, 1);
  /**
   * The color white (1,1,1).
   */
  public static White: ColorRGBA = new ColorRGBA(1, 1, 1, 1);
  /**
   * The color gray (.2,.2,.2).
   */
  public static DarkGray: ColorRGBA = new ColorRGBA(0.2, 0.2, 0.2, 1.0);
  /**
   * The color gray (.5,.5,.5).
   */
  public static Gray: ColorRGBA = new ColorRGBA(0.5, 0.5, 0.5, 1.0);
  /**
   * The color gray (.8,.8,.8).
   */
  public static LightGray: ColorRGBA = new ColorRGBA(0.8, 0.8, 0.8, 1.0);
  /**
   * The color red (1,0,0).
   */
  public static Red: ColorRGBA = new ColorRGBA(1, 0, 0, 1);
  /**
   * The color green (0,1,0).
   */
  public static Green: ColorRGBA = new ColorRGBA(0, 1, 0, 1);
  /**
   * The color blue (0,0,1).
   */
  public static Blue: ColorRGBA = new ColorRGBA(0, 0, 1, 1);
  /**
   * The color yellow (1,1,0).
   */
  public static Yellow: ColorRGBA = new ColorRGBA(1, 1, 0, 1);
  /**
   * The color magenta (1,0,1).
   */
  public static Magenta: ColorRGBA = new ColorRGBA(1, 0, 1, 1);
  /**
   * The color cyan (0,1,1).
   */
  public static Cyan: ColorRGBA = new ColorRGBA(0, 1, 1, 1);
  /**
   * The color orange (251/255, 130/255,0).
   */
  public static Orange: ColorRGBA = new ColorRGBA(251 / 255, 130 / 255, 0, 1);
  /**
   * The color brown (65/255, 40/255, 25/255).
   */
  public static Brown: ColorRGBA = new ColorRGBA(65 / 255, 40 / 255, 25 / 255, 1);
  /**
   * The color pink (1, 0.68, 0.68).
   */
  public static Pink: ColorRGBA = new ColorRGBA(1, 0.68, 0.68, 1);
  /**
   * The black color with no alpha (0, 0, 0, 0).
   */
  public static BlackNoAlpha: ColorRGBA = new ColorRGBA(0, 0, 0, 0);
  /**
   * The red component of the color. 0 is none and 1 is maximum red.
   */
  public r: number;
  /**
   * The green component of the color. 0 is none and 1 is maximum green.
   */
  public g: number;
  /**
   * The blue component of the color. 0 is none and 1 is maximum blue.
   */
  public b: number;
  /**
   * The alpha component of the color. 0 is transparent and 1 is opaque.
   */
  public a: number;

  /**
   * Constructor instantiates a new <code>ColorRGBA</code> object. This
   * color is the default "white" with all values 1.
   */
  constructor();

  /**
   * Constructor instantiates a new <code>ColorRGBA</code> object. The
   * values are defined as passed parameters.
   * these values are assumed to be in linear space and stored as is.
   * If you want to assign sRGB values use
   * {@link ColorRGBA#setAsSrgb(float, float, float, float) }
   * @param r The red component of this color.
   * @param g The green component of this <code>ColorRGBA</code>.
   * @param b The blue component of this <code>ColorRGBA</code>.
   * @param a The alpha component of this <code>ColorRGBA</code>.
   */
  constructor(r: number, g: number, b: number, a: number);

  /**
   * Copy constructor creates a new <code>ColorRGBA</code> object, based on
   * a provided color.
   * @param rgba The <code>ColorRGBA</code> object to copy.
   */
  constructor(rgba: ColorRGBA);

  constructor(arg1?: number|ColorRGBA, g?: number, b?: number, a?: number) {
    if (arg1 instanceof ColorRGBA) {
      this.a = arg1.a;
      this.r = arg1.r;
      this.g = arg1.g;
      this.b = arg1.b;
    } else if (
      isNumber(arg1) &&
      isNumber(g) &&
      isNumber(b) &&
      isNumber(a)
    ) {
      this.r = arg1;
      this.g = g;
      this.b = b;
      this.a = a;
    } else {
      this.r = this.g = this.b = this.a = 1.0;
    }
  }

  /**
   * <code>set</code> sets the RGBA values of this <code>ColorRGBA</code>.
   * these values are assumed to be in linear space and stored as is.
   * If you want to assign sRGB values use
   * {@link ColorRGBA#setAsSrgb(float, float, float, float) }
   *
   * @param r The red component of this color.
   * @param g The green component of this color.
   * @param b The blue component of this color.
   * @param a The alpha component of this color.
   * @return this
   */
  public set(r: number, g: number, b: number, a: number): ColorRGBA {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }

  /**
   * <code>set</code> sets the values of this <code>ColorRGBA</code> to those
   * set by a parameter color.
   *
   * @param rgba The color to set this <code>ColorRGBA</code> to.
   * @return this
   */
  public copy(rgba: ColorRGBA): ColorRGBA {
    if (!rgba) {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
    } else {
      this.r = rgba.r;
      this.g = rgba.g;
      this.b = rgba.b;
      this.a = rgba.a;
    }
    return this;
  }

  /**
   * Saturate that color ensuring all channels have a value between 0 and 1
   */
  public clamp(): void {
    this.r = FastMath.clamp(this.r, 0, 1);
    this.g = FastMath.clamp(this.g, 0, 1);
    this.b = FastMath.clamp(this.b, 0, 1);
    this.a = FastMath.clamp(this.a, 0, 1);
  }

  /**
   * <code>getColorArray</code> retrieves the color values of this
   * <code>ColorRGBA</code> as a four element <code>float</code> array in the
   * order: r,g,b,a.
   * @return The <code>float</code> array that contains the color components.
   */
  public getColorArray(): number[];

  /**
   * Stores the current r,g,b,a values into the given array.  The given array must have a
   * length of 4 or greater, or an array index out of bounds exception will be thrown.
   * @param store The <code>float</code> array to store the values into.
   * @return The <code>float</code> array after storage.
   */
  public getColorArray(store: number[]): number[];

  /**
   * Implementation
   */
  public getColorArray(store: number[] = []): number[] {
    store[0] = this.r;
    store[1] = this.g;
    store[2] = this.b;
    store[3] = this.a;
    return store;
  }

  /**
   * Retrieves the alpha component value of this <code>ColorRGBA</code>.
   * @return The alpha component value.
   */
  public getAlpha(): number {
    return this.a;
  }

  /**
   * Retrieves the red component value of this <code>ColorRGBA</code>.
   * @return The red component value.
   */
  public getRed(): number {
    return this.r;
  }

  /**
   * Retrieves the blue component value of this <code>ColorRGBA</code>.
   * @return The blue component value.
   */
  public getBlue(): number {
    return this.b;
  }

  /**
   * Retrieves the green component value of this <code>ColorRGBA</code>.
   * @return The green component value.
   */
  public getGreen(): number {
    return this.g;
  }

  /**
   * Sets this <code>ColorRGBA</code> to the interpolation by changeAmt from
   * this to the finalColor:
   * this=(1-changeAmt)*this + changeAmt * finalColor
   * @param finalColor The final color to interpolate towards.
   * @param changeAmt An amount between 0.0 - 1.0 representing a percentage
   *  change from this towards finalColor.
   * @return this ColorRGBA
   */
  public interpolateLocal(changeAmt: number, finalColor: ColorRGBA): ColorRGBA;

  /**
   * Sets this <code>ColorRGBA</code> to the interpolation by changeAmnt from
   * beginColor to finalColor:
   * this=(1-changeAmnt)*beginColor + changeAmt * finalColor
   * @param beginColor The beginning color (changeAmt=0).
   * @param finalColor The final color to interpolate towards (changeAmt=1).
   * @param changeAmt An amount between 0.0 - 1.0 representing a percentage
   *  change from beginColor towards finalColor.
   * @return this ColorRGBA
   */
  public interpolateLocal(changeAmt: number, finalColor: ColorRGBA, beginColor: ColorRGBA): ColorRGBA;

  public interpolateLocal(changeAmt: number, finalColor: ColorRGBA, beginColor: ColorRGBA = this): ColorRGBA {
    this.r = (1 - changeAmt) * beginColor.r + changeAmt * finalColor.r;
    this.g = (1 - changeAmt) * beginColor.g + changeAmt * finalColor.g;
    this.b = (1 - changeAmt) * beginColor.b + changeAmt * finalColor.b;
    this.a = (1 - changeAmt) * beginColor.a + changeAmt * finalColor.a;
    return this;
  }

  /**
   * <code>randomColor</code> is a utility method that generates a random
   * opaque color.
   * @return a random <code>ColorRGBA</code> with an alpha set to 1.
   */
  public static randomColor(): ColorRGBA {
    const rVal: ColorRGBA = new ColorRGBA(0, 0, 0, 1);
    rVal.r = Math.random();
    rVal.g = Math.random();
    rVal.b = Math.random();
    return rVal;
  }

  /**
   * Multiplies each r,g,b,a of this <code>ColorRGBA</code> by the corresponding
   * r,g,b,a of the given color and returns the result as a new <code>ColorRGBA</code>.
   * Used as a way of combining colors and lights.
   * @param c The color to multiply by.
   * @return The new <code>ColorRGBA</code>.  this*c
   */
  public mult(c: ColorRGBA): ColorRGBA {
    return new ColorRGBA(c.r * this.r, c.g * this.g, c.b * this.b, c.a * this.a);
  }

  /**
   * Multiplies each r,g,b,a of this <code>ColorRGBA</code> by the given scalar and
   * returns the result as a new <code>ColorRGBA</code>.
   * Used as a way of making colors dimmer or brighter.
   * @param scalar The scalar to multiply by.
   * @return The new <code>ColorRGBA</code>.  this*scalar
   */
  public multScalar(scalar: number): ColorRGBA {
    return new ColorRGBA(scalar * this.r, scalar * this.g, scalar * this.b, scalar * this.a);
  }

  /**
   * Multiplies each r,g,b,a of this <code>ColorRGBA</code> by the given scalar and
   * returns the result (this).
   * Used as a way of making colors dimmer or brighter.
   * @param scalar The scalar to multiply by.
   * @return this*c
   */
  public multScalarLocal(scalar: number): ColorRGBA {
    this.r *= scalar;
    this.g *= scalar;
    this.b *= scalar;
    this.a *= scalar;
    return this;
  }

  /**
   * Adds each r,g,b,a of this <code>ColorRGBA</code> by the corresponding
   * r,g,b,a of the given color and returns the result as a new <code>ColorRGBA</code>.
   * Used as a way of combining colors and lights.
   * @param c The color to add.
   * @return The new <code>ColorRGBA</code>.  this+c
   */
  public add(c: ColorRGBA): ColorRGBA {
    return new ColorRGBA(c.r + this.r, c.g + this.g, c.b + this.b, c.a + this.a);
  }

  /**
   * Adds each r,g,b,a of this <code>ColorRGBA</code> by the r,g,b,a the given
   * color and returns the result (this).
   * Used as a way of combining colors and lights.
   * @param c The color to add.
   * @return this+c
   */
  public addLocal(c: ColorRGBA): ColorRGBA {
    this.set(c.r + this.r, c.g + this.g, c.b + this.b, c.a + this.a);
    return this;
  }

  /**
   * <code>toString</code> returns the string representation of this <code>ColorRGBA</code>.
   * The format of the string is:<br>
   * <Class Name>: [R=RR.RRRR, G=GG.GGGG, B=BB.BBBB, A=AA.AAAA]
   * @return The string representation of this <code>ColorRGBA</code>.
   */
  public toString(): string {
    return `Color[${this.r}, ${this.g}, ${this.b}, ${this.a}]`;
  }

  public clone(): ColorRGBA {
    return new ColorRGBA(this);
  }

  /**
   * Saves this <code>ColorRGBA</code> into the given <code>float</code> array.
   * @param floats The <code>float</code> array to take this <code>ColorRGBA</code>.
   * If null, a new <code>float[4]</code> is created.
   * @return The array, with r,g,b,a float values in that order.
   */
  public toArray(floats: number[]): number[] {
    if (!floats) {
      floats = [];
    }
    floats[0] = this.r;
    floats[1] = this.g;
    floats[2] = this.b;
    floats[3] = this.a;
    return floats;
  }

  /**
   * <code>equals</code> returns true if this <code>ColorRGBA</code> is logically equivalent
   * to a given color. That is, if all the components of the two colors are the same.
   * False is returned otherwise.
   * @param o The object to compare against.
   * @return true if the colors are equal, false otherwise.
   */
  public equals(o: any): boolean {
    if (!(o instanceof ColorRGBA)) {
      return false;
    }

    if (this === o) {
      return true;
    }

    const comp: ColorRGBA = o as ColorRGBA;
    if (NumberUtils.compare(this.r, comp.r) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.g, comp.g) != 0) {
      return false;
    }
    if (NumberUtils.compare(this.b, comp.b) != 0) {
      return false;
    }
    return NumberUtils.compare(this.a, comp.a) == 0;

  }

  /**
   * <code>hashCode</code> returns a unique code for this <code>ColorRGBA</code> based
   * on its values. If two colors are logically equivalent, they will return
   * the same hash code value.
   * @return The hash code value of this <code>ColorRGBA</code>.
   */
  public hashCode(): number {
    let hash: number = 37;
    hash += 37 * hash + NumberUtils.floatToIntBits(this.r);
    hash += 37 * hash + NumberUtils.floatToIntBits(this.g);
    hash += 37 * hash + NumberUtils.floatToIntBits(this.b);
    hash += 37 * hash + NumberUtils.floatToIntBits(this.a);
    return hash;
  }

  public write(e: Exporter): void {
    const capsule: OutputCapsule = e.getCapsule(this);
    capsule.writeNumber(this.r, "r", 0);
    capsule.writeNumber(this.g, "g", 0);
    capsule.writeNumber(this.b, "b", 0);
    capsule.writeNumber(this.a, "a", 0);
  }

  public read(e: Importer): void{
    const capsule: InputCapsule = e.getCapsule(this);
    this.r = capsule.readNumber("r", 0);
    this.g = capsule.readNumber("g", 0);
    this.b = capsule.readNumber("b", 0);
    this.a = capsule.readNumber("a", 0);
  }

  /**
   * Retrieves the component values of this <code>ColorRGBA</code> as an
   * <code>int</code> in a,r,g,b order.
   * Bits 24-31 are alpha, 16-23 are red, 8-15 are green, 0-7 are blue.
   * @return The integer representation of this <code>ColorRGBA</code> in a,r,g,b order.
   */
  public asIntARGB(): number {
    return (((this.a * 255) & 0xFF) << 24)
      | (((this.r * 255) & 0xFF) << 16)
      | (((this.g * 255) & 0xFF) << 8)
      | (((this.b * 255) & 0xFF));
  }

  /**
   * Retrieves the component values of this <code>ColorRGBA</code> as an
   * <code>int</code> in r,g,b,a order.
   * Bits 24-31 are red, 16-23 are green, 8-15 are blue, 0-7 are alpha.
   * @return The integer representation of this <code>ColorRGBA</code> in r,g,b,a order.
   */
  public asIntRGBA(): number {
    return (((this.r * 255) & 0xFF) << 24)
      | (((this.g * 255) & 0xFF) << 16)
      | (((this.b * 255) & 0xFF) << 8)
      | (((this.a * 255) & 0xFF));
  }
  /**
   * Retrieves the component values of this <code>ColorRGBA</code> as an
   * <code>int</code> in a,b,g,r order.
   * Bits 24-31 are alpha, 16-23 are blue, 8-15 are green, 0-7 are red.
   * @return The integer representation of this <code>ColorRGBA</code> in a,b,g,r order.
   */
  public asIntABGR(): number {
    return (((this.a * 255) & 0xFF) << 24)
      | (((this.b * 255) & 0xFF) << 16)
      | (((this.g * 255) & 0xFF) << 8)
      | (((this.r * 255) & 0xFF));
  }
  /**
   * Sets the component values of this <code>ColorRGBA</code> with the given
   * combined ARGB <code>int</code>.
   * Bits 24-31 are alpha, bits 16-23 are red, bits 8-15 are green, bits 0-7 are blue.
   * @param color The integer ARGB value used to set this <code>ColorRGBA</code>.
   * @return this
   */
  public fromIntARGB(color: number): ColorRGBA {
    this.a = ((color >> 24) & 0xFF) / 255;
    this.r = ((color >> 16) & 0xFF) / 255;
    this.g = ((color >> 8) & 0xFF) / 255;
    this.b = ((color) & 0xFF) / 255;
    return this;
  }
  /**
   * Sets the RGBA values of this <code>ColorRGBA</code> with the given combined RGBA value
   * Bits 24-31 are red, bits 16-23 are green, bits 8-15 are blue, bits 0-7 are alpha.
   * @param color The integer RGBA value used to set this object.
   * @return this
   */
  public fromIntRGBA(color: number): ColorRGBA {
    this.r = ((color >> 24) & 0xFF) / 255;
    this.g = ((color >> 16) & 0xFF) / 255;
    this.b = ((color >> 8) & 0xFF) / 255;
    this.a = ((color) & 0xFF) / 255;
    return this;
  }
  /**
   * Sets the RGBA values of this <code>ColorRGBA</code> with the given combined ABGR value
   * Bits 24-31 are alpha, bits 16-23 are blue, bits 8-15 are green, bits 0-7 are red.
   * @param color The integer ABGR value used to set this object.
   * @return this
   */
  public fromIntABGR(color: number): ColorRGBA {
    this.a = ((color >> 24) & 0xFF) / 255;
    this.b = ((color >> 16) & 0xFF) / 255;
    this.g = ((color >> 8) & 0xFF) / 255;
    this.r = ((color) & 0xFF) / 255;
    return this;
  }

  /**
   * Transform this <code>ColorRGBA</code> to a <code>Vector3f</code> using
   * x = r, y = g, z = b. The Alpha value is not used.
   * This method is useful for shader assignments.
   * @return A <code>Vector3f</code> containing the RGB value of this <code>ColorRGBA</code>.
   */
  public toVector3f(): Vector3 {
    return new Vector3(this.r, this.g, this.b);
  }

  /**
   * Transform this <code>ColorRGBA</code> to a <code>Vector4f</code> using
   * x = r, y = g, z = b, w = a.
   * This method is useful for shader assignments.
   * @return A <code>Vector4f</code> containing the RGBA value of this <code>ColorRGBA</code>.
   */
  public toVector4(): Vector4 {
    return new Vector4(this.r, this.g, this.b, this.a);
  }

  /**
   * Sets the rgba channels of this color in sRGB color space.
   * You probably want to use this method if the color is picked by the use
   * in a color picker from a GUI.
   *
   * Note that the values will be gamma corrected to be stored in linear space
   * GAMMA value is 2.2
   *
   * Note that no correction will be performed on the alpha channel as it
   * conventionally doesn't represent a color itself
   *
   * @param r the red value in sRGB color space
   * @param g the green value in sRGB color space
   * @param b the blue value in sRGB color space
   * @param a the alpha value
   *
   * @return this ColorRGBA with updated values.
   */
  public setAsSrgb(r: number, g: number, b: number, a: number): ColorRGBA {
    this.r = Math.pow(r, ColorRGBA.GAMMA);
    this.b = Math.pow(b, ColorRGBA.GAMMA);
    this.g = Math.pow(g, ColorRGBA.GAMMA);
    this.a = a;
    return this;
  }

  /**
   * Get the color in sRGB color space as a <code>ColorRGBA</code>.
   *
   * Note that linear values stored in the ColorRGBA will be gamma corrected
   * and returned as a ColorRGBA.
   *
   * The x attribute will be fed with the r channel in sRGB space.
   * The y attribute will be fed with the g channel in sRGB space.
   * The z attribute will be fed with the b channel in sRGB space.
   * The w attribute will be fed with the a channel.
   *
   * Note that no correction will be performed on the alpha channel as it
   * conventionally doesn't represent a color itself.
   *
   * @return the color in sRGB color space as a ColorRGBA.
   */
  public getAsSrgb(): ColorRGBA {
    const srgb: ColorRGBA = new ColorRGBA();
    const invGama: number = 1 / ColorRGBA.GAMMA;
    srgb.r = Math.pow(this.r, invGama);
    srgb.g = Math.pow(this.g, invGama);
    srgb.b = Math.pow(this.b, invGama);
    srgb.a = this.a;
    return srgb;
  }

}
