import { GameStateDto } from './game-state-dto';
import { ServerEventDto } from './server-event.dto';

export interface GameStateEventDto extends ServerEventDto {
  state: GameStateDto,
}
