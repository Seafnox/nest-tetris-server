import { GameStateDto } from '~tetris/dto/game-state-dto';
import { getStateAtom } from './get-state-atom';

interface FullGameState {
  addViewListener: (cb: (state: GameStateDto) => void) => symbol,
  removeViewListener: (listenerId: symbol) => void,
  setView: (state: GameStateDto) => void,

  addNextItemListener: (cb: (state: GameStateDto) => void) => symbol,
  removeNextItemListener: (listenerId: symbol) => void,
  setNextItem: (state: GameStateDto) => void,

  addScoreListener: (cb: (state: number) => void) => symbol,
  removeScoreListener: (listenerId: symbol) => void,
  setScore: (state: number) => void,

  addLevelListener: (cb: (state: number) => void) => symbol,
  removeLevelListener: (listenerId: symbol) => void,
  setLevel: (state: number) => void,
}

export function getFullGameState(): FullGameState {
  const {setState: setView, addListener: addViewListener, removeListener: removeViewListener} = getStateAtom<GameStateDto>();
  const {setState: setNextItem, addListener: addNextItemListener, removeListener: removeNextItemListener} = getStateAtom<GameStateDto>();
  const {setState: setScore, addListener: addScoreListener, removeListener: removeScoreListener} = getStateAtom<number>();
  const {setState: setLevel, addListener: addLevelListener, removeListener: removeLevelListener} = getStateAtom<number>();

  return {
    addViewListener,
    addNextItemListener,
    addScoreListener,
    addLevelListener,
    removeViewListener,
    removeNextItemListener,
    removeScoreListener,
    removeLevelListener,
    setView,
    setNextItem,
    setScore,
    setLevel,
  };
}
