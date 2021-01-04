export interface StateAtom<Atom> {
  setState(newState: Atom): void;
  onStateChange(cb: (state: Atom) => void): void;
  getState(): Atom;
}

export function getStateAtom<Atom>(initialState?: Atom): StateAtom<Atom> {
  type StateChangeHandler = (state: Atom) => void;

  let state: Atom = initialState;
  const handlers: StateChangeHandler[] = [];

  const setState = (newState: Atom): void => {
    state = newState;

    handlers.forEach(cb => cb(state));
  }

  const onStateChange = (cb: StateChangeHandler): void => {
    handlers.push(cb);

    cb(state);
  }

  const getState = (): Atom => state;

  return {
    setState,
    onStateChange,
    getState,
  }
}
