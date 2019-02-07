export enum SpatialCullHint {
  /**
   * Do whatever our parent does. If no parent, default to Dynamic.
   */
  Inherit,
  /**
   * Do not draw if we are not at least partially within the view frustum
   * of the camera. This is determined via the defined
   * Camera planes whether or not this Spatial should be culled.
   */
  Dynamic,
  /**
   * Always cull this from the view, throwing away this object
   * and any children from rendering commands.
   */
  Always,
  /**
   * Never cull this from view, always draw it.
   * Note that we will still get culled if our parent is culled.
   */
  Never
}
