import { ServerEventDto } from './server-event.dto';

export interface BaseServerEventDto extends ServerEventDto {
  numUsers: number;
}
