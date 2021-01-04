export class InjectorFactory {
  private static unit: InjectorService;

  public static get(): InjectorService {
    if (!InjectorFactory.unit) {
      InjectorFactory.unit = new InjectorService();
    }

    return InjectorFactory.unit;
  }
}

export class InjectorService {
  private injectionMap = new Map();

  public inject<T>(clazz: { new (injector: InjectorService): T }): T {
    if (!this.injectionMap.has(clazz)) {
      const unit = this.initialize(clazz);

      this.injectionMap.set(clazz, unit);
    }

    return this.injectionMap.get(clazz);
  }

  private initialize<T>(clazz: { new (injector: InjectorService): T }): T {
    try {
      return new clazz(this);
    } catch (error) {
      throw new Error(`${this.constructor.name}: ${error.message} (${typeof clazz} ${clazz?.constructor?.name})`);
    }
  }
}
