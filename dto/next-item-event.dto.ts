import { GameStateDto } from './game-state-dto';
import { ServerEventDto } from './server-event.dto';

export interface NextItemEventDto extends ServerEventDto {
  item: GameStateDto,
}
