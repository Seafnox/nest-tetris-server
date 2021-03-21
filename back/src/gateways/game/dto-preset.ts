import { ServerEventDto } from '~tetris/dto/server-event.dto';

export type DtoPreset<Dto extends ServerEventDto> = Omit<Dto, 'id'|'username'>;
