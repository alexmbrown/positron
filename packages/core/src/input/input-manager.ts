import { RawInputListener } from './raw-input-listener';
import { KeyInput } from './key-input';
import { KeyInputEvent } from './event/key-input-event';
import { Trigger } from './controls/trigger';
import { InputMapping } from './input-mapping';
import { InputEvent } from './event/input-event';
import { KeyTrigger } from './controls/key-trigger';
import { InputListener } from './controls/input-listener';

export class InputManager implements RawInputListener {

  private frameTPF: number;
  private lastLastUpdateTime: number = 0;
  private lastUpdateTime: number = 0;
  private frameDelta: number = 0;

  private firstTime: number = 0;
  private mappings: {[key: string]: InputMapping} = {};
  private bindings: {[key: number]: InputMapping[]} = {};
  private inputQueue: InputEvent[] = [];
  private rawListeners: RawInputListener[] = [];
  private pressedButtons: {[number: number]: number} = {};

  private safeMode: boolean = false;
  private eventsPermitted: boolean = false;

  constructor(private keys: KeyInput) {
    if (!this.keys) {
      throw new Error("Mouse and keyboard must be defined");
    }

    this.keys = keys;

    keys.setInputListener(this);

    this.firstTime = keys.getInputTime();
  }

  public beginInput(): void {
  }

  public endInput(): void {
  }

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
    // this.mouse.update();

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

        // if (event instanceof MouseMotionEvent) {
        //   listener.onMouseMotionEvent((MouseMotionEvent) event);
        // } else if (event instanceof KeyInputEvent) {
        //   listener.onKeyEvent((KeyInputEvent) event);
        // } else if (event instanceof MouseButtonEvent) {
        //   listener.onMouseButtonEvent((MouseButtonEvent) event);
        // }

        if (event instanceof KeyInputEvent) {
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

      // if (event instanceof MouseMotionEvent) {
      //   onMouseMotionEventQueued((MouseMotionEvent) event);
      // } else if (event instanceof KeyInputEvent) {
      //   onKeyEventQueued((KeyInputEvent) event);
      // } else if (event instanceof MouseButtonEvent) {
      //   onMouseButtonEventQueued((MouseButtonEvent) event);
      // } else if (event instanceof JoyAxisEvent) {
      //   onJoyAxisEventQueued((JoyAxisEvent) event);
      // }

      if (event instanceof KeyInputEvent) {
        this.onKeyEventQueued(event);
      }

      event.setConsumed();
    }

    this.inputQueue = [];
  }

  private onKeyEventQueued(evt: KeyInputEvent): void {
    console.log('Key Event');
    if (evt.isRepeating()) {
      return;
    }

    const hash: number = KeyTrigger.keyHash(evt.getKeyCode());
    this.invokeActions(hash, evt.isPressed());
    // this.invokeTimedActions(hash, evt.getTime(), evt.isPressed());
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
        if (listener instanceof Function) {
          listener(mapping.getName(), pressed, this.frameTPF);
        }
      }
    }
  }

  private invokeUpdateActions(): void {
    for (let hash in this.pressedButtons) {

      const pressTime: number = this.pressedButtons[hash];
      const timeDelta: number = this.lastUpdateTime - Math.max(this.lastLastUpdateTime, pressTime);

      // TODO
      // if (timeDelta > 0) {
      //   this.invokeAnalogs(hash, computeAnalogValue(timeDelta), false);
      // }
    }

    // for (Entry<Float> axisValue : axisValues) {
    //   int hash = axisValue.getKey();
    //   float value = axisValue.getValue();
    //   invokeAnalogs(hash, value * frameTPF, true);
    // }
  }

  public addListener(listener: InputListener, ...mappingNames: string[]): void {
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

}
