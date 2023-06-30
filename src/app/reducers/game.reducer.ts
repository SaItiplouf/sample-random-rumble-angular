import { createReducer, on } from '@ngrx/store';
import { resetGame } from '../actions/game.action';
import { IMonster, initialMonster } from './../models/monster.model';
import { IPlayer } from './../models/player.model';
import { hitMonster } from './../actions/player.action';
import { hitPlayer } from "../actions/monster.action";
import { Observable } from 'rxjs';
import { GameService } from '../services/game.service';

export interface GameState {
  monster: IMonster;
  players: IPlayer[];
  hitHistory: { playerId: number, damage: number }[];
}

export const initialPlayers$: Observable<IPlayer[]> = GameService.getPlayers(); // Utilisez la méthode getPlayers du service pour récupérer les joueurs

export const initialState: GameState = {
  monster: initialMonster,
  players: [],
  hitHistory: []
};

let updatedInitialState: GameState = initialState;

initialPlayers$.subscribe(players => {
  updatedInitialState = {
    ...updatedInitialState,
    players: players || []
  };
  console.log("REDUCER LOG INSTANT", updatedInitialState.players);
});

setTimeout(() => {
  console.log("REDUCER LOG 10 SECONDES", updatedInitialState.players);
}, 10000);

export const gameReducer = createReducer(
  initialState,
  on(hitMonster, (state, { damage, playerId }) => {
    const hit = state.hitHistory.find(h => h.playerId === playerId);
    console.log(`Monster hit by player ${playerId} with damage ${damage}`);
    return {
      ...state,
      monster: {
        ...state.monster,
        pv: state.monster.pv - damage
      },
      hitHistory: [...state.hitHistory, { playerId, damage }]
    };
  }),
  on(hitPlayer, (state, { player, damage }) => {
    const hit = state.hitHistory.find(h => h.playerId === player.id);
    console.log(`Player ${player.id} hit by monster with damage ${damage}`);
    const updatedPlayers = state.players.map(p =>
      p.id === player.id ? { ...p, pv: p.pv - damage } : p
    );
    const updatedPlayersFiltered = updatedPlayers.filter(p => p.pv > 0);
    return {
      ...state,
      players: updatedPlayersFiltered,
      hitHistory: [...state.hitHistory, { playerId: player.id, damage }]
    };
  }),
  on(resetGame, () => updatedInitialState)
);
