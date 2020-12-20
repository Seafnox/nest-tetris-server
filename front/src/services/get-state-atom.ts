export function getStateAtom<T>(initialState?: T) {
  type StateChangeHandler = (state: T) => void;

  let state: T = initialState;
  const handlers: StateChangeHandler[] = [];

  const setState = (newState: T): void => {
    state = newState;

    handlers.forEach(cb => cb(state));
  }

  const onStateChange = (cb: StateChangeHandler): void => {
    handlers.push(cb);

    cb(state);
  }

  const getState = (): T => state;

  return {
    setState,
    onStateChange,
    getState,
  }
}
