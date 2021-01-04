import { FunctionLoggerOptions } from './function-logger-options.interface';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

const ARGUMENT_NAMES = /([^\s,]+)/g;

export const getArgsStrings = function(argValues: any[], func: Function, options: FunctionLoggerOptions): string[] {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let argNames: string[] | null = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(argNames === null)
    return [];

  const requiredArgNames = (options.withArgs instanceof Array) ? options.withArgs : argNames;

  return requiredArgNames.map(function (argName: string): number {
    return argNames.indexOf(argName);
  }).map(function (argNameIndex: number): string {
    if (argNameIndex === -1 || argNameIndex >= argValues.length) return '';

    return `[${argNames[argNameIndex]}=${argValues[argNameIndex]}]`
  });
};
