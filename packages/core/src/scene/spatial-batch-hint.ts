export enum SpatialBatchHint {
  /**
   * Do whatever our parent does. If no parent, default to Always.
   */
  Inherit,
  /**
   * This spatial will always be batched when attached to a BatchNode.
   */
  Always,
  /**
   * This spatial will never be batched when attached to a BatchNode.
   */
  Never
}
