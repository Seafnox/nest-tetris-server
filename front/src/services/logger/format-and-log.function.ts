export interface FormatAndLogFunction {
    (time: string, className: string, functionName: string, isStartLog: boolean, args: string[], props: string[]): void
}
