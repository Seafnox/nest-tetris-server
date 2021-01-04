import { FunctionLoggerOptions } from './function-logger-options.interface';
import { logMessage } from './log-message';

export function getMonkeyPatchedMethod(method: Function, methodName: string, options: FunctionLoggerOptions): Function {
    return function(...args) {
        logMessage(true, this, methodName, method, args, options);
        const result = method.apply(this, args);
        logMessage(false, this, methodName, method, args, options);

        return result;
    };
}
