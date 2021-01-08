export interface StateAtom<Atom> {
  setState(newState: Atom): void;
  getState(): Atom;
  addListener(cb: (state: Atom) => void): symbol;
  removeListener(listenerId: symbol): void;
}

export function getStateAtom<Atom>(initialState?: Atom): StateAtom<Atom> {
  type StateChangeHandler = (state: Atom) => void;

  let state: Atom = initialState;
  const listenState = {
    listenerIds: [], // symbol[]
    listeners: {}, // Record<symbol, StateChangeHandler>
  }

  const setState = (newState: Atom): void => {
    state = newState;

    setTimeout(() => {
      listenState.listenerIds.forEach(listenerId => listenState.listeners[listenerId](state));
    });
  }

  const addListener = (cb: StateChangeHandler): symbol => {
    const listenerId = Symbol();

    listenState.listeners[listenerId] = cb;
    listenState.listenerIds = [
      ...listenState.listenerIds,
      listenerId,
    ]

    setTimeout(() => cb(state));

    return listenerId;
  }

  const removeListener = (listenerId: symbol): void => {
    listenState.listenerIds = listenState.listenerIds.filter(current => current !== listenerId);
    listenState.listeners[listenerId] = undefined;
  }

  const getState = (): Atom => state;

  return {
    setState,
    getState,
    addListener,
    removeListener,
  }
}
