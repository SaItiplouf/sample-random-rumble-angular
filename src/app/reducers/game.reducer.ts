import { createReducer, on } from '@ngrx/store';
import { resetGame, startButtonClick, incrementClickCount } from '../actions/game.action';
import { IMonster, initialMonster } from './../models/monster.model';
import { IPlayer } from './../models/player.model';
import { setGameState } from '../actions/game.action';

import {
  hitMonster,
  initPlayers,
  healPlayer,
  updatePlayerScore,
  setPlayerDead,
  enflammer, isProtected
} from './../actions/player.action';
import {hitPlayer, setMonsterOnDamage, setMonsterOnFire, setMonsterOnPoison} from "../actions/monster.action";

export interface GameState {
  monster: IMonster;
  players: IPlayer[];
  hitHistory: { playerId: number, damage: number }[];
  clickCount: number;
  showButton: boolean;
  gameState: 'running' | 'win' | 'lose';
}

export const initialState: GameState = {
  monster: initialMonster,
  players: [],
  hitHistory: [],
  clickCount: 0,
  showButton: false,
  gameState: 'running',
};

export const gameReducer = createReducer(
  initialState,
  on(initPlayers, (state, { players }) => ({
    ...state,
    players: players
  })),
  on(startButtonClick, (state) => ({
    ...state,
    showButton: true
  })),
  on(incrementClickCount, (state) => ({
    ...state,
    clickCount: state.clickCount + 1
  })),
  on(hitMonster, (state, { damage, playerId }) => {
    const hit = state.hitHistory.find(h => h.playerId === playerId);
    console.log(`Monster hit by player ${playerId} with damage ${damage}`);
    return {
      ...state,
      monster: {
        ...state.monster,
        pv: state.monster.pv - damage
      },
      hitHistory: [...state.hitHistory, { playerId, damage }],
      showButton: false,
      clickCount: 0
    };
  }),
  on(hitPlayer, (state, { player, damage }) => {
    const hit = state.hitHistory.find(h => h.playerId === player.id);
    console.log(`Player ${player.id} hit by monster with damage ${damage}`);
    const updatedPlayers = state.players.map(p =>
      p.id === player.id ? { ...p, pv: p.pv - damage } : p
    );
    return {
      ...state,
      players: updatedPlayers,
      hitHistory: [...state.hitHistory, { playerId: player.id, damage }]
    };
  }),
  on(healPlayer, (state, { player, heal }) => {
    const updatedPlayers = state.players.map(p => {
      if (p.id === player.id) {
        const newHealth = p.pv + heal;
        const updatedHealth = newHealth > 100 ? 100 : newHealth;
        return { ...p, pv: updatedHealth };
      }
      return p;
    });

    return {
      ...state,
      players: updatedPlayers
    };
  }),
  on(updatePlayerScore, (state, { playerId, score }) => {
    const updatedPlayers = state.players.map(player => {
      if (player.id === playerId) {
        return { ...player, score: score };
      }
      return player;
    });
    return { ...state, players: updatedPlayers };
  }),
  on(setPlayerDead, (state, { playerId }) => {
    const updatedPlayers = state.players.map(player => {
      if (player.id === playerId) {
        return { ...player, isDead: true };
      }
      return player;
    });
    return { ...state, players: updatedPlayers };
  }),
  on(enflammer, (state, action) => {
    return {...state}; // retourner le nouvel état
  }),
  on(isProtected, (state, { playerId }) => {
    const updatedPlayers = state.players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          isProtected: !player.isProtected
        };
      }
      return player;
    });

    return {
      ...state,
      players: updatedPlayers
    };
  }),
  on(setGameState, (state, { gameState }) => ({
    ...state,
    gameState
  })),
  on(setMonsterOnDamage, (state, { isMonsterOnDamage }) => ({
    ...state,
    monster: {
      ...state.monster,
      isMonsterOnDamage
    }
  })),
  on(setMonsterOnFire, (state, { isMonsterOnFire }) => ({
    ...state,
    monster: {
      ...state.monster,
      isMonsterOnFire
    }
  })),
  on(setMonsterOnPoison, (state, { isMonsterOnPoison }) => ({
    ...state,
    monster: {
      ...state.monster,
      isMonsterOnPoison
    }
  })),
  on(resetGame, () => initialState)
);
