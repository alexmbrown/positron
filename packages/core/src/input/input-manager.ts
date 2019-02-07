import { RawInputListener } from './raw-input-listener';
import { KeyInput } from './key-input';
import { KeyInputEvent } from './event/key-input-event';
import { Trigger } from './controls/trigger';
import { InputMapping } from './input-mapping';
import { InputEvent } from './event/input-event';
import { KeyTrigger } from './controls/key-trigger';
import { InputListener } from './controls/input-listener';
import { MouseButtonEvent } from './event/mouse-button-event';
import { MouseMotionEvent } from './event/mouse-motion-event';
import { MouseButtonTrigger } from './controls/mouse-button-trigger';
import { MouseInput } from './mouse-input';
import { MouseAxisTrigger } from './controls/mouse-axis-trigger';
import { FastMath } from '../math/fast-math';
import { AnalogListener, OnAnalog } from './controls/analog-listener';
import { ActionListener, OnAction } from './controls/action-listener';
import has = Reflect.has;

export class InputManager implements RawInputListener {

  private frameTPF: number;
  private lastLastUpdateTime: number = 0;
  private lastUpdateTime: number = 0;
  private frameDelta: number = 0;
  private globalAxisDeadZone = 0.05;

  private firstTime: number = 0;
  private mappings: {[key: string]: InputMapping} = {};
  private bindings: {[key: number]: InputMapping[]} = {};
  private inputQueue: InputEvent[] = [];
  private rawListeners: RawInputListener[] = [];
  private pressedButtons: {[number: number]: number} = {};
  private axisValues: {[number: number]: number} = {};

  private safeMode: boolean = false;
  private eventsPermitted: boolean = false;

  constructor(private keys: KeyInput, private mouse: MouseInput) {
    if (!this.keys || !this.mouse) {
      throw new Error("Mouse and keyboard must be defined");
    }

    keys.setInputListener(this);
    mouse.setInputListener(this);
    this.firstTime = keys.getInputTime();
  }

  public beginInput(): void {}

  public endInput(): void {}

  public onKeyEvent(evt: KeyInputEvent): void {
    this.inputQueue.push(evt);
  }

  public addMapping(mappingName: string, ...triggers: Trigger[]): void {
    let mapping: InputMapping = this.mappings[mappingName];
    if (!mapping) {
      mapping = new InputMapping(mappingName);
      this.mappings[mappingName] =  mapping;
    }

    triggers.forEach((trigger: Trigger) => {
      const hash: number = trigger.triggerHashCode();
      let names: InputMapping[] = this.bindings[hash];
      if (!Array.isArray(names)) {
        names = [];
        this.bindings[hash] = names;
      }
      if (names.indexOf(mapping) < 0) {
        names.push(mapping);
        mapping.triggers.push(hash);
      } else {
        console.log("Attempted to add mapping \"{0}\" twice to trigger.", mappingName);
      }
    });

  }

  public update(tpf: number): void {
    this.frameTPF = tpf;

    // Activate safemode if the TPF value is so small
    // that rounding errors are inevitable
    this.safeMode = tpf < 0.015;

    const currentTime: number = this.keys.getInputTime();
    this.frameDelta = currentTime - this.lastUpdateTime;

    this.eventsPermitted = true;

    this.keys.update();
    this.mouse.update();

    this.eventsPermitted = false;

    this.processQueue();
    this.invokeUpdateActions();

    this.lastLastUpdateTime = this.lastUpdateTime;
    this.lastUpdateTime = currentTime;
  }

  private processQueue(): void {
    const queueSize: number = this.inputQueue.length;

    this.rawListeners.forEach((listener: RawInputListener) => {
      listener.beginInput();

      for (let j = 0; j < queueSize; j++) {
        let event: InputEvent = this.inputQueue[j];
        if (event.isConsumed()) {
          continue;
        }

        if (event instanceof MouseMotionEvent) {
          listener.onMouseMotionEvent(event);
        } else if (event instanceof KeyInputEvent) {
          listener.onKeyEvent(event);
        } else if (event instanceof MouseButtonEvent) {
          listener.onMouseButtonEvent(event);
        } else if (event instanceof KeyInputEvent) {
          listener.onKeyEvent(event);
        }
      }

      listener.endInput();
    });

    for (let i = 0; i < queueSize; i++) {
      const event: InputEvent = this.inputQueue[i];
      if (event.isConsumed()) {
        continue;
      }

      if (event instanceof MouseMotionEvent) {
        this.onMouseMotionEventQueued(event);
      } else if (event instanceof KeyInputEvent) {
        this.onKeyEventQueued(event);
      } else if (event instanceof MouseButtonEvent) {
        this.onMouseButtonEventQueued(event);
      } else if (event instanceof KeyInputEvent) {
        this.onKeyEventQueued(event);
      }

      event.setConsumed();
    }

    this.inputQueue = [];
  }

  private onKeyEventQueued(evt: KeyInputEvent): void {
    if (evt.isRepeating()) {
      return;
    }

    const hash: number = KeyTrigger.keyHash(evt.getKeyCode());
    this.invokeActions(hash, evt.isPressed());
    this.invokeTimedActions(hash, evt.getTime(), evt.isPressed());
  }

  private invokeActions(hash: number, pressed: boolean): void {
    const maps: InputMapping[] = this.bindings[hash];
    if (!Array.isArray(maps) || maps.length <= 0) {
      return;
    }

    const size: number = maps.length;
    for (let i = size - 1; i >= 0; i--) {
      const mapping: InputMapping = maps[i];
      const listeners: InputListener[] = mapping.listeners;
      const listenerSize: number = listeners.length;
      for (let j = listenerSize - 1; j >= 0; j--) {
        const listener: InputListener = listeners[j];
        if (listener instanceof ActionListener) {
          listener.onAction(mapping.getName(), pressed, this.frameTPF);
        }
      }
    }
  }

  private invokeUpdateActions(): void {
    for (let hashKey in this.pressedButtons) {
      const hash = parseInt(hashKey);

      const pressTime: number = this.pressedButtons[hash];
      const timeDelta: number = this.lastUpdateTime - Math.max(this.lastLastUpdateTime, pressTime);

      if (timeDelta > 0) {
        this.invokeAnalogs(hash, this.computeAnalogValue(timeDelta), false);
      }
    }

    for (let hashKey in this.axisValues) {
      const hash = parseInt(hashKey);
      const value: number = this.axisValues[hash];
      this.invokeAnalogs(hash, value * this.frameTPF, true);
    }
  }

  private invokeAnalogs(hash: number, value: number, isAxis: boolean): void {
    const maps = this.bindings[hash];
    if (!maps) {
      return;
    }

    if (!isAxis) {
      value *= this.frameTPF;
    }

    const size: number = maps.length;
    for (let i = size - 1; i >= 0; i--) {
      const mapping: InputMapping = maps[i];
      const listeners: InputListener[] = mapping.listeners;
      const listenerSize: number = listeners.length;
      for (let j = listenerSize - 1; j >= 0; j--) {
        const listener: InputListener = listeners[j];
        if (listener instanceof AnalogListener) {
          listener.onAnalog(mapping.getName(), value, this.frameTPF);
        }
      }
    }
  }

  private invokeAnalogsAndActions(hash: number, value: number, effectiveDeadZone: number, applyTpf: boolean): void {

    if (value < effectiveDeadZone) {
      this.invokeAnalogs(hash, value, !applyTpf);
      return;
    }

    const maps: InputMapping[] = this.bindings[hash];
    if (maps == null) {
      return;
    }

    const valueChanged: boolean = !this.axisValues[hash];
    if (applyTpf) {
      value *= this.frameTPF;
    }

    const size: number = maps.length;
    for (let i = size - 1; i >= 0; i--) {
      const mapping: InputMapping = maps[i];
      const listeners: InputListener[] = mapping.listeners;
      const listenerSize: number = listeners.length;
      for (let j = listenerSize - 1; j >= 0; j--) {
        const listener: InputListener = listeners[j];

        if (listener instanceof ActionListener && valueChanged) {
          listener.onAction(mapping.getName(), true, this.frameTPF);
        } else if (listener instanceof AnalogListener) {
          listener.onAnalog(mapping.getName(), value, this.frameTPF);
        }

      }
    }
  }

  private computeAnalogValue(timeDelta: number): number {
    if (this.safeMode || this.frameDelta == 0) {
      return 1.0;
    } else {
      return FastMath.clamp(timeDelta / this.frameDelta, 0, 1);
    }
  }

  private invokeTimedActions(hash: number, time: number, pressed: boolean): void {
    if (!this.bindings[hash]) {
      return;
    }

    if (pressed) {
      this.pressedButtons[hash] = time;
    } else {
      const pressTimeObj: number = this.pressedButtons[hash];
      delete this.pressedButtons[hash];
      if (!pressTimeObj) {
        return;
      }

      const pressTime: number = pressTimeObj;
      const lastUpdate: number = this.lastLastUpdateTime;
      const releaseTime: number = time;
      const timeDelta: number = releaseTime - Math.max(pressTime, lastUpdate);

      if (timeDelta > 0) {
        this.invokeAnalogs(hash, this.computeAnalogValue(timeDelta), false);
      }
    }
  }

  public addListener(listener: OnAction, ...mappingNames: string[]): void {
    this.mapListener(new ActionListener(listener), mappingNames);
  }

  public addAnalogListener(listener: OnAnalog, ...mappingNames: string[]): void {
    this.mapListener(new AnalogListener(listener), mappingNames);
  }

  private mapListener(listener: InputListener, mappingNames: string[]): void {
    mappingNames.forEach((mappingName: string) => {
      let mapping: InputMapping = this.mappings[mappingName];
      if (!mapping) {
        mapping = new InputMapping(mappingName);
        this.mappings[mappingName] = mapping;
      }
      if (mapping.listeners.indexOf(listener) < 0) {
        mapping.listeners.push(listener);
      }
    });
  }

  public onMouseButtonEvent(evt: MouseButtonEvent): void {
    // cursorPos.set(evt.getX(), evt.getY());
    this.inputQueue.push(evt);
  }

  private onMouseButtonEventQueued(evt: MouseButtonEvent): void {
    const hash: number = MouseButtonTrigger.mouseButtonHash(evt.getButtonIndex());
    this.invokeActions(hash, evt.isPressed());
    this.invokeTimedActions(hash, evt.getTime(), evt.isPressed());
  }

  public onMouseMotionEvent(evt: MouseMotionEvent): void {
    // cursorPos.set(evt.getX(), evt.getY());
    this.inputQueue.push(evt);
  }

  private onMouseMotionEventQueued(evt: MouseMotionEvent): void {
    if (evt.getDX() !== 0) {
      const val: number = Math.abs(evt.getDX()) / 1024.0;
      this.invokeAnalogsAndActions(MouseAxisTrigger.mouseAxisHash(MouseInput.AXIS_X, evt.getDX() < 0), val, this.globalAxisDeadZone, false);
    }
    if (evt.getDY() !== 0) {
      const val: number = Math.abs(evt.getDY()) / 1024.0;
      this.invokeAnalogsAndActions(MouseAxisTrigger.mouseAxisHash(MouseInput.AXIS_Y, evt.getDY() < 0), val, this.globalAxisDeadZone, false);
    }
    if (evt.getDeltaWheel() !== 0) {
      const val: number = Math.abs(evt.getDeltaWheel()) / 100.0;
      this.invokeAnalogsAndActions(MouseAxisTrigger.mouseAxisHash(MouseInput.AXIS_WHEEL, evt.getDeltaWheel() < 0), val, this.globalAxisDeadZone, false);
    }
  }

}
