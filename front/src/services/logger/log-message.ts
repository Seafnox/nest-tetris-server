import { FunctionLoggerOptions } from './function-logger-options.interface';
import { getArgsStrings } from './get-args-strings';
import { getClassName } from './get-class-name';
import { getPropertiesStrings } from './get-properties-strings';
import { getTime } from './get-time';

export const logMessage = function(isStart: boolean, targetInstance, functionName, originalFunction, functionArgsVals, options: FunctionLoggerOptions): void {
  const time = options.withTime ? `[${getTime()}\t` : ''

  const className = getClassName(targetInstance);
  const classNameStr = className ? `${className}::` : '';

  const logFunction = options.logFunction || console.info;

  const args = options.withArgs ? getArgsStrings(functionArgsVals, originalFunction, options) : null;
  const props = options.withClassProperties ? getPropertiesStrings(options.withClassProperties, targetInstance) : null;

  if (options.formatAndLogFunction) {
    options.formatAndLogFunction(time, classNameStr, functionName, isStart, args, props);
    return;
  }

  const startEndStr = isStart ? 'start' : 'end';
  logFunction(`${time}${classNameStr}${functionName}\t${startEndStr}`);

  args && args.length !== 0 && logFunction(`\tFunction arguments:\n\t\t${args.join('\n\t\t')}`);
  props && props.length !== 0 && logFunction(`\tClass properties:\n\t\t${props.join('\n\t\t')}`);
};
