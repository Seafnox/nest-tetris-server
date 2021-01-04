const disableMethodLogger = function(): Function {
  return function (target, methodName: string, descriptor) {
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, methodName);
    }

    const originalMethod = descriptor.value;
    originalMethod.__loggerMonkeyPatchCompleted = true;

    return descriptor;
  };
};

export function DisableMethodLogger(): Function {
  return disableMethodLogger();
}
