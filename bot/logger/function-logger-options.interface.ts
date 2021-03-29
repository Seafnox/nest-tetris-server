import { FormatAndLogFunction } from './format-and-log.function';
import { LogFunction } from './log.function';

export interface FunctionLoggerOptions {
  withArgs?: boolean | string[],
  withTime?: boolean,
  withClassProperties?: boolean | string[],
  logFunction?: LogFunction,
  formatAndLogFunction?: FormatAndLogFunction
}
