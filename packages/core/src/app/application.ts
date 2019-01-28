import { SystemListener } from '../system/system-listener';
import { ContextType } from '../system/context-type';
import { System } from '../system/system';
import { Context } from '../system/context';
import { Timer } from '../system/timer';
import { PerformanceTimer } from '../system/performance-timer';
import { KeyInput } from '../input/key-input';
import { InputManager } from '../input/input-manager';

export class Application implements SystemListener {

  // protected render;
  // protected renderManager;
  protected timer: Timer = new PerformanceTimer();
  // protected camera;
  protected keyInput: KeyInput;
  public inputManager: InputManager;

  protected speed: number = 1.0;
  protected paused: boolean = false;

  // protected prof: AppProfiler;

  private context: Context;

  /*
   * Attach canvas to element or body
   */
  attach(element?: HTMLElement) {
    this.context.attach(element);
  }

  /**
   * Starts the application.
   * Creating a rendering context and executing
   * the main loop in a separate thread.
   */
  start(contextType: ContextType = ContextType.Display) {
    // TODO: load settings
    this.context = System.newContext(contextType);
    this.context.setSystemListener(this);
    this.context.create();

    // TODO: this is probably in the wrong spot
    // setTimeout(() => this.context.start, 0);
    this.initialize();
    this.context.start();
  }

  private initInput(): void {
    this.keyInput = this.context.getKeyInput();
    if (this.keyInput != null) {
      this.keyInput.initialize();
    }

    this.inputManager = new InputManager(this.keyInput);
  }

  destroy(): void {
    console.log('destroy');
  }

  gainFocus(): void {
    console.log('gainFocus');
  }

  handleError(errorMsg: string, t: Error): void {
    console.log('handleError');
  }

  loseFocus(): void {
    console.log('loseFocus');
  }

  requestClose(esc: boolean): void {
    console.log('requestClose');
  }

  reshape(width: number, height: number): void {
    console.log('reshape');
  }

  update(): void {
    // if (prof!=null) prof.appStep(AppStep.BeginFrame);

    // super.update(); // makes sure to execute AppTasks
    this.timer.update();
    this.inputManager.update(this.timer.getTimePerFrame());


    if (this.speed == 0 || this.paused) {
      return;
    }

    const tpf: number = this.timer.getTimePerFrame() * this.speed;

    // update states
    // if (prof!=null) prof.appStep(AppStep.StateManagerUpdate);
    // stateManager.update(tpf);

    // simple update and root node
    // simpleUpdate(tpf);

    // if (prof!=null) prof.appStep(AppStep.SpatialUpdate);
    // rootNode.updateLogicalState(tpf);
    // guiNode.updateLogicalState(tpf);

    // rootNode.updateGeometricState();
    // guiNode.updateGeometricState();

    // render states
    // if (prof!=null) prof.appStep(AppStep.StateManagerRender);
    // stateManager.render(renderManager);

    // if (prof!=null) prof.appStep(AppStep.RenderFrame);
    // renderManager.render(tpf, context.isRenderable());
    // simpleRender(renderManager);
    // stateManager.postRender();

    // if (prof!=null) prof.appStep(AppStep.EndFrame);
  }

  public initialize(): void {
    // TODO: assetManager
    // if (assetManager == null){
    //   initAssetManager();
    // }

    // TODO: initDisplay();
    // TODO: initCamera();

    // if (inputEnabled){
      this.initInput();
    // }
    // TODO: initAudio();

    this.timer.reset();

  }

}
