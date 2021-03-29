const { parentPort, workerData } = require("worker_threads");
import { BehaviorSubject } from 'rxjs';
import { GameStateDto } from '../dto/game-state-dto';
import { GameApiService } from './game-api-service';

interface Game {
  game: GameStateDto;
  nextItem: GameStateDto;
}

const socketApi = new GameApiService();
const userName = `bot-${Math.floor(Math.random()*1000)}`;
const gameState$ = new BehaviorSubject<Partial<Game>>({});

function patchGameState(gameState: Partial<Game>) {
  const current = gameState$.value;

  gameState$.next({
    ...current,
    ...gameState,
  })
}

socketApi.whenConnected$().subscribe(() => {
  socketApi.registerUser({ userName });
});

socketApi.onSignOn$.subscribe(data => {
  socketApi.startPlaying();
});

socketApi.onNextItemUpdated$.subscribe(data => patchGameState({nextItem: data.item }));
socketApi.onGameFieldUpdated$.subscribe(data => patchGameState({game: data.state }));

// Main thread will pass the data you need
// through this event listener.
parentPort.on("message", (param) => {
  if (typeof param !== "number") {
    throw new Error("param must be a number.");
  }

  // Access the workerData.
  console.log("workerData is", workerData);

  // return the result to main thread.
  parentPort.postMessage(123);
});
