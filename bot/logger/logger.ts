import { defaultFunctionOptions } from './default-function-logger-options';
import { getMonkeyPatchedMethod } from './getMonkeyPatchedMethod';

function patchMethodForLogging(options = defaultFunctionOptions): Function {
  return (target, methodName: string, descriptor: PropertyDescriptor) => {
    if (descriptor === undefined) {
      descriptor = Object.getOwnPropertyDescriptor(target, methodName);
    }

    const originalMethod = descriptor.value;

    descriptor.value = getMonkeyPatchedMethod(originalMethod, methodName, options);
    descriptor.value.__loggerMonkeyPatchCompleted = true;

    return descriptor;
  };
}

export function Logger(options = defaultFunctionOptions): Function {
  return patchMethodForLogging(options);
}

export function LoggerWithoutArgs(options = defaultFunctionOptions): Function {
  const fixedOptions = {
    ...options,
    withArgs: false,
  };

  return patchMethodForLogging(fixedOptions);
}
