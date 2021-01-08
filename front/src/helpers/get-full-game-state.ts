import { GameStateDto } from '~tetris/dto/game-state-dto';
import { getStateAtom } from './get-state-atom';

interface FullGameState {
  onViewChange: (cb: (state: GameStateDto) => void) => void,
  setView: (state: GameStateDto) => void,
  onNextItemChange: (cb: (state: GameStateDto) => void) => void,
  setNextItem: (state: GameStateDto) => void,
  onScoreChange: (cb: (state: number) => void) => void,
  setScore: (state: number) => void,
  onLevelChange: (cb: (state: number) => void) => void,
  setLevel: (state: number) => void,
}

export function getFullGameState(): FullGameState {
  const {setState: setView, onStateChange: onViewChange} = getStateAtom<GameStateDto>();
  const {setState: setNextItem, onStateChange: onNextItemChange} = getStateAtom<GameStateDto>();
  const {setState: setScore, onStateChange: onScoreChange} = getStateAtom<number>();
  const {setState: setLevel, onStateChange: onLevelChange} = getStateAtom<number>();

  return {
    onViewChange,
    onNextItemChange,
    onScoreChange,
    onLevelChange,
    setView,
    setNextItem,
    setScore,
    setLevel,
  };
}
