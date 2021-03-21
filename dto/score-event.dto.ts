import { ServerEventDto } from './server-event.dto';

export interface ScoreEventDto extends ServerEventDto {
  value: number,
}
