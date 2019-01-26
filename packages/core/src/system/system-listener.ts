export interface SystemListener {
  initialize(): void;
  reshape(width: number, height: number): void;
  update(): void;
  requestClose(esc: boolean): void;
  gainFocus(): void;
  loseFocus(): void;
  handleError(errorMsg: string, t: Error): void;
  destroy(): void;
}
