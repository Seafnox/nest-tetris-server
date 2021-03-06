import { FunctionLoggerOptions } from './function-logger-options.interface';

export const defaultFunctionOptions: FunctionLoggerOptions = {
  withArgs: true,
  withTime: false,
  withClassProperties: false,
  logFunction: console.info
};
