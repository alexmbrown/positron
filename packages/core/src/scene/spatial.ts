export abstract class Spatial {

  constructor(private name: string) {
    this.name = name;
    localTransform = new Transform();
    worldTransform = new Transform();

    localLights = new LightList(this);
    worldLights = new LightList(this);

    localOverrides = new SafeArrayList<>(MatParamOverride.class);
    worldOverrides = new SafeArrayList<>(MatParamOverride.class);
    refreshFlags |= RF_BOUND;
  }

}
