import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class GameExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        console.log('exception', exception)
        console.log('exception, host', host)
        super.catch(exception, host);
    }
}
